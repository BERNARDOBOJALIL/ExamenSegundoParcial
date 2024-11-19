import { 
  getAuth, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut,
  signInWithPopup,
  GoogleAuthProvider 
} from 'firebase/auth';
import { db } from './firebaseConfig';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';

const auth = getAuth();
const googleProvider = new GoogleAuthProvider();

const getUserData = async () => {
  const user = auth.currentUser;
  if (!user) {
    console.error("No user is currently authenticated.");
    return null;
  }

  const userDoc = doc(db, 'Users', user.uid); 
  const docSnapshot = await getDoc(userDoc);

  if (docSnapshot.exists()) {
    return docSnapshot.data(); 
  } else {
    console.error('No user data found in Firestore for uid:', user.uid);
    return null;
  }
};

const registerUser = async (email, password, name) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const userId = userCredential.user.uid;

    await setDoc(doc(db, 'Users', userId), {
      name: name,
      role: 'user', 
      createdAt: serverTimestamp(),
    });

    console.log('User registered:', userId);
    return { user: userCredential.user, error: null };
  } catch (error) {
    console.error('Error registering user:', error.message);
    return { user: null, error: error.message };
  }
};

const loginUser = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    console.log('User logged in:', userCredential.user.uid);
    return { user: userCredential.user, error: null };
  } catch (error) {
    console.error('Error logging in user:', error.message);
    return { user: null, error: error.message };
  }
};

const logoutUser = async () => {
  try {
    await signOut(auth);
    console.log('User logged out');
    return { user: null, error: null };
  } catch (error) {
    console.error('Error logging out user:', error.message);
    return { error: error.message };
  }
};

// Nueva función para iniciar sesión con Google
const loginWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;

    // Verifica si el usuario ya está registrado en Firestore
    const userDoc = doc(db, 'Users', user.uid);
    const docSnapshot = await getDoc(userDoc);

    if (!docSnapshot.exists()) {
      // Si el usuario no existe, lo registra automáticamente
      await setDoc(userDoc, {
        name: user.displayName,
        email: user.email,
        role: 'user',
        createdAt: serverTimestamp(),
      });
    }

    console.log('User logged in with Google:', user.uid);
    return { user, error: null };
  } catch (error) {
    console.error('Error logging in with Google:', error.message);
    return { user: null, error: error.message };
  }
};

export { registerUser, loginUser, logoutUser, loginWithGoogle, getUserData };
