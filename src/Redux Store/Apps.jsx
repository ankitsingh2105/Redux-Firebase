import React, { useEffect, useState } from 'react';
import apis from './api';
import '../newCart/index.css';
import { useSelector, useDispatch } from 'react-redux';
import { addElem, increment } from './counterAction';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { initializeApp } from 'firebase/app';
import firebaseConfig from '../newCart/config';
import { getFirestore, doc, setDoc } from 'firebase/firestore';

const Card = ({ name, price, company, img, id }) => {
    const dispatch = useDispatch();
    const [buttonState, setButtonState] = useState({ isDisabled: false, label: 'Add' });

    const handleAddingToCart = () => {
        dispatch(addElem({ name, price, company, img }));
        dispatch(increment());
        setButtonState({ isDisabled: true, label: 'Added to Cart' });
    };

    return (
        <div className="card1" key={id}>
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
                <button
                    disabled={buttonState.isDisabled}
                    onClick={handleAddingToCart}
                >
                    {buttonState.label}
                </button>
            </p>
        </div>
    );
};

export default function Apps() {
    const array = useSelector((state) => state.counterReducer.array);
    const app = initializeApp(firebaseConfig);
    const auth = getAuth(app);
    const db = getFirestore(app);
    const user = auth.currentUser;

    useEffect(() => {
        // todo: setting the array of objs in the database
        // * this if condition is very important initially the user is not detected
        if (user) {
            const docRef = doc(db, 'reduxObj', user.uid);
            setDoc(docRef, {
                arrayOfObject: array,
            });
        }
        console.table('this is the table  -> ', array);
    }, [array]);

    return (
        <>
        <hr />
            <h1 style={{textDecoration : "underline"}} >Cart</h1>
            <div className="card">
                {apis.map((e) => (
                    <Card {...e} />
                ))}
            </div>
        </>
    );
}
