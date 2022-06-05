import React, {useContext, useState} from 'react';
import Board from "./Board";
import {useNavigate} from "react-router-dom";
import {Context} from "../index";
import {useAuthState} from "react-firebase-hooks/auth";

const Game = () => {
    const navigate = useNavigate();
    const {auth, firestore} = useContext(Context);
    const [user] = useAuthState(auth);
    const [difficulty, setDifficulty] = useState();

    const getDifficulty = async () => {
        await firestore.collection("lobbies").where("players", "array-contains", user.displayName)
            .get()
            .then((querySnapshot) => {
                querySnapshot.forEach((doc) => {
                    setDifficulty(doc.data().difficulty);
                })
            }).catch((e) => {
            console.log("Error getting document: ", e);
        })
    }

    const dif = getDifficulty();

    return (
        <div>
            <Board complexity={difficulty}/>
        </div>
    );
};

export default Game;