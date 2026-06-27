import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';

const PRIMARY = '#1ED760';
const DARK_GREEN = '#06311E';
const BG = '#F7F9F8';

export default function TrackScreen() {
  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.container}>
        <View style={styles.iconWrap}>
          <MaterialCommunityIcons
            name="clipboard-text-clock-outline"
            size={56}
            color={PRIMARY}
          />
        </View>
        <Text style={styles.title}>Track Orders</Text>
        <Text style={styles.subtitle}>
          Your active and past orders will appear here.
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: BG,
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
    gap: 12,
  },
  iconWrap: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: '#E8F5EE',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: DARK_GREEN,
    letterSpacing: -0.3,
  },
  subtitle: {
    fontSize: 14,
    color: '#5A7566',
    textAlign: 'center',
    lineHeight: 20,
  },
});
