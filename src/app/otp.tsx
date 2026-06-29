// ─────────────────────────────────────────────────────────────────────────────
// PHONE AUTH IMPORT (commented out for demo — uncomment to restore)
// import { auth, firestore } from '@/config/firebase';
// ─────────────────────────────────────────────────────────────────────────────

// EMAIL AUTH IMPORTS
import firestore from '@react-native-firebase/firestore';
import {
  createUserWithEmailAndPassword,
  getAuth,
  signInWithEmailAndPassword,
} from '@react-native-firebase/auth';
import { useLocalSearchParams, useRouter } from 'expo-router';

// ─── PHONE AUTH STATE IMPORTS (commented out for demo) ───────────────────────
// import { useRef, useState } from 'react';
// ─────────────────────────────────────────────────────────────────────────────

import { useState } from 'react';
import { Alert, StyleSheet, View } from 'react-native';
import { Button, Text, TextInput } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';

const PRIMARY = '#1ED760';
const DARK_GREEN = '#06311E';
const BG = '#F7F9F8';

export default function OtpScreen() {
  const router = useRouter();

  // ─── PHONE AUTH PARAMS (commented out for demo) ──────────────────────────
  // const { verificationId } = useLocalSearchParams<{ verificationId: string }>();
  // ─────────────────────────────────────────────────────────────────────────

  // EMAIL AUTH PARAMS
  const { email } = useLocalSearchParams<{ email: string }>();

  // ─── PHONE AUTH STATE (commented out for demo) ───────────────────────────
  // const [otp, setOtp] = useState('');
  // const [resent, setResent] = useState(false);
  // const inputRef = useRef<any>(null);
  // ─────────────────────────────────────────────────────────────────────────

  // EMAIL AUTH STATE
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  // ─── PHONE AUTH HANDLER (commented out for demo) ─────────────────────────
  // const handleVerify = async () => {
  //   if (!verificationId) {
  //     Alert.alert('Error', 'Verification ID is missing. Please go back and try again.');
  //     return;
  //   }
  //   setLoading(true);
  //   try {
  //     // Build credential and sign in using native RNFirebase
  //     const credential = auth.PhoneAuthProvider.credential(verificationId, otp);
  //     await auth().signInWithCredential(credential);
  //
  //     // Sync user record to Firestore
  //     const user = auth().currentUser;
  //     if (user) {
  //       const userRef = firestore().collection('users').doc(user.uid);
  //       const userDoc = await userRef.get();
  //
  //       if (!userDoc.exists) {
  //         await userRef.set({
  //           uid: user.uid,
  //           phoneNumber: user.phoneNumber,
  //           role: 'customer',
  //           activeStatus: 'active',
  //           createdAt: firestore.FieldValue.serverTimestamp(),
  //           updatedAt: firestore.FieldValue.serverTimestamp(),
  //         });
  //       }
  //     }
  //
  //     router.replace('/(customer)');
  //   } catch (error: any) {
  //     console.error('OTP verification error:', error);
  //     const message =
  //       error?.code === 'auth/invalid-verification-code'
  //         ? 'The OTP you entered is incorrect. Please check and try again.'
  //         : error?.message ?? 'Verification failed. Please try again.';
  //     Alert.alert('Verification Failed', message);
  //   } finally {
  //     setLoading(false);
  //   }
  // };
  //
  // const handleResend = () => {
  //   setResent(true);
  //   setTimeout(() => setResent(false), 3000);
  // };
  // ─────────────────────────────────────────────────────────────────────────

  // EMAIL AUTH HANDLER
  const handlePasswordSubmit = async () => {
    if (!email || !password) return;
    setLoading(true);
    try {
      const auth = getAuth();
      let user;

      try {
        // Try to sign in
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        user = userCredential.user;
      } catch (error: any) {
        // If user doesn't exist, create them
        if (
          error.code === 'auth/user-not-found' ||
          error.code === 'auth/invalid-credential'
        ) {
          const newUserCredential = await createUserWithEmailAndPassword(
            auth,
            email,
            password
          );
          user = newUserCredential.user;
        } else {
          throw error;
        }
      }

      // Sync with Firestore
      const userRef = firestore().collection('users').doc(user.uid);
      const userDoc = await userRef.get();

      if (!userDoc.exists) {
        await userRef.set({
          uid: user.uid,
          email: user.email, // Use email instead of phoneNumber
          role: 'customer',
          activeStatus: 'active',
          createdAt: firestore.FieldValue.serverTimestamp(),
          updatedAt: firestore.FieldValue.serverTimestamp(),
        });
      }

      router.replace('/(customer)');
    } catch (error: any) {
      console.error('Email/Password error:', error);
      Alert.alert(
        'Authentication Failed',
        error?.message ?? 'Please check your credentials and try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        {/* Back nav */}
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

        {/* Header — EMAIL AUTH */}
        <View style={styles.headerContainer}>
          <Text style={styles.header}>Enter your password</Text>
          <Text style={styles.subheader}>
            {email ? `Signing in as ${email}` : 'Set or enter your password to continue.'}
          </Text>
        </View>

        {/* ── PHONE AUTH HEADER (commented out for demo) ─────────────────────
        <View style={styles.headerContainer}>
          <Text style={styles.header}>Verify your number</Text>
          <Text style={styles.subheader}>
            Enter the 6-digit code sent to your phone.
          </Text>
        </View>
        ── END PHONE AUTH HEADER ─────────────────────────────────────────── */}

        {/* Password Card — EMAIL AUTH */}
        <View style={styles.card}>
          <TextInput
            mode="outlined"
            label="Password"
            placeholder="Enter your password"
            secureTextEntry
            autoCapitalize="none"
            value={password}
            onChangeText={setPassword}
            autoFocus
            outlineStyle={styles.inputOutline}
            style={styles.input}
            contentStyle={styles.inputContent}
            outlineColor="#D0D5DD"
            activeOutlineColor={PRIMARY}
          />

          <Button
            mode="contained"
            onPress={handlePasswordSubmit}
            disabled={!password || loading}
            loading={loading}
            style={[
              styles.button,
              (!password || loading) && styles.buttonDisabled,
            ]}
            contentStyle={styles.buttonContent}
            labelStyle={styles.buttonLabel}
            buttonColor={PRIMARY}
            icon="shield-check"
          >
            {loading ? 'Signing in…' : 'Verify & Login'}
          </Button>
        </View>

        {/* ── PHONE AUTH OTP CARD (commented out for demo) ───────────────────
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
            disabled={otp.length !== 6 || loading}
            loading={loading}
            style={[
              styles.button,
              (otp.length !== 6 || loading) && styles.buttonDisabled,
            ]}
            contentStyle={styles.buttonContent}
            labelStyle={styles.buttonLabel}
            buttonColor={PRIMARY}
            icon="shield-check"
          >
            {loading ? 'Verifying…' : 'Verify & Login'}
          </Button>
        </View>

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
        ── END PHONE AUTH OTP CARD ──────────────────────────────────────── */}
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
    fontSize: 17,
    letterSpacing: 1,
    color: DARK_GREEN,
  },
  inputOutline: {
    borderRadius: 12,
  },
  // OTP dot indicators — kept for easy Phone Auth restore
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
