import React, { useEffect, useState } from 'react';
import apis from './api';
import '../newCart/index.css';
import { useSelector, useDispatch } from 'react-redux';
import { addElem, increment } from './counterAction';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { initializeApp } from 'firebase/app';
import firebaseConfig from '../newCart/config';
import { getFirestore, doc, setDoc, getDoc } from 'firebase/firestore';
import { toast } from 'react-toastify';
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const Card = ({ name, price, company, img, quantity, id }) => {
    const dispatch = useDispatch();

    const handleAddingToCart = async (id) => {
        const user = auth.currentUser;
        if (user) {
            const docRef = doc(db, "reduxObj", user.uid);
            const docSnap = await getDoc(docRef);
            let objArray = docSnap.data().arrayOfObject;
            const exists = objArray.filter((e) => {
                return e.id === id;
            })
            if (exists.length === 0) {
                dispatch(addElem({ name, price, company, img, quantity, id }));
                dispatch(increment());
            }
            else {
                toast("Already added to cart", { autoClose: 500 });
            }
        }
        else {
            toast("Please login to add items", { autoClose: 500 });
        }
    };

    return (
        <div className="card1" key={id}>

            <br />
            <img src={img} alt="" />
            <div className="name info">
                <b>Name</b> : {name}
            </div>
            <div className="name info">
                <b>Company</b> : {company}
            </div>
            <div className="name info">
                <b>Price </b> : ${price}
            </div>
            <div>
                <button onClick={() => handleAddingToCart(id)}> Add to Cart </button>
            </div>
            <br />

        </div>
    );
};

export default function Apps() {
    const array = useSelector((state) => state.counterReducer.array);
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
    }, [array]);

    return (
        <>
            <hr />
            <h1 style={{ textDecoration: "underline" }} >Cart</h1>
            <div className="card">
                {apis.map((e) => (
                    <Card key={e.id} {...e} />
                ))}
            </div>
        </>
    );
}
