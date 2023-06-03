import { dotenv } from './dependencies.js';
import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs, addDoc, onSnapshot } from "firebase/firestore";

dotenv.config();

const firebaseConfig = {
    apiKey: process.env.API_KEY,
    authDomain: process.env.AUTH_DOMAIN,
    projectId: process.env.PROJECT_ID,
    storageBucket: process.env.STORAGE_BUCKET,
    messagingSenderId: process.env.MESSAGING_SENDER_ID,
    appId: process.env.APP_ID,
};

const firebaseApp = initializeApp(firebaseConfig);

class FireStoreDB {
    static instance
    static collections = {}

    constructor(firebaseAppInstance) {

        if (FireStoreDB.instance) {
            return FireStoreDB.instance;
        }

        this.database = getFirestore(firebaseAppInstance);
        FireStoreDB.collections = {
            'Leads': collection(this.database, 'Leads'),
            'Interactions': collection(this.database, 'Interactions')
        };

        FireStoreDB.instance = this;
    }

    getCollection = async (collectionName) => {
        const snapshot = await getDocs(collectionName);
        const list = snapshot.docs.map(doc => doc.data());
        return list;
    }

    addNewDocumentTo = async (newDocument, collection) => {
        try {
            const document = newDocument
            const docRef = await addDoc(FireStoreDB.collections[collection], document);
            console.log(docRef.id);
        } catch (error) {
            console.log(error);
        }
    }

    updateRealTime = (collection, doSomething) => {
        const c = FireStoreDB.collections[collection];
        onSnapshot(c, doSomething);
    }
}

const fireStoreDB = new FireStoreDB(firebaseApp);

export default fireStoreDB;