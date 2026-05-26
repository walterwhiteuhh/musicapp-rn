/* eslint-disable import/first */
const mockCreate = jest.fn();

jest.mock('openai', () =>
  jest.fn().mockImplementation(() => ({
    chat: {
      completions: {
        create: mockCreate,
      },
    },
  })),
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

describe('profile-tags function', () => {
  beforeEach(() => {
    mockCreate.mockReset();
  });

  it('generates profile tags for a valid POST request', async () => {
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
});
