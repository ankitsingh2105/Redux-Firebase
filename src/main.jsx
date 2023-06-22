import React from 'react';
import Firebase from './newCart/firebase';
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './newCart/Home';
import Login from './newCart/Login';
import { counterReducer, Add } from './Redux Store/counterReducer';
import { createStore, combineReducers } from 'redux';
import { Provider } from 'react-redux'
import Apps from './Redux Store/Apps';
import NewNav from './newCart/NewNav';
import Cart from './Redux Store/Cart';

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
          <Route path="/signin" element={<Firebase />} />
          <Route path="/cart" element={<Cart />} />
        </Routes>
      </Provider>
    </BrowserRouter>
  </React.StrictMode>
);
