import React, { useEffect, useRef, useState } from 'react';
import '../newCart/index.css';
import { getAuth, onAuthStateChanged } from 'firebase/auth'
import { initializeApp } from 'firebase/app';
import firebaseConfig from '../newCart/config';
import { getFirestore, doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { useDispatch } from 'react-redux';
import { decrement, replace } from './counterAction';

export default function Cart() {
  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);
  const db = getFirestore(app);
  const [objArray, setobjArray] = useState([]);
  const user = auth.currentUser;
  const cartMSG = useRef(null);
  const dispatch = useDispatch();
  const [quantityMap, setQuantityMap] = useState({});
  const [amount, setamount] = useState(0);
  const [tempAmount, settempAmount] = useState({});

  useEffect(() => {
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        cartMSG.current.innerHTML = "<br/><b>Welcome to the cart</b>";
        const docRef = doc(db, "reduxObj", user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setobjArray(docSnap.data().arrayOfObject);
        }
        let tempArray = docSnap.data().arrayOfObject;
        let tempAmount = 0;
        tempArray.forEach((e) => {
          const { price, quantity } = e;
          tempAmount += price * quantity;
        })
        setamount(tempAmount);
      } else {
        cartMSG.current.innerHTML = "<br/><b>Please login to see cart</b>";
      }
    });
  }, []);

  const getCollection = async (id, string) => {
    const user = auth.currentUser;
    const docRef = doc(db, "reduxObj", user.uid);
    const docSnap = await getDoc(docRef);
    if (user) {
      let objArray = docSnap.data().arrayOfObject;
      const objIndex = objArray.findIndex((e) => e.id === id);
      if (objIndex !== -1) {
        const number = objArray[objIndex].quantity;
        if (string === "add") {
          objArray[objIndex].quantity++;
        } else if (number >= 2) {
          objArray[objIndex].quantity--;
        }

        
        // * shallow copying here, otherwise the result wont reflect on ui- 
        // ! reconciliation
        
        const updatedQuantityMap = { ...quantityMap };
        updatedQuantityMap[id] = objArray[objIndex].quantity;
        setQuantityMap(updatedQuantityMap);

        const updatedArray = objArray.map((obj, index) => {
          if (index === objIndex) {
            return objArray[objIndex];
          }
          return obj;
        });

        await updateDoc(docRef, { arrayOfObject: updatedArray });
        let tempAmount = 0;
        objArray.forEach((e) => {
          const { price, quantity } = e;
          tempAmount += price * quantity;
        })
        console.log("this is inside the function ->", tempAmount)
        setamount(tempAmount);

      }
    }
  }

  const handlequantity = (id, string) => {
    getCollection(id, string);
  }

  useEffect(() => {
    console.log("this is the amount i need -> ", amount);
  }, [amount])

  const handleDeletion = (e , b ,c) => {
    setamount((e)=>{
      return e- b* quantityMap[c];
    })
    console.log(e , b , c);
    dispatch(decrement());
    const newArray = objArray.filter((e1) => {
      return e1.name != e;
    });
    dispatch(replace(newArray));
    setobjArray(newArray);
    const docRef = doc(db, 'reduxObj', user.uid);
    setDoc(docRef, {
      arrayOfObject: newArray,
    });
  }


  return (
    <>
      <br /><br /><br />
      <div ref={cartMSG}>This is the cart!!</div>
      {
        objArray.map((e) => {
          const { price, img, company, name, id ,  } = e;
          const quantity = quantityMap[id] || e.quantity;

          return (
            <React.Fragment key={name}>
              <br />
              <article style={{ padding: "15px 0px" }}>
                <div>
                  <img src={img} alt="" />
                  <div style={{ marginTop: "10px" }} className='info'><b>Name &nbsp;: &nbsp;</b>{name}</div>
                  <div style={{ marginTop: "10px" }} className='info'><b>Price &nbsp;: &nbsp;</b>${price}</div>
                  <div style={{ marginTop: "10px" }} className='info'><b>Company &nbsp;: &nbsp;</b>{company}</div>
                  <div style={{ marginTop: "10px" }} className='info'>
                    <b>Quantity : </b> &nbsp; &nbsp;
                    <button onClick={() => handlequantity(id, "minus")} className="setQuantity">-</button>
                    &nbsp;&nbsp;
                    <div>{quantity}</div>
                    &nbsp;&nbsp;
                    <button onClick={() => handlequantity(id, "add")} className="setQuantity">+</button>
                  </div>
                  <br />
                  <button onClick={() => handleDeletion(name , price , id)}>Delete</button>
                </div>
              </article>
              <br />
            </React.Fragment>
          )
        })
      }
      <br />
      <article>
        <div className="priceSection">
          <h2>Price Section</h2>
          <h3>Total amount ${amount}</h3>
        </div>
      </article>
      <br />

    </>
  )
}
