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
import { useSelector } from 'react-redux';

export default function NewNav() {
    const [state, setstate] = useState(false)
    const app = initializeApp(firebaseConfig);
    const auth = getAuth(app);

    let q  = useSelector((state) => state.Add.sum);

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


    return (
        <>
            <nav>
                <ToastContainer position="bottom-left" toastClassName="custom-toast" />
                <ul>
                    <img id="logoImg" src={Logo} alt="" />
                    <Link className='linking' to="/" style={{ color: 'black' }} ><li>Home</li></Link>
                    <Link className='linking' to="/cart"  ><li style={{ color: 'black' }}>Cart <small>{q}</small> </li></Link>
                    {
                        state ?
                            (
                                <>

                                    <Link className='linking' to="/signin" style={{ color: 'black' }}><li>Sign Up</li></Link>

                                    <Link className='linking' to="/login" style={{ color: 'black' }}><li>Log In</li></Link>

                                </>
                            )
                            :
                            (
                                <>
                                    <li className='linking' style={{ color: 'black' }} onClick={handleLogout} >Logout</li>
                                </>
                            )
                    }
                </ul>
            </nav>
        </>
    )
}
