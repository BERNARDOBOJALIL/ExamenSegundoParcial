import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  signInWithPopup,
  GoogleAuthProvider,
} from "firebase/auth";
import { db } from "./firebaseConfig";
import { doc, setDoc, getDoc, serverTimestamp } from "firebase/firestore";

const auth = getAuth();
const googleProvider = new GoogleAuthProvider();

const getUserData = async () => {
  const user = auth.currentUser;
  if (!user) {
    return null;
  }

  const userDoc = doc(db, "Users", user.uid);
  const docSnapshot = await getDoc(userDoc);

  if (docSnapshot.exists()) {
    return docSnapshot.data();
  } else {
    return null;
  }
};

const registerUser = async (email, password, name) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    const userId = userCredential.user.uid;

    await setDoc(doc(db, "Users", userId), {
      name: name,
      role: "client",
      email: email,
      createdAt: serverTimestamp(),
      card: null,
    });

    return { user: userCredential.user, error: null };
  } catch (error) {
    return { user: null, error: error.message };
  }
};

const loginUser = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );

    return { user: userCredential.user, error: null };
  } catch (error) {
    return { user: null, error: error.message };
  }
};

const logoutUser = async () => {
  try {
    await signOut(auth);

    return { user: null, error: null };
  } catch (error) {
    return { error: error.message };
  }
};

const loginWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;

    const userDoc = doc(db, "Users", user.uid);
    const docSnapshot = await getDoc(userDoc);

    if (!docSnapshot.exists()) {
      await setDoc(userDoc, {
        name: user.displayName,
        email: user.email,
        role: "client",
        createdAt: serverTimestamp(),
        card: null,
      });
    }

    return { user, error: null };
  } catch (error) {
    return { user: null, error: error.message };
  }
};

export { registerUser, loginUser, logoutUser, loginWithGoogle, getUserData };
