import React, { useState } from 'react'
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
import { useSelector, useDispatch } from 'react-redux';

export default function Navbar() {
  const [state, setstate] = useState(false)
  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);

  const array = useSelector((state) => state.array);
  const dispatch = useDispatch();

  const handleLogout = async (e) => {
    await signOut(auth);
    toast.success("Signed Out", { autoClose: 1500 });
    setTimeout(() => {
      window.location.reload();
    }, 1800);
  }


  onAuthStateChanged(auth, (user) => {
    if (user) {
      setstate(false)
    } else {
      setstate(true)
    }
  });

  // * handelling cart data -> 

  const handleCart = async () => {

    // const user = auth.currentUser;
    console.log("moving to the cart baby");
    // console.log('current user is 1 -> ', user);
    // if (user) {
      // console.log('current user is 2 -> ', user);
      // const docRef = doc(db, 'objUser', user.uid);
      // await setDoc(docRef, {
      //   arrayOfObject: array
      // })
    // }

  }

  return (
    <>
      <nav>
        <ToastContainer position="bottom-left" toastClassName="custom-toast" />
        <ul>
          <img id="logoImg" src={Logo} alt="" />
          <Link to="/" style={{ color: 'black' }} ><li>Home</li></Link>
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
                  <li style={{ color: 'black' }} onClick={handleCart} >Cart</li>
                </>
              )
          }
        </ul>
      </nav>
    </>
  )
}