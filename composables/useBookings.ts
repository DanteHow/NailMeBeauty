import type dayjs from "dayjs";
import { addDoc, collection, doc, getDoc, getDocs, query, where } from "firebase/firestore";

let loading = false

export interface RawBooking {
    id: string;
    Name: string;
    Date: any;
    Contact: string;
    Time: string;
    BodyPart: string;
    Requirement?: string
}

export interface TrasnformedBooking {
    id: string;
    name: string;
    date: dayjs.Dayjs
    contact: string;
    time: string;
    bodyPart: string;
    requirement?: string
}

export const useBookings = () => {
    const { $firebase } = useNuxtApp()

    const getAllBookings = async(): Promise<RawBooking[]> => {
        const collectionRef = collection($firebase.firestoreDB, 'bookings')
        const querySnapshot = await getDocs(collectionRef)

        return querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data() as Omit<RawBooking, 'id'>
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
        try {
            const docRef = collection($firebase.firestoreDB, 'bookings')
            const result = await addDoc(docRef, data)
            alert('Booking add with DocID')
            return result.id
        } catch (error) {
            console.error('Error creating booking: ', error)
            throw error
        }
    }

    const refreshBookings = async () => {
        try {
            loading = true
            const querySnapshot = await getDocs(collection($firebase.firestoreDB, 'bookings'))
            const freshBookings = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }))
            console.log(freshBookings)
            return freshBookings
        } catch (error) {
            console.log('Refresh Error: ', error)
            return false
        } finally {
            loading = false
        }
    }

    return {
        getAllBookings,
        getBookingById,
        getBookingByDate,
        fetchSlot,
        createBooking,
        refreshBookings
    }
}

export const transformBooking = (booking: RawBooking): TrasnformedBooking => {
    return {
        id: booking.id,
        name: booking.Name,
        date: booking.Date,
        contact: booking.Contact,
        time: booking.Time,
        bodyPart: booking.BodyPart,
        requirement: booking.Requirement
    }
}
