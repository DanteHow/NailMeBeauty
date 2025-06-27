import type dayjs from "dayjs";
import { addDoc, collection, doc, getDoc, getDocs, query, where } from "firebase/firestore";

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

    const getBookingByDate = async (date: dayjs.Dayjs) => {
        const q = query(collection($firebase.firestoreDB, 'bookings'), where("Date", "==", date.format('YYYY-MM-DD')))
        const querySnapshot = await getDocs(q)
        const fetchdata = querySnapshot.docs.map(doc => doc.data())
        return fetchdata
    }

    const fetchSlot = async () => {
        const docRef = collection($firebase.firestoreDB, 'bookings')
        const snapShot = await getDocs(docRef)
        return snapShot.docs.map(doc => doc.data().Date)
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
        getBookingByDate,
        fetchSlot,
        createBooking
    }
}
