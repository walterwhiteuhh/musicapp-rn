import type { Config, Context } from '@netlify/functions';
import OpenAI from 'openai';

import {
  isProfileTagsRequest,
  parseProfileTagSummary,
  type ProfileTagsRequest,
} from '../../src/domain/profileTags';

declare const Netlify:
  | {
      env: {
        get(name: string): string | undefined;
      };
    }
  | undefined;

type ChatMessage = {
  content?: string | null;
};

type OpenAIResponse = {
  choices?: {
    message?: ChatMessage;
  }[];
};

type AiProvider = 'netlify-openai' | 'openrouter';

type AiClientConfig = {
  apiKey: string;
  baseURL?: string;
  defaultHeaders?: Record<string, string>;
  model: string;
  provider: AiProvider;
};

const defaultModel = 'gpt-4o-mini';
const defaultOpenRouterBaseUrl = 'https://openrouter.ai/api/v1';
const defaultOpenRouterSiteUrl = 'https://klangfeld.netlify.app';
const defaultOpenRouterAppTitle = 'Klangfeld';

export default async function profileTags(req: Request, _context: Context): Promise<Response> {
  if (req.method !== 'POST') {
    return jsonResponse({ error: 'Method not allowed.' }, 405);
  }

  let payload: unknown;

  try {
    payload = await req.json();
  } catch {
    return jsonResponse({ error: 'Invalid JSON body.' }, 400);
  }

  if (!isProfileTagsRequest(payload)) {
    return jsonResponse({ error: 'Invalid profile tag request.' }, 400);
  }

  try {
    const summary = await generateProfileTags(payload);
    return jsonResponse(summary, 200);
  } catch {
    return jsonResponse({ error: 'AI profile tag generation failed.' }, 502);
  }
}

export const config: Config = {
  path: '/api/profile-tags',
  method: ['POST'],
};

async function generateProfileTags(profile: ProfileTagsRequest) {
  const aiConfig = resolveAiClientConfig();
  const openai = new OpenAI({
    apiKey: aiConfig.apiKey,
    baseURL: aiConfig.baseURL,
    defaultHeaders: aiConfig.defaultHeaders,
  });

  const completion = (await openai.chat.completions.create({
    model: aiConfig.model,
    response_format: { type: 'json_object' },
    messages: [
      {
        role: 'system',
        content:
          'You generate compact, database-friendly music taste profile tags. Return only valid JSON matching this schema: {"schemaVersion":1,"primaryEnergy":"low|medium|high","rhythmBias":"string","listeningIntent":"string","discoveryVector":["string"],"profileNotes":["string"],"confidence":0.0}. Keep text concise and avoid naming unavailable tracks.',
      },
      {
        role: 'user',
        content: JSON.stringify(profile),
      },
    ],
  })) as OpenAIResponse;

  const content = completion.choices?.[0]?.message?.content;

  if (!content) {
    throw new Error('AI response was empty.');
  }

  return parseProfileTagSummary(JSON.parse(content));
}

function resolveAiClientConfig(): AiClientConfig {
  const provider = getEnv('AI_PROVIDER') === 'openrouter' ? 'openrouter' : 'netlify-openai';
  const model = getEnv('AI_MODEL') ?? defaultModel;

  if (provider === 'openrouter') {
    const apiKey = getEnv('OPENROUTER_API_KEY');

    if (!apiKey) {
      throw new Error('OPENROUTER_API_KEY is required when AI_PROVIDER=openrouter.');
    }

    return {
      apiKey,
      baseURL: getEnv('OPENROUTER_BASE_URL') ?? defaultOpenRouterBaseUrl,
      defaultHeaders: {
        'HTTP-Referer': getEnv('OPENROUTER_SITE_URL') ?? defaultOpenRouterSiteUrl,
        'X-OpenRouter-Title': getEnv('OPENROUTER_APP_TITLE') ?? defaultOpenRouterAppTitle,
      },
      model,
      provider,
    };
  }

  return {
    apiKey: 'netlify-ai-gateway',
    baseURL: getEnv('OPENAI_BASE_URL'),
    model,
    provider,
  };
}

function getEnv(name: string) {
  return typeof Netlify !== 'undefined' ? Netlify.env.get(name) : undefined;
}

function jsonResponse(payload: unknown, status: number): Response {
  return Response.json(payload, {
    status,
    headers: {
      'Cache-Control': 'no-store',
    },
  });
}
