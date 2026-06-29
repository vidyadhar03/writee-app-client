// React Native Firebase initializes automatically from the native
// GoogleService-Info.plist (iOS) and google-services.json (Android) files.
// No manual initializeApp() call is needed here.
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

export { auth, firestore };
