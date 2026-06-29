import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  View,
} from 'react-native';
import { Text } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';

const PRIMARY = '#1ED760';
const DARK_GREEN = '#06311E';
const BG = '#F7F9F8';

type ServiceRequest = {
  id: string;
  serviceType: string;
  description: string;
  urgency: string;
  status: string;
  createdAt: any;
  userEmail?: string;
};

type StatusConfig = {
  bg: string;
  text: string;
  dot: string;
};

const STATUS_CONFIG: Record<string, StatusConfig> = {
  Pending: { bg: '#FFF8E1', text: '#F57F17', dot: '#FFB300' },
  Approved: { bg: '#E8F5E9', text: '#2E7D32', dot: '#43A047' },
  'In Progress': { bg: '#E3F2FD', text: '#1565C0', dot: '#1E88E5' },
  Completed: { bg: '#E8F5EE', text: DARK_GREEN, dot: PRIMARY },
  Rejected: { bg: '#FFEBEE', text: '#C62828', dot: '#E53935' },
};

function formatDate(timestamp: any): string {
  if (!timestamp?.toDate) return '—';
  const d = timestamp.toDate() as Date;
  return d.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

function RequestCard({ item }: { item: ServiceRequest }) {
  const cfg = STATUS_CONFIG[item.status] ?? STATUS_CONFIG['Pending'];
  return (
    <View style={styles.card}>
      {/* Card header */}
      <View style={styles.cardHeader}>
        <View style={styles.serviceIconWrap}>
          <MaterialCommunityIcons
            name="file-document-edit-outline"
            size={20}
            color={DARK_GREEN}
          />
        </View>
        <View style={styles.cardHeaderText}>
          <Text style={styles.cardService}>{item.serviceType}</Text>
          <Text style={styles.cardDate}>{formatDate(item.createdAt)}</Text>
        </View>
        {/* Status pill */}
        <View style={[styles.statusPill, { backgroundColor: cfg.bg }]}>
          <View style={[styles.statusDot, { backgroundColor: cfg.dot }]} />
          <Text style={[styles.statusText, { color: cfg.text }]}>
            {item.status}
          </Text>
        </View>
      </View>

      {/* Divider */}
      <View style={styles.divider} />

      {/* Description */}
      <Text style={styles.cardDesc} numberOfLines={2}>
        {item.description}
      </Text>

      {/* Footer */}
      <View style={styles.cardFooter}>
        <View style={styles.urgencyTag}>
          <MaterialCommunityIcons
            name={item.urgency === 'High' ? 'lightning-bolt' : 'clock-outline'}
            size={12}
            color={item.urgency === 'High' ? '#F57F17' : '#8CA898'}
          />
          <Text
            style={[
              styles.urgencyText,
              item.urgency === 'High' && styles.urgencyHighText,
            ]}
          >
            {item.urgency}
          </Text>
        </View>
      </View>
    </View>
  );
}

export default function TrackScreen() {
  const router = useRouter();
  const [requests, setRequests] = useState<ServiceRequest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const user = auth().currentUser;
    if (!user) {
      router.replace('/login');
      return;
    }

    const unsubscribe = firestore()
      .collection('service_requests')
      .where('userId', '==', user.uid)
      .orderBy('createdAt', 'desc')
      .onSnapshot(
        (querySnapshot) => {
          const fetched = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...(doc.data() as Omit<ServiceRequest, 'id'>),
          }));
          setRequests(fetched);
          setLoading(false);
        },
        (error) => {
          console.error('Error fetching tracking data:', error);
          setLoading(false);
        }
      );

    return () => unsubscribe();
  }, []);

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      {/* ── Page Header ── */}
      <View style={styles.pageHeader}>
        <View>
          <Text style={styles.pageTitle}>My Requests</Text>
          <Text style={styles.pageSubtitle}>
            {requests.length} {requests.length === 1 ? 'request' : 'requests'} found
          </Text>
        </View>
        <View style={styles.headerBadge}>
          <MaterialCommunityIcons
            name="clipboard-text-clock"
            size={22}
            color={PRIMARY}
          />
        </View>
      </View>

      {loading ? (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={PRIMARY} />
          <Text style={styles.loadingText}>Loading your requests…</Text>
        </View>
      ) : requests.length === 0 ? (
        <View style={styles.centered}>
          <View style={styles.emptyIcon}>
            <MaterialCommunityIcons
              name="clipboard-text-off-outline"
              size={48}
              color="#C8D8CC"
            />
          </View>
          <Text style={styles.emptyTitle}>No requests yet</Text>
          <Text style={styles.emptySubtitle}>
            Submit a service request from the Home tab and it will appear here.
          </Text>
        </View>
      ) : (
        <FlatList
          data={requests}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <RequestCard item={item} />}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: BG },

  pageHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 14,
  },
  pageTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: DARK_GREEN,
    letterSpacing: -0.3,
  },
  pageSubtitle: { fontSize: 13, color: '#5A7566', marginTop: 2 },
  headerBadge: {
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

  list: { paddingHorizontal: 20, paddingBottom: 32 },

  /* Request Card */
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  serviceIconWrap: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: '#E8F5EE',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardHeaderText: { flex: 1 },
  cardService: {
    fontSize: 14,
    fontWeight: '700',
    color: DARK_GREEN,
  },
  cardDate: { fontSize: 11, color: '#8CA898', marginTop: 2 },

  statusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  statusText: { fontSize: 11, fontWeight: '700' },

  divider: {
    height: 1,
    backgroundColor: '#F0F4F1',
    marginVertical: 12,
  },

  cardDesc: {
    fontSize: 13,
    color: '#5A7566',
    lineHeight: 19,
  },

  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  urgencyTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
    backgroundColor: '#F7F9F8',
  },
  urgencyText: { fontSize: 11, fontWeight: '600', color: '#8CA898' },
  urgencyHighText: { color: '#F57F17' },

  /* States */
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
    gap: 12,
  },
  loadingText: { fontSize: 14, color: '#8CA898', marginTop: 8 },
  emptyIcon: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: '#E8F5EE',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: DARK_GREEN,
  },
  emptySubtitle: {
    fontSize: 13,
    color: '#8CA898',
    textAlign: 'center',
    lineHeight: 19,
  },
});
