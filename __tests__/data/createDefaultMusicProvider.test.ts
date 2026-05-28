import { createDefaultMusicProvider } from '@/data/music/createDefaultMusicProvider';

describe('createDefaultMusicProvider', () => {
  it('uses preview fixtures by default so local previews are interactive', async () => {
    const provider = createDefaultMusicProvider();

    await expect(provider.searchTracks('ben')).resolves.toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          artistName: 'Ben Böhmer',
        }),
      ]),
    );
  });
});
