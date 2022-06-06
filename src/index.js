import React, {createContext} from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import firebase from "firebase/compat/app";
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import {getDatabase} from 'firebase/database'

const app = firebase.initializeApp({
    apiKey: "AIzaSyDvoKrvrQI2C-joh7TDUHRuMVoOwa6b79M",
    authDomain: "tic-tac-toe-kp.firebaseapp.com",
    databaseURL: "https://tic-tac-toe-kp-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "tic-tac-toe-kp",
    storageBucket: "tic-tac-toe-kp.appspot.com",
    messagingSenderId: "847521106804",
    appId: "1:847521106804:web:7add117fde9d79d24c7a21"
});

export const Context = createContext(null);
const auth = app.auth();
const firestore = app.firestore();
const database = getDatabase(app);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <Context.Provider value={{firebase,  auth, firestore, database}}>
        <React.StrictMode>
            <App />
        </React.StrictMode>
    </Context.Provider>
);
