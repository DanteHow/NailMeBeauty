import { addDoc, collection, doc, getDoc, getDocs } from "firebase/firestore";

export const useBookings = () => {
    const { $firebase } = useNuxtApp()

    const getAllBookings = async() => {
        const collectionRef = collection($firebase.firestoreDB, 'bookings')
        const querySnapshot = await getDocs(collectionRef)

        return querySnapshot.docs.map(doc => ({
            id: doc.id,
            Name: doc.data().Name,
            Date: doc.data().Date,
            Contact: doc.data().Contact,
            Time: doc.data().Time,
            BodyParts: doc.data().BodyParts,
            Requirement: doc.data().Requirement
        }))
    }

    //Get Booking Data
    const getBookingById = async (id: string) => {
        const docRef = doc($firebase.firestoreDB, 'bookings', id)
        const docSnapShot = await getDoc(docRef)
        return docSnapShot.exists() ? { id: docSnapShot.id, } : null
    }

    //Create Booking and upload to database
    const createBooking = async (data: Record<string, any>) => {
        const docRef = collection($firebase.firestoreDB, 'bookings')
        const result = await addDoc(docRef, data)
        return result.id
    }
    
    return {
        getAllBookings,
        getBookingById,
        createBooking
    }
}
