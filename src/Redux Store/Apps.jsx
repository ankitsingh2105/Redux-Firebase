import React, { useEffect , useState } from 'react';
import apis from './api';
import '../newCart/index.css';
import { useSelector, useDispatch } from 'react-redux';
import { addElem, increment } from './counterAction';
import { getAuth, onAuthStateChanged } from 'firebase/auth'
import { initializeApp } from 'firebase/app';
import firebaseConfig from '../newCart/config';
import { getDoc, getFirestore, doc, setDoc } from 'firebase/firestore';

export default function Apps() {
    const array = useSelector((state) => state.counterReducer.array);
    const dispatch = useDispatch();
    const app = initializeApp(firebaseConfig);
    const auth = getAuth(app);
    const db = getFirestore(app);
    const user = auth.currentUser;

    const [isDisabled, setIsDisabled] = useState(false);

    const handleAddingToCart = async (name, price, company, img) => {
        dispatch(addElem({ name, price, company, img }));
        dispatch(increment());
        setIsDisabled(true);
    }

    function getInfo() {
        let returnArray = ["something went wrong"];
        onAuthStateChanged(auth, async (user) => {
            if (user) {
                console.log('this is the user -1. ', user);
                const docRef = doc(db, 'reduxObj', user.uid);
                const docSnap = await getDoc(docRef);
                console.log("next lvl-> ", docSnap);
                if (docSnap.exists()) {
                    console.log('inside the redux cart -> ', docSnap.data().arrayOfObject);
                    returnArray = docSnap.data().arrayOfObject;
                }
                else {
                    console.log("nothing exists");
                    returnArray = [{ name: "Sadhu Singh" }];
                }
            } else {
                console.log('this is the user -2. ', user);
                console.log('empty cart');
                returnArray = ["we are offline"];
            }
        })
        return returnArray;
    }

    useEffect(() => {
        // todo : setting the array of objs in the database
        // * this if condition is very imp initiallt the user is not deteched 
        if (user) {
            const docRef = doc(db, 'reduxObj', user.uid);
            setDoc(docRef, {
                arrayOfObject: array,
            });
        }
        console.table("this is teh table  -> ", array);
    }, [array]);

    return (
        <>
            <br />
            <h2>Cart</h2>
            <div className="card">
                {apis.map((e) => {
                    const { name, price, company, img, id } = e;
                    return (
                        <div className="card1" key={id} >
                            <br />
                            <img src={img} alt="" />
                            <p className="name info">
                                <b>Name</b> : {name}
                            </p>
                            <p className="name info">
                                <b>Company</b> : {company}
                            </p>
                            <p className="name info">
                                <b>Price </b> : ${price}
                            </p>
                            <p>
                                <button disabled={isDisabled} onClick={() => handleAddingToCart(name, price, company, img)}>Add</button>
                            </p>
                        </div>
                    );
                })}
            </div>
        </>
    );
}
