import React from 'react';
import Firebase from './newCart/firebase';
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './newCart/navbar';
import Home from './newCart/Home';
import Login from './newCart/Login';
import counterReducer from './Redux Store/counterReducer';
import { createStore } from 'redux';
import { Provider } from 'react-redux'
import Apps from './Redux Store/Apps';

const root = createRoot(document.getElementById('root'));
const store = createStore(counterReducer);
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signin" element={<Firebase />} />
        </Routes>
      </BrowserRouter>
      <Apps/>
    </Provider>
  </React.StrictMode>
);
