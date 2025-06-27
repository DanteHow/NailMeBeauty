import { initializeApp } from "firebase/app"
import { doc, getDoc, getFirestore } from "firebase/firestore"
import { firebaseConfig } from "~/plugins/firebase.client"

const docRef = doc(getFirestore(initializeApp(firebaseConfig)), "bookings", "JCG7vEsXQCk3EdhTkO94")
export const callDatabase = async () => {
    const docSnap = await getDoc(docRef)
    if (docSnap.exists()) {
        console.log("Document Data: ", docSnap.data())
    } else {
        console.log("No such document")
    }
}

