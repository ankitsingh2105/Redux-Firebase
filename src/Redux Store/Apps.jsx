import React, { useEffect } from 'react';
import apis from './api';
import '../newCart/index.css';
import { useSelector, useDispatch } from 'react-redux';
import { addElem, increment } from './counterAction';
import { getAuth } from 'firebase/auth';
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
            <br />
            <br />
            <iframe aria-label="goolge map section" title="google map" src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3476.260993227752!2d79.45162837477577!3d29.391920175258626!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39a0a19b0a2abd35%3A0xd41a2dd8bc103ee5!2sNainital%2C%20uttarakhand!5e0!3m2!1sen!2sin!4v1687703072598!5m2!1sen!2sin" width="350" height="350" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>
            <br /><br />
        </>
    );
}