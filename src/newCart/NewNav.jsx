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

    let q = useSelector((state) => state.Add.sum);

    const handleLogout = async (e) => {
        await signOut(auth);
        setstate(false)
        toast.success("Logging Out", { autoClose: 1500 });
        setTimeout(() => {
            window.location.reload();
        }, 1500);
    }

    useEffect(() => {
        // Todo : always wrap onAuthStateChanged in useEffect, otherwise it can cause infinite re-renders
        onAuthStateChanged(auth, (user) => {
            if (user) {

            } else {
                setstate(true)
            }
        });

    }, [auth])


    return (
        <>
            <nav className="Navabar" >
                <ToastContainer position="bottom-left" toastClassName="custom-toast" />
                <ul>
                    <li><img id="logoImg" src={Logo} alt="" /></li>
                    <li><Link className='linking' to="/" >Home</Link></li>
                    <li><Link className='linking' to="/cart">Cart <small>{q}</small></Link></li>
                    {
                        state ?
                            (
                                <>

                                    <li><Link className='linking' to="/signin" >SignUp</Link></li>

                                    <li><Link className='linking' to="/login">LogIn</Link></li>

                                </>
                            )
                            :
                            (
                                <>
                                    <li className='linking' onClick={handleLogout} >Logout</li>
                                </>
                            )
                    }
                </ul>
            </nav>
        </>
    )
}
