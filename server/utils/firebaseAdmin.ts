import admin from 'firebase-admin'
import serviceAccount from '../firebase-admin.json.json'

if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount as any)
    })
}

export const adminDB = admin.firestore()