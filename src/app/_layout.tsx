import { Slot } from 'expo-router';
import { MD3LightTheme as DefaultTheme, PaperProvider } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';
// 1. IMPORT THE ICONS HERE
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

const writeeTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#1ED760',
    secondary: '#06311E',
    background: '#F7F9F8',
    surface: '#FFFFFF',
    text: '#1A1A1A',
  },
};

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      {/* 2. ADD THE SETTINGS PROP TO PAPER PROVIDER */}
      <PaperProvider
        theme={writeeTheme}
        settings={{
          icon: (props) => <MaterialCommunityIcons {...props} />,
        }}
      >
        <Slot />
      </PaperProvider>
    </SafeAreaProvider>
  );
}