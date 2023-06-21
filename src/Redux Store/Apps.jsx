import React, { useEffect } from 'react';
import apis from './api';
import '../newCart/index.css';
import { useSelector, useDispatch } from 'react-redux';
import  addElem  from './counterAction';

export default function Apps() {
    const array = useSelector((state) => state.array);
    const dispatch = useDispatch();

    const handleAddingToCart = (a, b, c) => {
        dispatch(addElem({ a, b, c }));
        console.log('this is being added and obj->  ', {a , b , c});
        console.log("added shit");
    };

    useEffect(() => {
        console.table(array);
    },[array]);

    return (
        <>
            <br />
            <h2>Cart</h2>
            <div className="card">
                {apis.map((e) => {
                    const { name, city, standard, img } = e;
                    return (
                        <React.Fragment key={name}>
                            <div className="card1">
                                <br />
                                <img src={img} alt="" />
                                <p className="name info">
                                    <b>Name</b> : {name}
                                </p>
                                <p className="name info">
                                    <b>City</b> : {city}
                                </p>
                                <p className="name info">
                                    <b>Class</b> : {standard}
                                </p>
                                <p>
                                    <button onClick={() => handleAddingToCart(name, city, standard)}>Add</button>
                                </p>
                            </div>
                        </React.Fragment>
                    );
                })}
            </div>
        </>
    );
}
