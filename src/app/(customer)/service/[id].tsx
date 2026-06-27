import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import { Button, Text, TextInput } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';

const PRIMARY = '#1ED760';
const DARK_GREEN = '#06311E';
const BG = '#F7F9F8';

/** Convert "agreement-writing" → "Agreement Writing" */
function formatSlug(slug: string): string {
  return slug
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

type ServiceMode = 'online' | 'agent';

export default function ServiceBookingScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const serviceTitle = formatSlug(id ?? '');

  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [notes, setNotes] = useState('');
  const [mode, setMode] = useState<ServiceMode>('online');

  return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* ── Service Title ── */}
          <View style={styles.titleBlock}>
            <Text style={styles.serviceTag}>Booking Form</Text>
            <Text style={styles.serviceTitle}>{serviceTitle}</Text>
          </View>

          {/* ════════════════════════════════
              Section 1 — Basic Details
          ════════════════════════════════ */}
          <View style={styles.section}>
            <View style={styles.sectionLabelRow}>
              <MaterialCommunityIcons
                name="account-edit-outline"
                size={18}
                color={PRIMARY}
              />
              <Text style={styles.sectionLabel}>Basic Details</Text>
            </View>

            <TextInput
              mode="outlined"
              label="Full Name"
              placeholder="e.g. Rahul Sharma"
              value={fullName}
              onChangeText={setFullName}
              outlineColor="#D8E2DC"
              activeOutlineColor={PRIMARY}
              outlineStyle={styles.inputOutline}
              style={styles.input}
              left={<TextInput.Icon icon="account-outline" color="#8CA898" />}
            />

            <TextInput
              mode="outlined"
              label="Phone Number"
              placeholder="10-digit mobile number"
              keyboardType="phone-pad"
              maxLength={10}
              value={phone}
              onChangeText={setPhone}
              outlineColor="#D8E2DC"
              activeOutlineColor={PRIMARY}
              outlineStyle={styles.inputOutline}
              style={styles.input}
              left={<TextInput.Icon icon="phone-outline" color="#8CA898" />}
              right={<TextInput.Affix text="+91" textStyle={styles.affixText} />}
            />

            <TextInput
              mode="outlined"
              label="Requirement Details / Notes"
              placeholder="Describe what you need in detail…"
              value={notes}
              onChangeText={setNotes}
              multiline
              numberOfLines={4}
              outlineColor="#D8E2DC"
              activeOutlineColor={PRIMARY}
              outlineStyle={styles.inputOutline}
              style={[styles.input, styles.textArea]}
              contentStyle={styles.textAreaContent}
              left={<TextInput.Icon icon="text-box-outline" color="#8CA898" />}
            />
          </View>

          {/* ════════════════════════════════
              Section 2 — Document Upload
          ════════════════════════════════ */}
          <View style={styles.section}>
            <View style={styles.sectionLabelRow}>
              <MaterialCommunityIcons
                name="file-upload-outline"
                size={18}
                color={PRIMARY}
              />
              <Text style={styles.sectionLabel}>Upload Documents</Text>
            </View>

            <Pressable style={({ pressed }) => [styles.uploadBox, pressed && styles.uploadBoxPressed]}>
              <MaterialCommunityIcons
                name="cloud-upload-outline"
                size={40}
                color={PRIMARY}
              />
              <Text style={styles.uploadTitle}>Tap to upload</Text>
              <Text style={styles.uploadSubtitle}>
                ID / Property Documents (PDF, JPG)
              </Text>
              <View style={styles.uploadPill}>
                <Text style={styles.uploadPillText}>Browse Files</Text>
              </View>
            </Pressable>
          </View>

          {/* ════════════════════════════════
              Section 3 — Service Mode
          ════════════════════════════════ */}
          <View style={styles.section}>
            <View style={styles.sectionLabelRow}>
              <MaterialCommunityIcons
                name="swap-horizontal"
                size={18}
                color={PRIMARY}
              />
              <Text style={styles.sectionLabel}>Service Mode</Text>
            </View>

            <View style={styles.modeRow}>
              {/* Online card */}
              <Pressable
                style={[
                  styles.modeCard,
                  mode === 'online' && styles.modeCardSelected,
                ]}
                onPress={() => setMode('online')}
              >
                <View
                  style={[
                    styles.modeIconCircle,
                    mode === 'online' && styles.modeIconCircleSelected,
                  ]}
                >
                  <MaterialCommunityIcons
                    name="laptop"
                    size={26}
                    color={mode === 'online' ? DARK_GREEN : '#8CA898'}
                  />
                </View>
                <Text
                  style={[
                    styles.modeTitle,
                    mode === 'online' && styles.modeTitleSelected,
                  ]}
                >
                  App Service
                </Text>
                <Text style={styles.modeSubtitle}>Online</Text>
                {mode === 'online' && (
                  <View style={styles.modeCheck}>
                    <MaterialCommunityIcons
                      name="check-circle"
                      size={18}
                      color={PRIMARY}
                    />
                  </View>
                )}
              </Pressable>

              {/* Agent card */}
              <Pressable
                style={[
                  styles.modeCard,
                  mode === 'agent' && styles.modeCardSelected,
                ]}
                onPress={() => setMode('agent')}
              >
                <View
                  style={[
                    styles.modeIconCircle,
                    mode === 'agent' && styles.modeIconCircleSelected,
                  ]}
                >
                  <MaterialCommunityIcons
                    name="account-tie"
                    size={26}
                    color={mode === 'agent' ? DARK_GREEN : '#8CA898'}
                  />
                </View>
                <Text
                  style={[
                    styles.modeTitle,
                    mode === 'agent' && styles.modeTitleSelected,
                  ]}
                >
                  Home Service
                </Text>
                <Text style={styles.modeSubtitle}>Agent Visit</Text>
                {mode === 'agent' && (
                  <View style={styles.modeCheck}>
                    <MaterialCommunityIcons
                      name="check-circle"
                      size={18}
                      color={PRIMARY}
                    />
                  </View>
                )}
              </Pressable>
            </View>
          </View>

          {/* Bottom spacing so content isn't hidden behind the action bar */}
          <View style={styles.bottomPad} />
        </ScrollView>

        {/* ── Pinned Action Bar ── */}
        <View style={styles.actionBar}>
          <View style={styles.actionSummary}>
            <Text style={styles.actionSummaryLabel}>Selected mode</Text>
            <Text style={styles.actionSummaryValue}>
              {mode === 'online' ? '💻 App Service' : '🏠 Home Service'}
            </Text>
          </View>
          <Button
            mode="contained"
            buttonColor={PRIMARY}
            onPress={() => {}}
            style={styles.proceedBtn}
            contentStyle={styles.proceedBtnContent}
            labelStyle={styles.proceedBtnLabel}
            icon="arrow-right"
          >
            Proceed to Review
          </Button>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: BG,
  },
  flex: {
    flex: 1,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },

  /* Title */
  titleBlock: {
    marginBottom: 24,
    gap: 4,
  },
  serviceTag: {
    fontSize: 11,
    fontWeight: '700',
    color: PRIMARY,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
  },
  serviceTitle: {
    fontSize: 26,
    fontWeight: '800',
    color: DARK_GREEN,
    letterSpacing: -0.4,
  },

  /* Sections */
  section: {
    marginBottom: 28,
    gap: 14,
  },
  sectionLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    marginBottom: 2,
  },
  sectionLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: DARK_GREEN,
    letterSpacing: 0.2,
  },

  /* Inputs */
  input: {
    backgroundColor: '#FFFFFF',
  },
  inputOutline: {
    borderRadius: 12,
  },
  textArea: {
    minHeight: 110,
  },
  textAreaContent: {
    paddingTop: 10,
    textAlignVertical: 'top',
  },
  affixText: {
    color: '#8CA898',
    fontSize: 13,
    fontWeight: '600',
  },

  /* Upload */
  uploadBox: {
    borderWidth: 1.5,
    borderColor: '#B8D8C4',
    borderStyle: 'dashed',
    borderRadius: 16,
    backgroundColor: '#FAFCFB',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 32,
    paddingHorizontal: 20,
    gap: 6,
  },
  uploadBoxPressed: {
    backgroundColor: '#F0F8F3',
    borderColor: PRIMARY,
  },
  uploadTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: DARK_GREEN,
    marginTop: 4,
  },
  uploadSubtitle: {
    fontSize: 12,
    color: '#8CA898',
    textAlign: 'center',
    lineHeight: 18,
  },
  uploadPill: {
    marginTop: 8,
    backgroundColor: '#E8F5EE',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
  },
  uploadPillText: {
    fontSize: 13,
    fontWeight: '700',
    color: DARK_GREEN,
  },

  /* Service Mode */
  modeRow: {
    flexDirection: 'row',
    gap: 12,
  },
  modeCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#E8EDE9',
    alignItems: 'center',
    paddingVertical: 20,
    paddingHorizontal: 12,
    gap: 6,
    position: 'relative',
  },
  modeCardSelected: {
    borderColor: PRIMARY,
    backgroundColor: '#F4FDF7',
  },
  modeIconCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#F0F5F2',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  modeIconCircleSelected: {
    backgroundColor: '#E0F7EA',
  },
  modeTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#8CA898',
    textAlign: 'center',
  },
  modeTitleSelected: {
    color: DARK_GREEN,
  },
  modeSubtitle: {
    fontSize: 11,
    color: '#B0C4B8',
    textAlign: 'center',
  },
  modeCheck: {
    position: 'absolute',
    top: 10,
    right: 10,
  },

  /* Action Bar */
  bottomPad: {
    height: 100,
  },
  actionBar: {
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E8EDE9',
    paddingHorizontal: 20,
    paddingTop: 14,
    paddingBottom: 20,
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 10,
  },
  actionSummary: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  actionSummaryLabel: {
    fontSize: 12,
    color: '#8CA898',
    fontWeight: '500',
  },
  actionSummaryValue: {
    fontSize: 13,
    fontWeight: '700',
    color: DARK_GREEN,
  },
  proceedBtn: {
    borderRadius: 14,
  },
  proceedBtnContent: {
    paddingVertical: 6,
    flexDirection: 'row-reverse',
  },
  proceedBtnLabel: {
    fontSize: 16,
    fontWeight: '700',
    color: DARK_GREEN,
    letterSpacing: 0.2,
  },
});
