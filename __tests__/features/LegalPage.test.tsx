import { render, screen } from '@testing-library/react-native';

import { LegalPage } from '@/features/legal/LegalPage';

jest.mock('expo-router', () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}));

describe('LegalPage', () => {
  it('renders imprint details', () => {
    render(<LegalPage type="imprint" />);

    expect(screen.getByText('Impressum')).toBeTruthy();
    expect(screen.getByText('Angaben gemaess Paragraf 5 DDG')).toBeTruthy();
    expect(screen.getAllByText('Dr. rer. nat. Timo Fischer').length).toBeGreaterThan(0);
    expect(screen.getByText('Karl-Strutz-Weg 38')).toBeTruthy();
    expect(screen.getByText('22119 Hamburg')).toBeTruthy();
  });

  it('renders privacy details', () => {
    render(<LegalPage type="privacy" />);

    expect(screen.getByText('Datenschutzerklaerung')).toBeTruthy();
    expect(screen.getByText('Netlify und technische Zugriffsdaten')).toBeTruthy();
    expect(screen.getByText('Betroffenenrechte')).toBeTruthy();
    expect(screen.getByText('SoundCloud')).toBeTruthy();
    expect(screen.getByText('https://soundcloud.com/pages/privacy')).toBeTruthy();
  });
});
