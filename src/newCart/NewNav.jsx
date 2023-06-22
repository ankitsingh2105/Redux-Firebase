import React, { useEffect, useState } from 'react'
import "./index.css"
import "./custom-toast.css"
import { getAuth, onAuthStateChanged } from 'firebase/auth'
import { initializeApp } from 'firebase/app';
import { signOut } from 'firebase/auth';
import { Link } from 'react-router-dom'
import firebaseConfig from "./config"
import { ToastContainer, toast } from 'react-toastify';
import Logo from "./logo.png";
import { getFirestore, doc, setDoc } from 'firebase/firestore';
import { useSelector } from 'react-redux';

export default function NewNav() {
    const [state, setstate] = useState(false)
    const app = initializeApp(firebaseConfig);
    const auth = getAuth(app);
    const db = getFirestore(app);

    const array = useSelector((state) => state.array);


    const handleLogout = async (e) => {
        await signOut(auth);
        toast.success("Signed Out", { autoClose: 1500 });
        setTimeout(() => {
            window.location.reload();
        }, 1800);
    }

    useEffect(() => {
        // Todo : always wrap onAuthStateChanged in useEffect, otherwise it can cause infinite re-renders
        onAuthStateChanged(auth, (user) => {
            if (user) {
                setstate(false)
            } else {
                setstate(true)
            }
        });

    }, [auth])


    // * handelling cart data -> 

    // const handleCart = async () => {
    //     console.log("moving to the cart baby");
    //     const user = auth.currentUser;
    //     console.log('current user is 1 -> ', user.uid);
    //     console.log('current user is 2 -> ', user);
    //     const docRef = doc(db, 'reduxObj', user.uid);
    //     await setDoc(docRef, {
    //         arrayOfObject: array
    //     });
    // }


    return (
        <>
            <nav>
                <ToastContainer position="bottom-left" toastClassName="custom-toast" />
                <ul>
                    <img id="logoImg" src={Logo} alt="" />
                    <Link to="/" style={{ color: 'black' }} ><li>Home</li></Link>
                    <Link to="/cart"  ><li style={{ color: 'black' }}>Cart</li></Link>
                    {
                        state ?
                            (
                                <>

                                    <Link to="/signin" style={{ color: 'black' }}><li>Sign Up</li></Link>

                                    <Link to="/login" style={{ color: 'black' }}><li>Log In</li></Link>

                                </>
                            )
                            :
                            (
                                <>
                                    <li style={{ color: 'black' }} onClick={handleLogout} >Logout</li>
                                </>
                            )
                    }
                </ul>
            </nav>
        </>
    )
}
