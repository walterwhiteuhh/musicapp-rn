import { fireEvent, render, screen } from '@testing-library/react-native';

import { LandingScreen } from '@/features/landing/LandingScreen';

const mockPush = jest.fn();

jest.mock('expo-router', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}));

describe('LandingScreen', () => {
  beforeEach(() => {
    mockPush.mockClear();
  });

  it('renders the public Klangfeld landing page', () => {
    render(<LandingScreen />);

    expect(screen.getAllByText('Klangfeld').length).toBeGreaterThan(0);
    expect(screen.getByText('Spannung Radio Show 054')).toBeTruthy();
    expect(screen.getAllByText('Datenschutz').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Impressum').length).toBeGreaterThan(0);
  });

  it('links into the app experience', () => {
    render(<LandingScreen />);

    fireEvent.press(screen.getByText('App oeffnen'));

    expect(mockPush).toHaveBeenCalledWith('/(tabs)');
  });
});
