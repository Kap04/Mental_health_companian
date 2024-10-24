import { db } from './firebase';
import { collection, getDocs, doc, setDoc, writeBatch } from 'firebase/firestore';

async function migrateData() {
  const userSessionsRef = collection(db, 'userSessions');
  const userSessionsSnapshot = await getDocs(userSessionsRef);

  const batch = writeBatch(db);

  for (const userDoc of userSessionsSnapshot.docs) {
    const userId = userDoc.id;
    const sessionsRef = collection(userDoc.ref, 'sessions');
    const sessionsSnapshot = await getDocs(sessionsRef);

    for (const sessionDoc of sessionsSnapshot.docs) {
      const sessionId = sessionDoc.id;
      const newSessionRef = doc(db, 'chatSessions', sessionId);
      
      batch.set(newSessionRef, {
        userId: userId,
        timestamp: sessionDoc.data().timestamp
      });

      const messagesRef = collection(sessionDoc.ref, 'messages');
      const messagesSnapshot = await getDocs(messagesRef);

      for (const messageDoc of messagesSnapshot.docs) {
        const newMessageRef = doc(newSessionRef, 'messages', messageDoc.id);
        batch.set(newMessageRef, messageDoc.data());
      }
    }
  }

  await batch.commit();
  console.log('Migration completed');
}

migrateData().catch(console.error);