// ─────────────────────────────────────────────────────────────────────────────
// PHONE AUTH IMPORT (commented out for demo — uncomment to restore)
// import auth, { signInWithPhoneNumber } from '@react-native-firebase/auth';
// ─────────────────────────────────────────────────────────────────────────────

// EMAIL AUTH IMPORT
import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
  Alert,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { Button, Text, TextInput } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';

const PRIMARY = '#1ED760';
const DARK_GREEN = '#06311E';
const BG = '#F7F9F8';

export default function MobileLoginScreen() {
  const router = useRouter();

  // ─── PHONE AUTH STATE (commented out for demo) ───────────────────────────
  // const [mobile, setMobile] = useState('');
  // ─────────────────────────────────────────────────────────────────────────

  // EMAIL AUTH STATE
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  // Auth mode: 'login' or 'signup'
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('signup');

  // ─── PHONE AUTH HANDLER (commented out for demo) ─────────────────────────
  // const handleGetOtp = async () => {
  //   const formattedPhone = `+91${mobile}`;
  //   setLoading(true);
  //   try {
  //     // Force testing mode to bypass Apple's APNs requirement for dummy numbers
  //     auth().settings.appVerificationDisabledForTesting = true;
  //
  //     // Clean the phone number string
  //     const cleanPhone = formattedPhone.replace(/\s+/g, '');
  //
  //     // Request OTP
  //     const confirmation = await signInWithPhoneNumber(auth(), cleanPhone);
  //     router.push({
  //       pathname: '/otp',
  //       params: {
  //         verificationId: confirmation.verificationId,
  //         phone: formattedPhone,
  //       },
  //     });
  //   } catch (error: any) {
  //     console.error('OTP send error:', error);
  //     Alert.alert(
  //       'Failed to send OTP',
  //       error?.message ?? 'Please check the phone number and try again.'
  //     );
  //   } finally {
  //     setLoading(false);
  //   }
  // };
  // ─────────────────────────────────────────────────────────────────────────

  // EMAIL AUTH HANDLER
  const handleEmailSubmit = () => {
    if (!email) return;
    router.push({ pathname: '/otp', params: { email, authMode } });
  };

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView
            contentContainerStyle={{ flexGrow: 1 }}
            keyboardShouldPersistTaps="handled"
          >
            <View style={styles.container}>
              {/* Brand Mark */}
              <View style={styles.brandContainer}>
                <View style={styles.logoCircle}>
                  <Text style={styles.logoText}>W</Text>
                </View>
              </View>

              {/* Header */}
              <View style={styles.headerContainer}>
                <Text style={styles.header}>Welcome to WRITEE</Text>
                <Text style={styles.subheader}>Your Documentation. Our Responsibility.</Text>
              </View>

              {/* Auth Mode Toggle */}
              <View style={styles.toggleContainer}>
                <View style={styles.toggleTrack}>
                  <TouchableWithoutFeedback onPress={() => setAuthMode('login')}>
                    <View style={[styles.toggleTab, authMode === 'login' && styles.toggleTabActive]}>
                      <Text style={[styles.toggleLabel, authMode === 'login' && styles.toggleLabelActive]}>
                        Login
                      </Text>
                    </View>
                  </TouchableWithoutFeedback>
                  <TouchableWithoutFeedback onPress={() => setAuthMode('signup')}>
                    <View style={[styles.toggleTab, authMode === 'signup' && styles.toggleTabActive]}>
                      <Text style={[styles.toggleLabel, authMode === 'signup' && styles.toggleLabelActive]}>
                        Sign Up
                      </Text>
                    </View>
                  </TouchableWithoutFeedback>
                </View>
              </View>

              {/* Form Card */}
              <View style={styles.card}>
                {/* ── PHONE AUTH UI (commented out for demo) ──────────────────────
                <Text style={styles.cardLabel}>Enter your mobile number</Text>
                <TextInput
                  mode="outlined"
                  label="Mobile Number"
                  placeholder="98765 43210"
                  keyboardType="phone-pad"
                  maxLength={10}
                  value={mobile}
                  onChangeText={setMobile}
                  left={
                    <TextInput.Affix
                      text="+91 "
                      textStyle={{ color: DARK_GREEN, fontWeight: '700' }}
                    />
                  }
                  outlineStyle={styles.inputOutline}
                  style={styles.input}
                  contentStyle={styles.inputContent}
                  outlineColor="#D0D5DD"
                  activeOutlineColor={PRIMARY}
                />
                <Button
                  mode="contained"
                  onPress={handleGetOtp}
                  disabled={mobile.length !== 10 || loading}
                  loading={loading}
                  style={[
                    styles.button,
                    (mobile.length !== 10 || loading) && styles.buttonDisabled,
                  ]}
                  contentStyle={styles.buttonContent}
                  labelStyle={styles.buttonLabel}
                  buttonColor={PRIMARY}
                >
                  {loading ? 'Sending OTP…' : 'Get OTP'}
                </Button>
                ── END PHONE AUTH UI ─────────────────────────────────────────────── */}

                {/* EMAIL AUTH UI */}
                <Text style={styles.cardLabel}>
                  {authMode === 'login' ? 'Sign in to your account' : 'Create a new account'}
                </Text>
                <TextInput
                  mode="outlined"
                  label="Email Address"
                  placeholder="you@example.com"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoComplete="email"
                  value={email}
                  onChangeText={setEmail}
                  outlineStyle={styles.inputOutline}
                  style={styles.input}
                  contentStyle={styles.inputContent}
                  outlineColor="#D0D5DD"
                  activeOutlineColor={PRIMARY}
                />

                <Button
                  mode="contained"
                  onPress={handleEmailSubmit}
                  disabled={!email || loading}
                  loading={loading}
                  style={[
                    styles.button,
                    (!email || loading) && styles.buttonDisabled,
                  ]}
                  contentStyle={styles.buttonContent}
                  labelStyle={styles.buttonLabel}
                  buttonColor={PRIMARY}
                >
                  {authMode === 'login' ? 'Continue to Login' : 'Continue to Sign Up'}
                </Button>
              </View>

              {/* Footer */}
              <Text style={styles.footerText}>
                By continuing, you agree to our{' '}
                <Text style={styles.footerLink}>Terms of Service</Text>
                {' & '}
                <Text style={styles.footerLink}>Privacy Policy</Text>
              </Text>
            </View>
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
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
    paddingHorizontal: 24,
    paddingTop: 40,
    paddingBottom: 32,
    justifyContent: 'center',
    gap: 28,
  },
  brandContainer: {
    alignItems: 'center',
  },
  logoCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: DARK_GREEN,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: DARK_GREEN,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  logoText: {
    color: PRIMARY,
    fontSize: 36,
    fontWeight: '900',
    letterSpacing: -1,
  },
  headerContainer: {
    alignItems: 'center',
    gap: 6,
  },
  header: {
    fontSize: 28,
    fontWeight: '800',
    color: DARK_GREEN,
    textAlign: 'center',
    letterSpacing: -0.5,
  },
  subheader: {
    fontSize: 15,
    color: '#5A7566',
    textAlign: 'center',
    fontStyle: 'italic',
  },
  // Auth mode toggle
  toggleContainer: {
    alignItems: 'center',
  },
  toggleTrack: {
    flexDirection: 'row',
    backgroundColor: '#E8EDE9',
    borderRadius: 12,
    padding: 4,
    width: '100%',
  },
  toggleTab: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  toggleTabActive: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  toggleLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#8CA898',
  },
  toggleLabelActive: {
    color: DARK_GREEN,
    fontWeight: '700',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 24,
    gap: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 3,
  },
  cardLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#5A7566',
    letterSpacing: 0.3,
    textTransform: 'uppercase',
  },
  input: {
    backgroundColor: '#FAFAFA',
  },
  inputContent: {
    fontSize: 17,
    letterSpacing: 1.5,
    color: DARK_GREEN,
  },
  inputOutline: {
    borderRadius: 12,
  },
  button: {
    borderRadius: 14,
    marginTop: 4,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonContent: {
    paddingVertical: 6,
  },
  buttonLabel: {
    fontSize: 16,
    fontWeight: '700',
    color: DARK_GREEN,
    letterSpacing: 0.3,
  },
  footerText: {
    textAlign: 'center',
    fontSize: 12,
    color: '#8CA898',
    lineHeight: 18,
  },
  footerLink: {
    color: DARK_GREEN,
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
});
