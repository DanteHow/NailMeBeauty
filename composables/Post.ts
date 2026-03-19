import type { Dayjs } from "dayjs";
import { addDoc, collection, doc, updateDoc, getDocs, deleteDoc, query, Timestamp, where } from "firebase/firestore"

export interface Post {
    id: string;
    Name: string;
    Date: Timestamp;
    Contact: string;
    Time: string;
    BodyPart: string;
    Requirement?: string[];
    Status: string;
}

export const usePosts = () => {
    const { $firebase } = useNuxtApp()
    const getAllPosts = async(): Promise<Post[]> => {
        const collectionRef = collection($firebase.firestoreDB, 'bookings')
        const q = query(collectionRef, where('Status', '==', 'Confirmed'))
        const querySnapshot = await getDocs(q)
        return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Post))
    }

    const writePost = async (post: Omit<Post, 'id'>) => {
        const collectionRef = collection($firebase.firestoreDB, 'bookings')
        const docRef = await addDoc(collectionRef, post)
        return docRef.id
    }

    const getPostsByDate = async (date: Dayjs): Promise<Post[]> => {
        const collectionRef = collection($firebase.firestoreDB, 'bookings')
        const q = query(collectionRef, 
            where('Date', '==', Timestamp.fromDate(date.toDate())),
            where('Status', '==', 'Confirmed')
        )
        const querySnapshot = await getDocs(q)
        return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Post))
    }

    const getPostsByMonth = async (month: number, year: number): Promise<Post[]> => {
        const collectionRef = collection($firebase.firestoreDB, 'bookings')
        const startOfMonth = new Date(year, month - 1, 1)
        const endOfMonth = new Date(year, month, 0)

        const q = query(collectionRef, 
            where('Date', '>=', Timestamp.fromDate(startOfMonth)), 
            where('Date', '<=', Timestamp.fromDate(endOfMonth))
        )
        const querySnapshot = await getDocs(q)
        return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Post))
    }

    const getPendingPosts = async (): Promise<Post[]> => {
        const collectionRef = collection($firebase.firestoreDB, 'bookings')
        const q = query(collectionRef, where('Status', '==', 'Pending'))
        const querySnapshot = await getDocs(q)
        return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Post))
    }

    const UpdatePosts = async (id: string, updatedData: Partial<Post>) => {
        const docRef = doc($firebase.firestoreDB, 'bookings', id)
        await updateDoc(docRef, updatedData)
    }

    const DeletePosts = async (id: string) => {
        const docRef = doc($firebase.firestoreDB, 'bookings', id)
        await deleteDoc(docRef)
    }

    return {
        getAllPosts,
        writePost,
        getPostsByDate,
        getPostsByMonth,
        getPendingPosts,
        UpdatePosts,
        DeletePosts
    }
}
