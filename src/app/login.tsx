import auth, { signInWithPhoneNumber } from '@react-native-firebase/auth';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Alert, StyleSheet, View } from 'react-native';
import { Button, Text, TextInput } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';

const PRIMARY = '#1ED760';
const DARK_GREEN = '#06311E';
const BG = '#F7F9F8';

export default function MobileLoginScreen() {
  const router = useRouter();
  const [mobile, setMobile] = useState('');
  const [loading, setLoading] = useState(false);

  const handleGetOtp = async () => {
    const formattedPhone = `+91${mobile}`;
    setLoading(true);
    try {
      // Force testing mode to bypass Apple's APNs requirement for dummy numbers
      auth().settings.appVerificationDisabledForTesting = true;

      // Clean the phone number string
      const cleanPhone = formattedPhone.replace(/\s+/g, '');

      // Request OTP
      const confirmation = await signInWithPhoneNumber(auth(), cleanPhone);
      router.push({
        pathname: '/otp',
        params: {
          verificationId: confirmation.verificationId,
          phone: formattedPhone,
        },
      });
    } catch (error: any) {
      console.error('OTP send error:', error);
      Alert.alert(
        'Failed to send OTP',
        error?.message ?? 'Please check the phone number and try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
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

        {/* Form Card */}
        <View style={styles.card}>
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
        </View>

        {/* Footer */}
        <Text style={styles.footerText}>
          By continuing, you agree to our{' '}
          <Text style={styles.footerLink}>Terms of Service</Text>
          {' & '}
          <Text style={styles.footerLink}>Privacy Policy</Text>
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
