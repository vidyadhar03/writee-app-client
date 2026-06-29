import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { Card, Searchbar, Text } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';

const PRIMARY = '#1ED760';
const DARK_GREEN = '#06311E';
const BG = '#F7F9F8';

// ── Shared types & helpers (mirrors Track tab) ───────────────────────────────
type ServiceRequest = {
  id: string;
  serviceType: string;
  description: string;
  urgency: string;
  status: string;
  createdAt: any;
  userEmail?: string;
};

type StatusConfig = { bg: string; text: string; dot: string };

const STATUS_CONFIG: Record<string, StatusConfig> = {
  Pending:      { bg: '#FFF8E1', text: '#F57F17', dot: '#FFB300' },
  Approved:     { bg: '#E8F5E9', text: '#2E7D32', dot: '#43A047' },
  'In Progress':{ bg: '#E3F2FD', text: '#1565C0', dot: '#1E88E5' },
  Completed:    { bg: '#E8F5EE', text: DARK_GREEN, dot: PRIMARY },
  Rejected:     { bg: '#FFEBEE', text: '#C62828', dot: '#E53935' },
};

function formatDate(timestamp: any): string {
  if (!timestamp?.toDate) return '—';
  const d = timestamp.toDate() as Date;
  return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
}
// ─────────────────────────────────────────────────────────────────────────────

const SERVICES = [
  {
    id: '1',
    slug: 'property-registrations',
    label: 'Property\nRegistrations',
    icon: 'home-city' as const,
    color: '#E8F5EE',
    iconColor: DARK_GREEN,
  },
  {
    id: '2',
    slug: 'agreement-writing',
    label: 'Agreement\nWriting',
    icon: 'file-document-edit' as const,
    color: '#EEF7EE',
    iconColor: '#2E7D32',
  },
  {
    id: '3',
    slug: 'property-info',
    label: 'Property\nInfo',
    icon: 'magnify-scan' as const,
    color: '#F0F8FF',
    iconColor: '#1565C0',
  },
  {
    id: '4',
    slug: 'complaints',
    label: 'Complaints',
    icon: 'gavel' as const,
    color: '#FFF8E1',
    iconColor: '#F57F17',
  },
  {
    id: '5',
    slug: 'notary-services',
    label: 'Notary\nServices',
    icon: 'stamper' as const,
    color: '#F3E5F5',
    iconColor: '#6A1B9A',
  },
];

const TIME_SLOTS = ['Morning', 'Afternoon', 'Evening'];

export default function CustomerHomeScreen() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');

  // ── Dynamic greeting & name ──────────────────────────────────────────────
  const userName = auth().currentUser?.email?.split('@')[0] || 'User';
  const currentHour = new Date().getHours();
  let greeting = 'Good evening,';
  if (currentHour < 12) greeting = 'Good morning,';
  else if (currentHour < 18) greeting = 'Good afternoon,';
  // ────────────────────────────────────────────────────────────────────────

  // ── Drawer state ──────────────────────────────────────────────────────────
  const [isDrawerVisible, setDrawerVisible] = useState(false);
  const [drawerMode, setDrawerMode] = useState<'agent' | 'fast' | null>(null);

  // Agent Request State
  const [address, setAddress] = useState('');
  const [timeSlot, setTimeSlot] = useState('');

  // Fast Delivery State
  const [selectedFastService, setSelectedFastService] = useState('');
  // ──────────────────────────────────────────────────────────────────────────

  // ── Recent Activity: live Firestore listener (latest 3) ──────────────────
  const [recentRequests, setRecentRequests] = useState<ServiceRequest[]>([]);
  const [recentLoading, setRecentLoading] = useState(true);

  useEffect(() => {
    const user = auth().currentUser;
    if (!user) return;

    const unsubscribe = firestore()
      .collection('service_requests')
      .where('userId', '==', user.uid)
      .orderBy('createdAt', 'desc')
      .limit(3)
      .onSnapshot(
        (snap) => {
          setRecentRequests(
            snap.docs.map((doc) => ({ id: doc.id, ...(doc.data() as Omit<ServiceRequest, 'id'>) }))
          );
          setRecentLoading(false);
        },
        () => setRecentLoading(false)
      );

    return () => unsubscribe();
  }, []);
  // ──────────────────────────────────────────────────────────────────────────


  // ── Agent Request Submit ───────────────────────────────────────────────────
  const submitAgentRequest = async () => {
    if (!address.trim() || !timeSlot) {
      Alert.alert('Error', 'Please provide address and slot.');
      return;
    }
    try {
      await firestore().collection('service_requests').add({
        userId: auth().currentUser?.uid,
        userEmail: auth().currentUser?.email,
        serviceType: 'Agent Request',
        description: `Visit Address: ${address}\nSlot: ${timeSlot}`,
        status: 'Pending',
        createdAt: firestore.FieldValue.serverTimestamp(),
      });
      setDrawerVisible(false);
      setAddress('');
      setTimeSlot('');
      Alert.alert('Success', 'Agent requested successfully!');
    } catch (error) {
      console.error('Agent request error:', error);
      Alert.alert('Error', 'Failed to submit. Please try again.');
    }
  };
  // ──────────────────────────────────────────────────────────────────────────

  // ── Fast Service Proceed ───────────────────────────────────────────────────
  const proceedFastService = () => {
    if (!selectedFastService) {
      Alert.alert('Error', 'Please select a service.');
      return;
    }
    setDrawerVisible(false);
    setSelectedFastService('');
    router.push(`/(customer)/service/${selectedFastService}`);
  };
  // ──────────────────────────────────────────────────────────────────────────

  const closeDrawer = () => {
    setDrawerVisible(false);
    setAddress('');
    setTimeSlot('');
    setSelectedFastService('');
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* ── Header ── */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greetingSmall}>{greeting}</Text>
            <Text style={styles.greetingBig}>{userName}</Text>
          </View>
          {/* Notification bell */}
          <TouchableOpacity style={styles.bellBtn} activeOpacity={0.7}>
            <MaterialCommunityIcons name="bell-outline" size={24} color={DARK_GREEN} />
            <View style={styles.bellDot} />
          </TouchableOpacity>
        </View>

        {/* ── Search ── */}
        <Searchbar
          placeholder="Search services (e.g., Rental Agreement)"
          onChangeText={setSearchQuery}
          value={searchQuery}
          style={styles.searchBar}
          inputStyle={styles.searchInput}
          placeholderTextColor="#8CA898"
          iconColor={DARK_GREEN}
          elevation={0}
        />

        {/* ── Fast Delivery Banner ── */}
        <Card style={styles.bannerCard} mode="contained">
          <View style={styles.bannerContent}>
            <View style={styles.bannerCircle1} />
            <View style={styles.bannerCircle2} />

            <View style={styles.bannerTextBlock}>
              <Text style={styles.bannerTag}>⚡ FAST DELIVERY</Text>
              <Text style={styles.bannerTitle}>Need an Agreement Fast?</Text>
              <Text style={styles.bannerSubtitle}>We deliver to your doorstep.</Text>
              <TouchableOpacity
                style={styles.bannerBtn}
                activeOpacity={0.85}
                onPress={() => { setDrawerMode('fast'); setDrawerVisible(true); }}
              >
                <Text style={styles.bannerBtnText}>Book Now →</Text>
              </TouchableOpacity>
            </View>

            <MaterialCommunityIcons
              name="file-sign"
              size={80}
              color="rgba(255,255,255,0.12)"
              style={styles.bannerIcon}
            />
          </View>
        </Card>

        {/* ── Services Grid ── */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Our Core Services</Text>
          <TouchableOpacity activeOpacity={0.7}>
            <Text style={styles.seeAll}>See all</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.grid}>
          {SERVICES.map((service) => (
            <TouchableOpacity
              key={service.id}
              style={styles.gridItem}
              activeOpacity={0.75}
              onPress={() => router.push(`/(customer)/service/${service.slug}`)}
            >
              <Card style={styles.serviceCard} mode="elevated">
                <View style={styles.serviceCardContent}>
                  <View style={[styles.iconCircle, { backgroundColor: service.color }]}>
                    <MaterialCommunityIcons
                      name={service.icon}
                      size={28}
                      color={service.iconColor}
                    />
                  </View>
                  <Text style={styles.serviceLabel}>{service.label}</Text>
                </View>
              </Card>
            </TouchableOpacity>
          ))}

          {/* Spacer card to keep grid even when count is odd */}
          {SERVICES.length % 2 !== 0 && (
            <View style={[styles.gridItem, { opacity: 0 }]} pointerEvents="none" />
          )}
        </View>

        {/* ── Agent Banner ── */}
        <Card style={styles.agentBannerCard} mode="contained">
          <View style={styles.bannerContent}>
            <View style={styles.bannerCircle1} />
            <View style={styles.bannerCircle2} />

            <View style={styles.bannerTextBlock}>
              <Text style={styles.bannerTag}>⚡ ON-DEMAND</Text>
              <Text style={styles.bannerTitle}>Request an Agent</Text>
              <Text style={styles.bannerSubtitle}>
                Need in-person assistance? We'll come to you.
              </Text>
              <TouchableOpacity
                style={styles.bannerBtn}
                activeOpacity={0.85}
                onPress={() => { setDrawerMode('agent'); setDrawerVisible(true); }}
              >
                <Text style={styles.bannerBtnText}>Request Now →</Text>
              </TouchableOpacity>
            </View>

            <MaterialCommunityIcons
              name="account-tie"
              size={80}
              color="rgba(255,255,255,0.12)"
              style={styles.bannerIcon}
            />
          </View>
        </Card>

        {/* ── Recent Activity ── */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recent Activity</Text>
          <TouchableOpacity activeOpacity={0.7} onPress={() => router.push('/(customer)/track')}>
            <Text style={styles.seeAll}>See all</Text>
          </TouchableOpacity>
        </View>

        {recentLoading ? (
          <View style={styles.recentLoadingBox}>
            <ActivityIndicator size="small" color={PRIMARY} />
          </View>
        ) : recentRequests.length === 0 ? (
          <Card style={styles.emptyCard} mode="elevated">
            <View style={styles.emptyContent}>
              <MaterialCommunityIcons name="history" size={40} color="#C8D8CC" />
              <Text style={styles.emptyText}>No recent orders</Text>
              <Text style={styles.emptySubtext}>Your activity will appear here</Text>
            </View>
          </Card>
        ) : (
          <View style={styles.recentList}>
            {recentRequests.map((item, idx) => {
              const cfg = STATUS_CONFIG[item.status] ?? STATUS_CONFIG['Pending'];
              return (
                <View
                  key={item.id}
                  style={[
                    styles.recentCard,
                    idx < recentRequests.length - 1 && styles.recentCardGap,
                  ]}
                >
                  {/* Card header */}
                  <View style={styles.recentCardHeader}>
                    <View style={styles.recentIconWrap}>
                      <MaterialCommunityIcons
                        name="file-document-edit-outline"
                        size={18}
                        color={DARK_GREEN}
                      />
                    </View>
                    <View style={styles.recentCardHeaderText}>
                      <Text style={styles.recentCardService}>{item.serviceType}</Text>
                      <Text style={styles.recentCardDate}>{formatDate(item.createdAt)}</Text>
                    </View>
                    <View style={[styles.recentStatusPill, { backgroundColor: cfg.bg }]}>
                      <View style={[styles.recentStatusDot, { backgroundColor: cfg.dot }]} />
                      <Text style={[styles.recentStatusText, { color: cfg.text }]}>
                        {item.status}
                      </Text>
                    </View>
                  </View>

                  {/* Divider */}
                  <View style={styles.recentDivider} />

                  {/* Description */}
                  <Text style={styles.recentCardDesc} numberOfLines={2}>
                    {item.description}
                  </Text>
                </View>
              );
            })}
          </View>
        )}

        <View style={styles.bottomPad} />
      </ScrollView>

      {/* ════════════════════════════════════════════════════════
          Centered Modal
      ════════════════════════════════════════════════════════ */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={isDrawerVisible}
        onRequestClose={closeDrawer}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={styles.modalOuter}
        >
          {/* Dimmed backdrop — tap to dismiss */}
          <TouchableWithoutFeedback onPress={closeDrawer}>
            <View style={StyleSheet.absoluteFill} />
          </TouchableWithoutFeedback>

          {/* Card — stops tap propagation so tapping inside doesn’t close */}
          <TouchableWithoutFeedback onPress={() => {}}>
            <View style={styles.modalCard}>

              {/* ── Header row: icon + text + close ── */}
              {drawerMode === 'agent' && (
                <View style={styles.modalHeader}>
                  <View style={styles.modalIconCircle}>
                    <MaterialCommunityIcons name="account-tie" size={22} color={DARK_GREEN} />
                  </View>
                  <View style={styles.modalHeaderText}>
                    <Text style={styles.modalTitle}>Request Agent Visit</Text>
                    <Text style={styles.modalSubtitle}>We’ll send an agent to your location</Text>
                  </View>
                  <TouchableOpacity onPress={closeDrawer} hitSlop={12} style={styles.modalCloseBtn}>
                    <MaterialCommunityIcons name="close" size={20} color="#8CA898" />
                  </TouchableOpacity>
                </View>
              )}
              {drawerMode === 'fast' && (
                <View style={styles.modalHeader}>
                  <View style={styles.modalIconCircle}>
                    <MaterialCommunityIcons name="file-sign" size={22} color={DARK_GREEN} />
                  </View>
                  <View style={styles.modalHeaderText}>
                    <Text style={styles.modalTitle}>Select Service</Text>
                    <Text style={styles.modalSubtitle}>Choose the service you need fast</Text>
                  </View>
                  <TouchableOpacity onPress={closeDrawer} hitSlop={12} style={styles.modalCloseBtn}>
                    <MaterialCommunityIcons name="close" size={20} color="#8CA898" />
                  </TouchableOpacity>
                </View>
              )}

              {/* ── Scrollable body ── */}
              <ScrollView
                style={styles.modalScroll}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
                contentContainerStyle={styles.modalScrollContent}
              >
                {/* ── AGENT MODE ── */}
                {drawerMode === 'agent' && (
                  <>
                    <Text style={styles.drawerFieldLabel}>Your Address</Text>
                    <TextInput
                      style={styles.drawerInput}
                      placeholder="e.g., 12, MG Road, Bangalore"
                      placeholderTextColor="#B0C4B8"
                      value={address}
                      onChangeText={setAddress}
                      multiline
                      numberOfLines={3}
                      textAlignVertical="top"
                    />
                    <Text style={styles.drawerFieldLabel}>Preferred Time Slot</Text>
                    <View style={styles.pillRow}>
                      {TIME_SLOTS.map((slot) => (
                        <TouchableOpacity
                          key={slot}
                          style={[styles.pill, timeSlot === slot && styles.pillActive]}
                          onPress={() => setTimeSlot(slot)}
                          activeOpacity={0.75}
                        >
                          <Text style={[styles.pillText, timeSlot === slot && styles.pillTextActive]}>
                            {slot}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  </>
                )}

                {/* ── FAST SERVICE MODE ── */}
                {drawerMode === 'fast' && (
                  <>
                    {SERVICES.map((service) => (
                      <TouchableOpacity
                        key={service.id}
                        style={[
                          styles.serviceListItem,
                          selectedFastService === service.slug && styles.serviceListItemActive,
                        ]}
                        onPress={() => setSelectedFastService(service.slug)}
                        activeOpacity={0.75}
                      >
                        <View style={[styles.serviceListIcon, { backgroundColor: service.color }]}>
                          <MaterialCommunityIcons
                            name={service.icon}
                            size={22}
                            color={service.iconColor}
                          />
                        </View>
                        <Text
                          style={[
                            styles.serviceListLabel,
                            selectedFastService === service.slug && styles.serviceListLabelActive,
                          ]}
                        >
                          {service.label.replace('\n', ' ')}
                        </Text>
                        {selectedFastService === service.slug && (
                          <MaterialCommunityIcons name="check-circle" size={20} color={PRIMARY} />
                        )}
                      </TouchableOpacity>
                    ))}
                  </>
                )}
              </ScrollView>

              {/* ── Pinned CTA ── */}
              <View style={styles.modalCTAContainer}>
                {drawerMode === 'agent' && (
                  <TouchableOpacity
                    style={[
                      styles.drawerCTA,
                      (!address.trim() || !timeSlot) && styles.drawerCTADisabled,
                    ]}
                    onPress={submitAgentRequest}
                    activeOpacity={0.85}
                  >
                    <MaterialCommunityIcons name="check-circle-outline" size={18} color={DARK_GREEN} />
                    <Text style={styles.drawerCTAText}>Submit Request</Text>
                  </TouchableOpacity>
                )}
                {drawerMode === 'fast' && (
                  <TouchableOpacity
                    style={[
                      styles.drawerCTA,
                      !selectedFastService && styles.drawerCTADisabled,
                    ]}
                    onPress={proceedFastService}
                    activeOpacity={0.85}
                  >
                    <MaterialCommunityIcons name="arrow-right-circle-outline" size={18} color={DARK_GREEN} />
                    <Text style={styles.drawerCTAText}>Proceed</Text>
                  </TouchableOpacity>
                )}
              </View>

            </View>
          </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: BG,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 16,
  },

  /* Header */
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  greetingSmall: {
    fontSize: 13,
    color: '#5A7566',
    fontWeight: '500',
  },
  greetingBig: {
    fontSize: 22,
    fontWeight: '800',
    color: DARK_GREEN,
    letterSpacing: -0.3,
    marginTop: 2,
  },
  bellBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  bellDot: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FF4D4D',
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
  },

  /* Search */
  searchBar: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#E8EDE9',
  },
  searchInput: {
    fontSize: 13,
    color: DARK_GREEN,
  },

  /* Banner */
  bannerCard: {
    backgroundColor: DARK_GREEN,
    borderRadius: 20,
    marginBottom: 16,
    overflow: 'hidden',
  },
  agentBannerCard: {
    backgroundColor: '#0A3D26',
    borderRadius: 20,
    marginBottom: 24,
    overflow: 'hidden',
  },
  bannerContent: {
    padding: 22,
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 140,
  },
  bannerCircle1: {
    position: 'absolute',
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: 'rgba(30, 215, 96, 0.08)',
    top: -40,
    right: 20,
  },
  bannerCircle2: {
    position: 'absolute',
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(30, 215, 96, 0.06)',
    bottom: -30,
    right: 60,
  },
  bannerTextBlock: {
    flex: 1,
    gap: 4,
  },
  bannerTag: {
    fontSize: 10,
    color: PRIMARY,
    fontWeight: '700',
    letterSpacing: 1,
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  bannerTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: -0.3,
    lineHeight: 26,
  },
  bannerSubtitle: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.65)',
    marginTop: 2,
    marginBottom: 12,
  },
  bannerBtn: {
    backgroundColor: PRIMARY,
    alignSelf: 'flex-start',
    paddingHorizontal: 18,
    paddingVertical: 8,
    borderRadius: 20,
  },
  bannerBtnText: {
    color: DARK_GREEN,
    fontSize: 13,
    fontWeight: '700',
  },
  bannerIcon: {
    position: 'absolute',
    right: 14,
    bottom: 10,
  },

  /* Section header */
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: DARK_GREEN,
    letterSpacing: -0.2,
    marginBottom: 14,
  },
  seeAll: {
    fontSize: 13,
    fontWeight: '600',
    color: PRIMARY,
  },

  /* Grid */
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 28,
  },
  gridItem: {
    width: '47.5%',
  },
  serviceCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
  },
  serviceCardContent: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
    paddingHorizontal: 12,
    gap: 10,
  },
  iconCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  serviceLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: DARK_GREEN,
    textAlign: 'center',
    lineHeight: 17,
  },

  /* Empty state */
  emptyCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginBottom: 12,
  },
  emptyContent: {
    alignItems: 'center',
    paddingVertical: 28,
    gap: 6,
  },
  emptyText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#8CA898',
  },
  emptySubtext: {
    fontSize: 12,
    color: '#C8D8CC',
  },
  bottomPad: {
    height: 16,
  },

  /* ── Recent Activity cards ── */
  recentLoadingBox: {
    alignItems: 'center',
    paddingVertical: 24,
  },
  recentList: {
    gap: 10,
    marginBottom: 8,
  },
  recentCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  recentCardGap: {
    marginBottom: 0,
  },
  recentCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  recentIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 11,
    backgroundColor: '#E8F5EE',
    alignItems: 'center',
    justifyContent: 'center',
  },
  recentCardHeaderText: { flex: 1 },
  recentCardService: {
    fontSize: 13,
    fontWeight: '700',
    color: DARK_GREEN,
  },
  recentCardDate: { fontSize: 11, color: '#8CA898', marginTop: 2 },
  recentStatusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: 20,
  },
  recentStatusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  recentStatusText: { fontSize: 10, fontWeight: '700' },
  recentDivider: {
    height: 1,
    backgroundColor: '#F0F4F1',
    marginVertical: 10,
  },
  recentCardDesc: {
    fontSize: 12,
    color: '#5A7566',
    lineHeight: 18,
  },

  /* ── Centered Modal ── */
  modalOuter: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  modalCard: {
    width: '100%',
    maxHeight: '80%',
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.18,
    shadowRadius: 24,
    elevation: 24,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    paddingHorizontal: 22,
    paddingTop: 22,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F5F2',
  },
  modalIconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#E8F5EE',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalHeaderText: {
    flex: 1,
  },
  modalTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: DARK_GREEN,
    letterSpacing: -0.3,
  },
  modalSubtitle: {
    fontSize: 12,
    color: '#8CA898',
    marginTop: 2,
  },
  modalCloseBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F0F5F2',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalScroll: {
    flexGrow: 0,
  },
  modalScrollContent: {
    paddingHorizontal: 22,
    paddingTop: 20,
    paddingBottom: 4,
  },
  modalCTAContainer: {
    paddingHorizontal: 22,
    paddingTop: 14,
    paddingBottom: 22,
    borderTopWidth: 1,
    borderTopColor: '#F0F5F2',
  },

  /* Field label */
  drawerFieldLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#5A7566',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
    marginBottom: 10,
  },
  drawerInput: {
    backgroundColor: '#F7F9F8',
    borderWidth: 1.5,
    borderColor: '#D8E2DC',
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 15,
    color: DARK_GREEN,
    marginBottom: 20,
    minHeight: 90,
  },
  pillRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 4,
  },
  pill: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#D8E2DC',
    backgroundColor: '#F7F9F8',
    alignItems: 'center',
  },
  pillActive: {
    backgroundColor: DARK_GREEN,
    borderColor: DARK_GREEN,
  },
  pillText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#5A7566',
  },
  pillTextActive: {
    color: PRIMARY,
    fontWeight: '700',
  },

  /* Service list items (fast mode) */
  serviceListItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    backgroundColor: '#F7F9F8',
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 16,
    marginBottom: 10,
    borderWidth: 1.5,
    borderColor: '#E8EDE9',
  },
  serviceListItemActive: {
    borderColor: PRIMARY,
    backgroundColor: '#F0FDF4',
  },
  serviceListIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  serviceListLabel: {
    flex: 1,
    fontSize: 14,
    fontWeight: '600',
    color: '#5A7566',
  },
  serviceListLabelActive: {
    color: DARK_GREEN,
    fontWeight: '700',
  },

  /* CTA */
  drawerCTA: {
    backgroundColor: PRIMARY,
    borderRadius: 16,
    paddingVertical: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  drawerCTADisabled: {
    opacity: 0.45,
  },
  drawerCTAText: {
    fontSize: 16,
    fontWeight: '800',
    color: DARK_GREEN,
    letterSpacing: 0.2,
  },
});
