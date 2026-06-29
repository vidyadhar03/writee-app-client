import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import * as DocumentPicker from 'expo-document-picker';
import * as ImagePicker from 'expo-image-picker';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import {
  Alert,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Pressable,
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

type FieldConfig = {
  id: string;
  label: string;
  type: 'text' | 'multiline';
  icon: string;
};

type ServiceConfig = {
  title: string;
  fields: FieldConfig[];
};

const serviceFormsConfig: Record<string, ServiceConfig> = {
  'property-registrations': {
    title: 'Property Registrations',
    fields: [
      { id: 'partyOne', label: 'First Party (Buyer/Donee) Name', type: 'text', icon: 'account' },
      { id: 'partyTwo', label: 'Second Party (Seller/Donor) Name', type: 'text', icon: 'account-outline' },
      { id: 'propertyLocation', label: 'Property Location (Mandal/Village)', type: 'text', icon: 'map-marker' },
    ],
  },
  'agreement-writing': {
    title: 'Agreement Writing',
    fields: [
      { id: 'partyOne', label: 'First Party Name (e.g., Landlord)', type: 'text', icon: 'account' },
      { id: 'partyTwo', label: 'Second Party Name (e.g., Tenant)', type: 'text', icon: 'account-outline' },
      { id: 'terms', label: 'Key Terms / Rent Amount', type: 'multiline', icon: 'text-box' },
    ],
  },
  'property-info': {
    title: 'Property Info (EC/Adangal)',
    fields: [
      { id: 'surveyNumber', label: 'Survey Number', type: 'text', icon: 'map-marker-path' },
      { id: 'village', label: 'Village / Mandal', type: 'text', icon: 'home-city' },
      { id: 'yearRange', label: 'Year Range (e.g., 1980-2023)', type: 'text', icon: 'calendar-range' },
    ],
  },
  'complaints': {
    title: 'Complaints Drafting',
    fields: [
      { id: 'applicantName', label: 'Complainant Name', type: 'text', icon: 'account' },
      { id: 'against', label: 'Complaint Against', type: 'text', icon: 'account-alert' },
      { id: 'description', label: 'Incident Description', type: 'multiline', icon: 'text-box' },
    ],
  },
  'notary-services': {
    title: 'Notary Services',
    fields: [
      { id: 'applicantName', label: 'Applicant Full Name', type: 'text', icon: 'account' },
      { id: 'purpose', label: 'Purpose of Affidavit', type: 'text', icon: 'briefcase' },
      { id: 'details', label: 'Additional Details', type: 'multiline', icon: 'text-box' },
    ],
  },
  'default': {
    title: 'Book Service',
    fields: [
      { id: 'fullName', label: 'Full Name', type: 'text', icon: 'account' },
      { id: 'details', label: 'Requirement Details', type: 'multiline', icon: 'text-box' },
    ],
  },
};

type ServiceMode = 'online' | 'agent';

export default function ServiceBookingScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const currentConfig = serviceFormsConfig[id ?? ''] ?? serviceFormsConfig['default'];

  const [formData, setFormData] = useState<Record<string, string>>({});
  const [mode, setMode] = useState<ServiceMode>('online');
  const [uploadedDocs, setUploadedDocs] = useState<{ name: string; uri: string }[]>([]);
  const [loading, setLoading] = useState(false);

  const handleInputChange = (fieldId: string, value: string) =>
    setFormData((prev) => ({ ...prev, [fieldId]: value }));

  const submitRequest = async () => {
    // 1. Strict Validation — check every form field in the current service config
    const emptyField = currentConfig.fields.find(
      (f) => !formData[f.id]?.trim()
    );
    if (emptyField) {
      Alert.alert(
        'Missing Details',
        `Please fill out all mandatory fields before proceeding.\n\n"${emptyField.label}" is required.`
      );
      return; // Stop execution
    }

    // 2. Auth guard
    const user = auth().currentUser;
    if (!user) {
      Alert.alert('Not signed in', 'Please log in again.');
      router.replace('/login');
      return;
    }
    setLoading(true);
    try {
      // Build a human-readable description from all filled form fields
      const description = currentConfig.fields
        .map((f) => `${f.label}: ${formData[f.id] ?? '—'}`)
        .join('\n');

      await firestore().collection('service_requests').add({
        userId: user.uid,
        userEmail: user.email,
        serviceType: currentConfig.title,
        description,
        serviceMode: mode,
        status: 'Pending',
        createdAt: firestore.FieldValue.serverTimestamp(),
      });

      Alert.alert(
        '✅ Request Submitted',
        'Your service request has been sent. We will get back to you shortly.',
        [{ text: 'OK', onPress: () => router.back() }]
      );
    } catch (error) {
      console.error('Error submitting request:', error);
      Alert.alert('Error', 'Failed to submit request. Please try again.');
    } finally {
      setLoading(false);
    }
  };


  const handleTakePhoto = async () => {
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
    if (permissionResult.granted === false) {
      Alert.alert(
        'Permission Denied',
        'You need to allow camera access to take a photo.',
      );
      return;
    }
    const result = await ImagePicker.launchCameraAsync({ quality: 0.7 });
    if (!result.canceled && result.assets.length > 0) {
      const asset = result.assets[0];
      const name = asset.uri.split('/').pop() ?? 'Camera_Photo.jpg';
      setUploadedDocs((prev) => [...prev, { name, uri: asset.uri }]);
    }
  };

  const handlePickFile = async () => {
    const result = await DocumentPicker.getDocumentAsync({ type: '*/*', multiple: true });
    if (!result.canceled && result.assets.length > 0) {
      const newDocs = result.assets.map((a) => ({ name: a.name, uri: a.uri }));
      setUploadedDocs((prev) => [...prev, ...newDocs]);
    }
  };

  const promptUpload = () => {
    Alert.alert('Upload Document', 'Choose an option', [
      { text: '📷 Take Photo', onPress: handleTakePhoto },
      { text: '📂 Choose from Device', onPress: handlePickFile },
      { text: 'Cancel', style: 'cancel' },
    ]);
  };

  const removeDoc = (index: number) => {
    setUploadedDocs((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView
            style={styles.scroll}
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
          {/* ── Service Title ── */}
          <View style={styles.titleBlock}>
            <Text style={styles.serviceTag}>Booking Form</Text>
            <Text style={styles.serviceTitle}>{currentConfig.title}</Text>
          </View>

          {/* ════════════════════════════════
              Section 1 — Basic Details (dynamic)
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

            {currentConfig.fields.map((field) => {
              const isMultiline = field.type === 'multiline';
              return (
                <TextInput
                  key={field.id}
                  mode="outlined"
                  label={field.label}
                  value={formData[field.id] ?? ''}
                  onChangeText={(text) => handleInputChange(field.id, text)}
                  multiline={isMultiline}
                  numberOfLines={isMultiline ? 4 : 1}
                  outlineColor="#D8E2DC"
                  activeOutlineColor={PRIMARY}
                  outlineStyle={styles.inputOutline}
                  style={[styles.input, isMultiline && styles.textArea]}
                  contentStyle={isMultiline ? styles.textAreaContent : undefined}
                  left={<TextInput.Icon icon={field.icon} color="#8CA898" />}
                />
              );
            })}
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

            <Pressable
              onPress={promptUpload}
              style={({ pressed }) => [styles.uploadBox, pressed && styles.uploadBoxPressed]}
            >
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

            {/* ── Uploaded file list ── */}
            {uploadedDocs.length > 0 && (
              <View style={styles.fileList}>
                {uploadedDocs.map((doc, index) => {
                  const truncated =
                    doc.name.length > 32
                      ? doc.name.slice(0, 29) + '...'
                      : doc.name;
                  return (
                    <View key={index} style={styles.fileRow}>
                      <View style={styles.fileIconWrap}>
                        <MaterialCommunityIcons
                          name="file-document-outline"
                          size={20}
                          color={DARK_GREEN}
                        />
                      </View>
                      <Text style={styles.fileName} numberOfLines={1}>
                        {truncated}
                      </Text>
                      <Pressable
                        onPress={() => removeDoc(index)}
                        style={({ pressed }) => [
                          styles.deleteBtn,
                          pressed && { opacity: 0.5 },
                        ]}
                        hitSlop={8}
                      >
                        <MaterialCommunityIcons
                          name="trash-can-outline"
                          size={18}
                          color="#E53935"
                        />
                      </Pressable>
                    </View>
                  );
                })}
              </View>
            )}
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
        </TouchableWithoutFeedback>

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
            onPress={submitRequest}
            loading={loading}
            disabled={loading}
            style={styles.proceedBtn}
            contentStyle={styles.proceedBtnContent}
            labelStyle={styles.proceedBtnLabel}
            icon="arrow-right"
          >
            {loading ? 'Submitting…' : 'Proceed to Review'}
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

  /* Uploaded file list */
  fileList: {
    marginTop: 4,
    gap: 8,
  },
  fileRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    gap: 12,
    borderWidth: 1,
    borderColor: '#E8EDE9',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  fileIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: '#E8F5EE',
    alignItems: 'center',
    justifyContent: 'center',
  },
  fileName: {
    flex: 1,
    fontSize: 13,
    fontWeight: '600',
    color: DARK_GREEN,
  },
  deleteBtn: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    backgroundColor: '#FFF0F0',
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
