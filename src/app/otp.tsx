import { useRouter } from 'expo-router';
import { useRef, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Button, Text, TextInput } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';

const PRIMARY = '#1ED760';
const DARK_GREEN = '#06311E';
const BG = '#F7F9F8';

export default function OtpScreen() {
  const router = useRouter();
  const [otp, setOtp] = useState('');
  const [resent, setResent] = useState(false);
  const inputRef = useRef<any>(null);

  const handleVerify = () => {
    router.replace('/(customer)');
  };

  const handleResend = () => {
    setResent(true);
    setTimeout(() => setResent(false), 3000);
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        {/* Back nav hint */}
        <Button
          mode="text"
          onPress={() => router.back()}
          style={styles.backButton}
          labelStyle={styles.backLabel}
          icon="arrow-left"
          textColor={DARK_GREEN}
        >
          Back
        </Button>

        {/* Icon */}
        <View style={styles.iconContainer}>
          <View style={styles.iconCircle}>
            <Text style={styles.iconEmoji}>🔐</Text>
          </View>
        </View>

        {/* Header */}
        <View style={styles.headerContainer}>
          <Text style={styles.header}>Verify your number</Text>
          <Text style={styles.subheader}>
            Enter the 6-digit code sent to your phone.
          </Text>
        </View>

        {/* OTP Card */}
        <View style={styles.card}>
          <TextInput
            ref={inputRef}
            mode="outlined"
            label="OTP Code"
            placeholder="• • • • • •"
            keyboardType="number-pad"
            maxLength={6}
            value={otp}
            onChangeText={setOtp}
            autoFocus
            outlineStyle={styles.inputOutline}
            style={styles.input}
            contentStyle={styles.inputContent}
            outlineColor="#D0D5DD"
            activeOutlineColor={PRIMARY}
          />

          {/* Dot progress indicators */}
          <View style={styles.dotsRow}>
            {Array.from({ length: 6 }).map((_, i) => (
              <View
                key={i}
                style={[
                  styles.dot,
                  i < otp.length ? styles.dotFilled : styles.dotEmpty,
                ]}
              />
            ))}
          </View>

          <Button
            mode="contained"
            onPress={handleVerify}
            disabled={otp.length !== 6}
            style={[
              styles.button,
              otp.length !== 6 && styles.buttonDisabled,
            ]}
            contentStyle={styles.buttonContent}
            labelStyle={styles.buttonLabel}
            buttonColor={PRIMARY}
            icon="shield-check"
          >
            Verify &amp; Login
          </Button>
        </View>

        {/* Resend */}
        <View style={styles.resendContainer}>
          {resent ? (
            <Text style={styles.resentText}>✅ OTP sent again!</Text>
          ) : (
            <>
              <Text style={styles.resendPrompt}>Didn't receive the code?</Text>
              <Button
                mode="text"
                onPress={handleResend}
                labelStyle={styles.resendLabel}
                textColor={DARK_GREEN}
              >
                Resend OTP
              </Button>
            </>
          )}
        </View>
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
    paddingTop: 8,
    paddingBottom: 32,
    justifyContent: 'center',
    gap: 24,
  },
  backButton: {
    alignSelf: 'flex-start',
    marginLeft: -8,
  },
  backLabel: {
    fontSize: 15,
    fontWeight: '600',
  },
  iconContainer: {
    alignItems: 'center',
  },
  iconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#E8F5EE',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#B8E8C8',
  },
  iconEmoji: {
    fontSize: 36,
  },
  headerContainer: {
    alignItems: 'center',
    gap: 6,
  },
  header: {
    fontSize: 26,
    fontWeight: '800',
    color: DARK_GREEN,
    textAlign: 'center',
    letterSpacing: -0.5,
  },
  subheader: {
    fontSize: 14,
    color: '#5A7566',
    textAlign: 'center',
    lineHeight: 20,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 24,
    gap: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 3,
  },
  input: {
    backgroundColor: '#FAFAFA',
  },
  inputContent: {
    fontSize: 28,
    letterSpacing: 12,
    textAlign: 'center',
    color: DARK_GREEN,
    fontWeight: '700',
  },
  inputOutline: {
    borderRadius: 12,
  },
  dotsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 10,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  dotFilled: {
    backgroundColor: PRIMARY,
  },
  dotEmpty: {
    backgroundColor: '#D0D5DD',
  },
  button: {
    borderRadius: 14,
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
  resendContainer: {
    alignItems: 'center',
    gap: 2,
  },
  resendPrompt: {
    fontSize: 13,
    color: '#8CA898',
  },
  resendLabel: {
    fontSize: 14,
    fontWeight: '700',
    textDecorationLine: 'underline',
  },
  resentText: {
    fontSize: 14,
    color: '#2E7D32',
    fontWeight: '600',
  },
});
