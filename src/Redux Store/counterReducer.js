import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { initializeApp } from 'firebase/app';
import firebaseConfig from '../newCart/config';
import { getFirestore, doc, getDoc } from 'firebase/firestore';

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);


async function getInfo() {
    try {
        let returnArray = ["something went wrong bitch"];
        const user = await new Promise((resolve, reject) => {
            const unsubscribe = onAuthStateChanged(auth, (user) => {
                unsubscribe();
                resolve(user);
            }, reject);
        });

        if (user) {
            console.log('this is the user -1-----. ', user);
            const docRef = doc(db, 'reduxObj', user.uid);
            const docSnap = await getDoc(docRef);
            console.log("next lvl-> ", docSnap);
            if (docSnap.exists()) {
                returnArray = docSnap.data().arrayOfObject;
                console.log('inside the redux cart in counter===-> ', docSnap.data().arrayOfObject, "and -> ", returnArray);
                return returnArray;
            } else {
                console.log("op");
                return [];
            }
        } else {
            console.log('this is the user -2. ', user);
            console.log('empty cart');
            return [];
        }
    } catch (error) {
        console.error("An error occurred:", error);
        return [];
    }
}

const initialState = {
    array: await getInfo()
};
console.log("bsdk -> ", await getInfo());



const counterReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'Array':
            return {
                ...state,
                array: [...state.array, action.payload],
            };
        default:
            return state;
    }
};

export default counterReducer;
