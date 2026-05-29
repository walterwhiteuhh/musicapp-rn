import type { Config, Context } from '@netlify/functions';
import OpenAI from 'openai';

import { createEmptyHybridFeatureVector } from '../../src/domain/features/HybridFeatureSchema';

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

type AnalyzeTrackRequest = {
  trackId: string;
  title: string;
  artistName: string;
  sourcePlatform: string;
  sourceUrl: string;
  genreHint?: string;
};

export default async function analyzeTrack(req: Request, _context: Context): Promise<Response> {
  if (req.method !== 'POST') {
    return jsonResponse({ error: 'Method not allowed.' }, 405);
  }

  let payload: unknown;

  try {
    payload = await req.json();
  } catch {
    return jsonResponse({ error: 'Invalid JSON body.' }, 400);
  }

  if (!isAnalyzeTrackRequest(payload)) {
    return jsonResponse({ error: 'Invalid analyze track request payload.' }, 400);
  }

  try {
    const analysis = await generateTrackAnalysis(payload);
    return jsonResponse(analysis, 200);
  } catch (error) {
    return jsonResponse({ error: 'AI track analysis failed.', details: String(error) }, 502);
  }
}

export const config: Config = {
  path: '/api/analyze-track',
  method: ['POST'],
};

async function generateTrackAnalysis(track: AnalyzeTrackRequest) {
  const gatewayBaseUrl = typeof Netlify !== 'undefined' ? Netlify.env.get('OPENAI_BASE_URL') : undefined;
  const openai = new OpenAI({
    apiKey: 'netlify-ai-gateway',
    baseURL: gatewayBaseUrl,
  });

  const systemPrompt = `You are the Klangfeld Acoustic Estimation Model. Analyze the given electronic music track and estimate its acoustic properties according to the Klangfeld Hybrid Feature Vector schema (schemaVersion 1).
Return only valid JSON matching this schema:
{
  "numeric": {
    "energy": number (0-100, representing volume/intensity/drive),
    "density": number (0-100, representing rhythmic/frequency density),
    "texture": number (0-100, synth/cold is high, organic/warm is low),
    "space": number (0-100, reverb/delay/space size),
    "rhythm": number (0-100, broken/breakbeat is high, straight 4/4 is low),
    "bpm_est": number (BPM estimate)
  },
  "ordinal": {
    "kick_pressure_level": "low" | "medium" | "high" | "extreme",
    "drop_density_level": "low" | "medium" | "high",
    "melodic_lift_level": "low" | "medium" | "high"
  },
  "categorical": [
    { "namespace": "style" | "scene" | "function", "tag": "string", "rawWeight": number }
  ]
}

Ensure the estimated BPM and numeric values are accurate for electronic music genres (e.g. Techno is usually 125-140 BPM, Ambient is lower, Hard Techno is 140+). Keep categorical raw weights between 0.0 and 1.0.`;

  const completion = (await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    response_format: { type: 'json_object' },
    messages: [
      {
        role: 'system',
        content: systemPrompt,
      },
      {
        role: 'user',
        content: JSON.stringify(track),
      },
    ],
  })) as OpenAIResponse;

  const content = completion.choices?.[0]?.message?.content;

  if (!content) {
    throw new Error('AI response was empty.');
  }

  const parsed = JSON.parse(content);
  
  // Kombiniere die Schicht 2 Datenstruktur (HybridFeatureVector)
  const vector = createEmptyHybridFeatureVector({
    entityId: track.trackId,
    entityType: 'track',
    sourcePlatform: track.sourcePlatform,
    sourceKind: 'track',
    sourceUrl: track.sourceUrl,
    timestampIngested: new Date().toISOString(),
  });

  // Numerische Schätzungen validieren und mappen
  vector.numeric = {
    energy: clamp(parsed.numeric?.energy ?? 50, 0, 100),
    density: clamp(parsed.numeric?.density ?? 50, 0, 100),
    texture: clamp(parsed.numeric?.texture ?? 50, 0, 100),
    space: clamp(parsed.numeric?.space ?? 50, 0, 100),
    rhythm: clamp(parsed.numeric?.rhythm ?? 50, 0, 100),
    bpm_est: parsed.numeric?.bpm_est ?? 125,
  };

  // Ordinale Schätzungen mappen
  vector.ordinal = {
    kick_pressure_level: parsed.ordinal?.kick_pressure_level ?? 'medium',
    drop_density_level: parsed.ordinal?.drop_density_level ?? 'medium',
    melodic_lift_level: parsed.ordinal?.melodic_lift_level ?? 'medium',
  };

  // Kategorische Tags normalisieren und mappen
  if (Array.isArray(parsed.categorical)) {
    vector.categorical = parsed.categorical.map((item: any) => ({
      namespace: item.namespace ?? 'style',
      tag: String(item.tag ?? 'unknown'),
      rawWeight: clamp(item.rawWeight ?? 0.5, 0, 1),
      normalizedWeight: clamp(item.rawWeight ?? 0.5, 0, 1),
      provenance: 'ai_analysis',
    }));
  }

  return vector;
}

function isAnalyzeTrackRequest(payload: unknown): payload is AnalyzeTrackRequest {
  if (typeof payload !== 'object' || payload === null) {
    return false;
  }
  
  const record = payload as Record<string, unknown>;
  return (
    typeof record.trackId === 'string' &&
    typeof record.title === 'string' &&
    typeof record.artistName === 'string' &&
    typeof record.sourcePlatform === 'string' &&
    typeof record.sourceUrl === 'string'
  );
}

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, Math.round(value)));
}

function jsonResponse(payload: unknown, status: number): Response {
  return Response.json(payload, {
    status,
    headers: {
      'Cache-Control': 'no-store',
    },
  });
}
