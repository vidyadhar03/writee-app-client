import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import auth from '@react-native-firebase/auth';
import { useRouter } from 'expo-router';
import { Alert, StyleSheet, View } from 'react-native';
import { Button, Text } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';

const PRIMARY = '#1ED760';
const DARK_GREEN = '#06311E';
const BG = '#F7F9F8';

export default function ProfileScreen() {
  const router = useRouter();
  const user = auth().currentUser;

  const handleLogout = async () => {
    Alert.alert('Log Out', 'Are you sure you want to log out?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Log Out',
        style: 'destructive',
        onPress: async () => {
          try {
            await auth().signOut();
            router.replace('/login');
          } catch (error) {
            console.error('Logout error:', error);
            Alert.alert('Error', 'Failed to log out. Please try again.');
          }
        },
      },
    ]);
  };

  // Derive initials from email for the avatar
  const initials = user?.email
    ? user.email.slice(0, 2).toUpperCase()
    : 'U';

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.container}>
        {/* ── Avatar ── */}
        <View style={styles.avatarWrap}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{initials}</Text>
          </View>
          {/* Verified badge */}
          <View style={styles.verifiedBadge}>
            <MaterialCommunityIcons
              name="check-decagram"
              size={20}
              color={PRIMARY}
            />
          </View>
        </View>

        {/* ── User Info ── */}
        <View style={styles.infoBlock}>
          <Text style={styles.emailLabel}>Signed in as</Text>
          <Text style={styles.email}>{user?.email ?? '—'}</Text>
        </View>

        {/* ── Info Cards ── */}
        <View style={styles.infoRow}>
          <View style={styles.infoCard}>
            <MaterialCommunityIcons
              name="shield-account-outline"
              size={22}
              color={DARK_GREEN}
            />
            <Text style={styles.infoCardLabel}>Role</Text>
            <Text style={styles.infoCardValue}>Customer</Text>
          </View>
          <View style={styles.infoCard}>
            <MaterialCommunityIcons
              name="account-check-outline"
              size={22}
              color={DARK_GREEN}
            />
            <Text style={styles.infoCardLabel}>Status</Text>
            <Text style={[styles.infoCardValue, styles.statusActive]}>Active</Text>
          </View>
        </View>

        {/* ── UID Card ── */}
        <View style={styles.uidCard}>
          <MaterialCommunityIcons
            name="identifier"
            size={16}
            color="#8CA898"
          />
          <Text style={styles.uidText} numberOfLines={1}>
            UID: {user?.uid ?? '—'}
          </Text>
        </View>

        {/* ── Logout ── */}
        <Button
          mode="outlined"
          onPress={handleLogout}
          style={styles.logoutBtn}
          contentStyle={styles.logoutContent}
          labelStyle={styles.logoutLabel}
          textColor="#C62828"
          icon="logout"
        >
          Log Out
        </Button>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: BG },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 28,
    gap: 20,
  },

  /* Avatar */
  avatarWrap: { position: 'relative', marginBottom: 4 },
  avatar: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: DARK_GREEN,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: DARK_GREEN,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  avatarText: {
    fontSize: 34,
    fontWeight: '900',
    color: PRIMARY,
    letterSpacing: -0.5,
  },
  verifiedBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 2,
  },

  /* Info */
  infoBlock: { alignItems: 'center', gap: 4 },
  emailLabel: { fontSize: 12, color: '#8CA898', fontWeight: '500' },
  email: {
    fontSize: 16,
    fontWeight: '700',
    color: DARK_GREEN,
    textAlign: 'center',
  },

  /* Info row cards */
  infoRow: {
    flexDirection: 'row',
    gap: 14,
    width: '100%',
  },
  infoCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 14,
    alignItems: 'center',
    gap: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  infoCardLabel: { fontSize: 11, color: '#8CA898', fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.4 },
  infoCardValue: { fontSize: 14, fontWeight: '800', color: DARK_GREEN },
  statusActive: { color: '#2E7D32' },

  /* UID */
  uidCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 14,
    width: '100%',
    borderWidth: 1,
    borderColor: '#E8EDE9',
  },
  uidText: { fontSize: 11, color: '#8CA898', flex: 1 },

  /* Logout */
  logoutBtn: {
    width: '100%',
    borderRadius: 16,
    borderColor: '#FFCDD2',
    borderWidth: 1.5,
    marginTop: 8,
  },
  logoutContent: { paddingVertical: 6 },
  logoutLabel: { fontSize: 15, fontWeight: '700', letterSpacing: 0.3 },
});
