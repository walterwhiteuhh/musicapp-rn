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
    expect(screen.getAllByText('Timo Fischer').length).toBeGreaterThan(0);
  });

  it('renders privacy details', () => {
    render(<LegalPage type="privacy" />);

    expect(screen.getByText('Datenschutzerklaerung')).toBeTruthy();
    expect(screen.getByText('Netlify und technische Zugriffsdaten')).toBeTruthy();
    expect(screen.getByText('Betroffenenrechte')).toBeTruthy();
  });
});
