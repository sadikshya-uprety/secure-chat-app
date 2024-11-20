import { db, auth } from './firebase';
import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  updateDoc,
  doc,
  deleteDoc,
  onSnapshot,
} from 'firebase/firestore';

// ** Add a new user to the database **
export const addUser = async (user) => {
  try {
    const userRef = collection(db, 'users');
    const docRef = await addDoc(userRef, user);
    return docRef.id;
  } catch (error) {
    console.error('Error adding user:', error);
    throw error;
  }
};

// ** Fetch all users from the database **
export const fetchUsers = async () => {
  try {
    const userRef = collection(db, 'users');
    const snapshot = await getDocs(userRef);
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
};

// ** Send a message (public or private) **
export const sendMessage = async (messageData, isPrivate = false) => {
  try {
    const collectionName = isPrivate ? 'privateMessages' : 'publicMessages';
    const messagesRef = collection(db, collectionName);
    await addDoc(messagesRef, messageData);
  } catch (error) {
    console.error('Error sending message:', error);
    throw error;
  }
};

// ** Fetch messages (public or private) **
export const fetchMessages = async (isPrivate = false, recipientId = null) => {
  try {
    const collectionName = isPrivate ? 'privateMessages' : 'publicMessages';
    const messagesRef = collection(db, collectionName);

    let messagesQuery;
    if (isPrivate && recipientId) {
      messagesQuery = query(messagesRef, where('recipientId', '==', recipientId));
    } else {
      messagesQuery = messagesRef;
    }

    const snapshot = await getDocs(messagesQuery);
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error('Error fetching messages:', error);
    throw error;
  }
};

// ** Listen for real-time message updates (public or private) **
export const listenToMessages = (callback, isPrivate = false, recipientId = null) => {
  const collectionName = isPrivate ? 'privateMessages' : 'publicMessages';
  const messagesRef = collection(db, collectionName);

  let messagesQuery;
  if (isPrivate && recipientId) {
    messagesQuery = query(messagesRef, where('recipientId', '==', recipientId));
  } else {
    messagesQuery = messagesRef;
  }

  return onSnapshot(messagesQuery, (snapshot) => {
    const messages = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    callback(messages);
  });
};

// ** Mark a private message as seen and delete it **
export const markMessageAsSeen = async (messageId) => {
  try {
    const messageRef = doc(db, 'privateMessages', messageId);
    await deleteDoc(messageRef);
  } catch (error) {
    console.error('Error deleting message:', error);
    throw error;
  }
};

// ** Update user profile information **
export const updateUserProfile = async (userId, updatedData) => {
  try {
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, updatedData);
  } catch (error) {
    console.error('Error updating user profile:', error);
    throw error;
  }
};
