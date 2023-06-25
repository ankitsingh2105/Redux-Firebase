import React from 'react';

import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { counterReducer, Add } from './Redux Store/counterReducer';
import { createStore, combineReducers } from 'redux';

import { Provider } from 'react-redux'
import Apps from './Redux Store/Apps';
import NewNav from './newCart/NewNav';
import Cart from './Redux Store/Cart';
import Signup from './newCart/Signup';
import Home from './newCart/Home';
import Login from './newCart/Login';
const root = createRoot(document.getElementById('root'));
const rootReducer = combineReducers({
  counterReducer,
  Add,
});
const store = createStore(rootReducer);
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Provider store={store}>
        <NewNav />
        <Routes>
          <Route path="/" element={<><Home /> <Apps /></>} />
          <Route path="/login" element={<Login />} />
          <Route path="/signin" element={<Signup />} />
          <Route path="/cart" element={<Cart />} />
        </Routes>
      </Provider>
    </BrowserRouter>
  </React.StrictMode>
);
