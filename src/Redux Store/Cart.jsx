import React, { useEffect, useRef, useState } from 'react';
import '../newCart/index.css';
import { getAuth, onAuthStateChanged } from 'firebase/auth'
import { initializeApp } from 'firebase/app';
import firebaseConfig from '../newCart/config';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import { useSelector } from 'react-redux';
export default function Cart() {

  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);
  const db = getFirestore(app);
  const [objArray, setobjArray] = useState([]);

  const cartMSG = useRef(null);

  const array = useSelector((state) => state.array);
  useEffect(()=>{
    console.log("initial renderis -> " , array);
  },[])


  useEffect(() => {
    const user = auth.currentUser;
    console.log("this is the user -. ", user);
    onAuthStateChanged(auth, async (user) => {
      console.log("insode insode ", user)
      if (user) {
        cartMSG.current.innerHTML = "<br/><b>Welcome to the cart</b>";
        console.log("user os veririded");
        const docRef = doc(db, "reduxObj", user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          console.log("doc is here -> ", docSnap.data().arrayOfObject);
          setobjArray(docSnap.data().arrayOfObject);
        }
        else {
          console.log("shit man");
        }
        console.log("insode the eefct in cart this is the state -> ", objArray)
      } 
      else {
        cartMSG.current.innerHTML = "<br/><b>Please login to see cart</b>";
        console.log("No such document!");
      }
    });
  }, [])

  return (
    <>
      <div ref={cartMSG} >This is the cart!!</div>
      {
        objArray.map((e) => {
          const { city, img, name, standard } = e;
          console.log("a and b and c is here -> ", city);
          return (
            <React.Fragment key={name}>
              <br />
              <article style={{padding:"15px 0px"}} >
                <div>
                  <img src={img} alt="" />
                  <div style={{marginTop : "10px"}} className='info'><b>City &nbsp;: &nbsp;</b>{city}</div>
                  <div style={{marginTop : "10px"}} className='info'><b>Name &nbsp;: &nbsp;</b>{name}</div>
                  <div style={{marginTop : "10px"}} className='info'><b>Standard &nbsp;: &nbsp;</b>{standard}</div>
                  <br />
                  <button>Delete</button>
                </div>
              </article>
              <br />
            </React.Fragment>
          )
        })
      }
    </>
  )
}
