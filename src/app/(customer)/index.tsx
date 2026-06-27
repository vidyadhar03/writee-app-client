import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Card, Searchbar, Text } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';

const PRIMARY = '#1ED760';
const DARK_GREEN = '#06311E';
const BG = '#F7F9F8';

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

export default function CustomerHomeScreen() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');

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
            <Text style={styles.greetingSmall}>Good morning,</Text>
            <Text style={styles.greetingBig}>Hello, User 👋</Text>
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

        {/* ── Banner Card ── */}
        <Card style={styles.bannerCard} mode="contained">
          <View style={styles.bannerContent}>
            {/* Decorative circles */}
            <View style={styles.bannerCircle1} />
            <View style={styles.bannerCircle2} />

            <View style={styles.bannerTextBlock}>
              <Text style={styles.bannerTag}>⚡ FAST DELIVERY</Text>
              <Text style={styles.bannerTitle}>
                Need an Agreement Fast?
              </Text>
              <Text style={styles.bannerSubtitle}>
                We deliver to your doorstep.
              </Text>
              <TouchableOpacity style={styles.bannerBtn} activeOpacity={0.85}>
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
              onPress={() =>
                router.push(`/(customer)/service/${service.slug}`)
              }
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

        {/* ── Recent Activity ── */}
        <Text style={styles.sectionTitle}>Recent Activity</Text>
        <Card style={styles.emptyCard} mode="elevated">
          <View style={styles.emptyContent}>
            <MaterialCommunityIcons name="history" size={40} color="#C8D8CC" />
            <Text style={styles.emptyText}>No recent orders</Text>
            <Text style={styles.emptySubtext}>Your activity will appear here</Text>
          </View>
        </Card>

        <View style={styles.bottomPad} />
      </ScrollView>
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
});
