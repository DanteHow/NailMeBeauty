import admin from 'firebase-admin';
import serviceAccount from '../firebase-admin.json'; // this file is your service account

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
  });
}

export const adminDB = admin.firestore();
