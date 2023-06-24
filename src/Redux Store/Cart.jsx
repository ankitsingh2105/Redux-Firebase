import React, { useEffect, useRef, useState } from 'react';
import '../newCart/index.css';
import { getAuth, onAuthStateChanged } from 'firebase/auth'
import { initializeApp } from 'firebase/app';
import firebaseConfig from '../newCart/config';
import { getFirestore, doc, getDoc, setDoc } from 'firebase/firestore';
import { useDispatch, useSelector } from 'react-redux';
import { decrement, replace } from './counterAction';
export default function Cart() {

  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);
  const db = getFirestore(app);
  const [objArray, setobjArray] = useState([]);
  const user = auth.currentUser;
  const cartMSG = useRef(null);
  const dispatch = useDispatch();


  useEffect(() => {
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        cartMSG.current.innerHTML = "<br/><b>Welcome to the cart</b>";
        const docRef = doc(db, "reduxObj", user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setobjArray(docSnap.data().arrayOfObject);
        } else {
          console.log("sorry!!");
        }
      } else {
        cartMSG.current.innerHTML = "<br/><b>Please login to see cart</b>";
      }
    });
  }, []);


  useEffect(() => {
    console.log("this siobj-> ", objArray)
  }, [objArray])


  const handleDeletion = (e) => {
    dispatch(decrement());
    console.log("this is 0> ", e);
    const newArray = objArray.filter((e1) => {
      return e1.name != e;
    });
    dispatch(replace(newArray));
    setobjArray(newArray);
    const docRef = doc(db, 'reduxObj', user.uid);
    setDoc(docRef, {
      arrayOfObject: newArray,
    });
    console.table("this is teh table+++  -> ", newArray);
  }

  const array = useSelector((state) => state.counterReducer.array);

  useEffect(() => {
    console.log("array is -> ", array);
  }, [array])

  return (
    <>
      <br />
      <br />
      <br />
      <div ref={cartMSG} >This is the cart!!</div>
      {
        objArray.map((e) => {
          const { price, img, company, name, quantity } = e;
          return (
            <React.Fragment key={name}>
              <br />
              <article style={{ padding: "15px 0px" }} >
                <div>
                  <img src={img} alt="" />
                  <div style={{ marginTop: "10px" }} className='info'><b>Name &nbsp;: &nbsp;</b>{name}</div>

                  <div style={{ marginTop: "10px" }} className='info'><b>Price &nbsp;: &nbsp;</b>${price}</div>

                  <div style={{ marginTop: "10px" }} className='info'><b>Company &nbsp;: &nbsp;</b>{company}</div>

                  {/* <div style={{ marginTop: "10px" }} className='info'><b>Quantity : </b> &nbsp; &nbsp; <button className="setQuantity">-</button> &nbsp;&nbsp; {quantity} &nbsp;&nbsp; <button className="setQuantity">+</button></div> */}

                  <br />
                  <button onClick={() => handleDeletion(name)} >Delete</button>
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
