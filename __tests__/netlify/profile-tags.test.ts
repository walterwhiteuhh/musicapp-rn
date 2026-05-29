/* eslint-disable import/first */
const mockCreate = jest.fn();
const mockOpenAI = jest.fn();

jest.mock('openai', () =>
  jest.fn().mockImplementation((options) => {
    mockOpenAI(options);

    return {
      chat: {
        completions: {
          create: mockCreate,
        },
      },
    };
  }),
);

import profileTags from '../../netlify/functions/profile-tags';

const validProfileRequest = {
  schemaVersion: 1,
  genres: ['Techno', 'Ambient'],
  contexts: ['Club'],
  dimensions: {
    energy: 70,
    density: 55,
    texture: 60,
    space: 45,
    rhythm: 80,
  },
  selectedArtists: ['Ben Klock'],
  lineageWeights: {
    'Berlin hypnotic': 1,
  },
  artistAnchorWeights: {
    'Ben Klock': 1,
  },
  discoveryDepth: {
    recognitionBias: 75,
    independentBias: 25,
    historicalBias: 40,
    functionalBias: 50,
  },
  calibration: {
    onboardingWeight: 1,
    behaviorWeight: 0,
    confidence: 0,
    interactionCount: 0,
  },
};

function request(method: string, body?: unknown) {
  return new Request('https://klangfeld.test/api/profile-tags', {
    method,
    body: body === undefined ? undefined : JSON.stringify(body),
  });
}

function setNetlifyEnv(vars: Record<string, string | undefined>) {
  (globalThis as { Netlify?: { env: { get(name: string): string | undefined } } }).Netlify = {
    env: {
      get: (name: string) => vars[name],
    },
  };
}

describe('profile-tags function', () => {
  beforeEach(() => {
    mockCreate.mockReset();
    mockOpenAI.mockClear();
    delete (globalThis as { Netlify?: unknown }).Netlify;
  });

  it('uses the Netlify OpenAI gateway by default for a valid POST request', async () => {
    mockCreate.mockResolvedValue({
      choices: [
        {
          message: {
            content: JSON.stringify({
              schemaVersion: 1,
              primaryEnergy: 'high',
              rhythmBias: 'Driving rhythm',
              listeningIntent: 'Club discovery',
              discoveryVector: ['hypnotic', 'percussive'],
              profileNotes: ['Strong rhythm preference'],
              confidence: 0.8,
            }),
          },
        },
      ],
    });

    const response = await profileTags(request('POST', validProfileRequest), {} as never);

    await expect(response.json()).resolves.toMatchObject({
      primaryEnergy: 'high',
      confidence: 0.8,
    });
    expect(mockCreate).toHaveBeenCalledWith(
      expect.objectContaining({
        model: 'gpt-4o-mini',
        response_format: { type: 'json_object' },
      }),
    );
    expect(mockOpenAI).toHaveBeenCalledWith(
      expect.objectContaining({
        apiKey: 'netlify-ai-gateway',
      }),
    );
  });

  it('can use OpenRouter with OpenAI-compatible chat completions', async () => {
    setNetlifyEnv({
      AI_PROVIDER: 'openrouter',
      AI_MODEL: 'openrouter/auto',
      OPENROUTER_API_KEY: 'or-test-key',
      OPENROUTER_SITE_URL: 'https://klangfeld.netlify.app',
      OPENROUTER_APP_TITLE: 'Klangfeld',
    });
    mockCreate.mockResolvedValue({
      choices: [
        {
          message: {
            content: JSON.stringify({
              schemaVersion: 1,
              primaryEnergy: 'medium',
              rhythmBias: 'Broken rhythm',
              listeningIntent: 'Source-first discovery',
              discoveryVector: ['openrouter'],
              profileNotes: ['Provider-neutral response'],
              confidence: 0.7,
            }),
          },
        },
      ],
    });

    const response = await profileTags(request('POST', validProfileRequest), {} as never);

    expect(response.status).toBe(200);
    expect(mockOpenAI).toHaveBeenCalledWith(
      expect.objectContaining({
        apiKey: 'or-test-key',
        baseURL: 'https://openrouter.ai/api/v1',
        defaultHeaders: {
          'HTTP-Referer': 'https://klangfeld.netlify.app',
          'X-OpenRouter-Title': 'Klangfeld',
        },
      }),
    );
    expect(mockCreate).toHaveBeenCalledWith(
      expect.objectContaining({
        model: 'openrouter/auto',
        response_format: { type: 'json_object' },
      }),
    );
  });

  it('rejects non-POST requests', async () => {
    const response = await profileTags(request('GET'), {} as never);

    expect(response.status).toBe(405);
  });

  it('rejects invalid request bodies', async () => {
    const response = await profileTags(request('POST', { genres: ['Techno'] }), {} as never);

    expect(response.status).toBe(400);
  });

  it('returns 502 when the AI gateway call fails', async () => {
    mockCreate.mockRejectedValue(new Error('gateway unavailable'));

    const response = await profileTags(request('POST', validProfileRequest), {} as never);

    expect(response.status).toBe(502);
  });

  it('returns 502 when OpenRouter is selected without an API key', async () => {
    setNetlifyEnv({
      AI_PROVIDER: 'openrouter',
    });

    const response = await profileTags(request('POST', validProfileRequest), {} as never);

    expect(response.status).toBe(502);
    expect(mockCreate).not.toHaveBeenCalled();
  });
});
