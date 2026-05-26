import { render, screen } from '@testing-library/react-native';
import TabLayout from '../../app/(tabs)/_layout';

jest.mock('react-native-safe-area-context', () => ({
  useSafeAreaInsets: () => ({ bottom: 0 }),
}));

jest.mock('lucide-react-native', () => ({
  Compass: () => {
    const { Text } = jest.requireActual('react-native');
    return <Text>compass-icon</Text>;
  },
  Search: () => {
    const { Text } = jest.requireActual('react-native');
    return <Text>search-icon</Text>;
  },
  Library: () => {
    const { Text } = jest.requireActual('react-native');
    return <Text>library-icon</Text>;
  },
  UserRound: () => {
    const { Text } = jest.requireActual('react-native');
    return <Text>profile-icon</Text>;
  },
}));

jest.mock('expo-router', () => {
  const { View, Text } = jest.requireActual('react-native');

  function Tabs({ children, screenOptions }: { children: React.ReactNode; screenOptions: object }) {
    return <View testID="tabs">{children}</View>;
  }

  function Screen({
    options,
  }: {
    options: {
      title: string;
      tabBarIcon?: ({ color, size }: { color: string; size: number }) => React.ReactNode;
    };
  }) {
    return (
      <View>
        <Text>{options.title}</Text>
        {options.tabBarIcon?.({ color: '#fff', size: 20 })}
      </View>
    );
  }

  Tabs.Screen = Screen;

  return { Tabs };
});

describe('TabLayout', () => {
  it('renders real tab icons instead of fallback glyphs', () => {
    render(<TabLayout />);

    expect(screen.getByText('compass-icon')).toBeTruthy();
    expect(screen.getByText('search-icon')).toBeTruthy();
    expect(screen.getByText('library-icon')).toBeTruthy();
    expect(screen.getByText('profile-icon')).toBeTruthy();
  });
});
