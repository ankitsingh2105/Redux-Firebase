import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { initializeApp } from 'firebase/app';
import firebaseConfig from '../newCart/config';
import { getFirestore, doc, getDoc } from 'firebase/firestore';

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

async function getInfo() {
  try {
    const user = await new Promise((resolve, reject) => {
      const unsubscribe = onAuthStateChanged(auth, (user) => {
        unsubscribe();
        resolve(user);
      }, reject);
    });

    if (user) {
      const docRef = doc(db, 'reduxObj', user.uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        let returnArray = docSnap.data().arrayOfObject;
        return returnArray;
      } else {
        return [];
      }
    } else {
      return [];
    }
  } catch (error) {
    return [];
  }
}

async function initializeState() {
  const info = await getInfo();
  const initialState = {
    array: info,
    replaceArray: []
  };
  const addingState = {
    sum: info.length
  };

  return {
    initialState,
    addingState,
  };
}

const { initialState, addingState } = await initializeState();

const counterReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'Array':
      return {
        ...state,
        array: [...state.array, action.payload],
        replaceArray: [...state.replaceArray, action.payload]
      };
    case 'Arrayreplace':
      return {
        ...state,
        array: action.payload,
        replaceArray: action.payload
      };
    default:
      return state;
  }
};


const Add = (state = addingState, action) => {
  switch (action.type) {
    case 'Adding':
      return {
        sum: state.sum + 1
      };
    case 'Substract':
      return {
        sum: state.sum - 1
      };
    default:
      return state;
  }
};

export { counterReducer, Add };