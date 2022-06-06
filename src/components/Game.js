import React, {useContext, useEffect, useRef, useState} from 'react';
import Board from "./Board";
import {useNavigate} from "react-router-dom";
import {Context} from "../index";
import {useAuthState} from "react-firebase-hooks/auth";
import {Typography} from "@mui/material";
import {io} from "socket.io-client";
import {useDifficultyAndPlayersState} from "../utils/hooks";

const Game = () => {
    const navigate = useNavigate();
    const {auth, firestore} = useContext(Context);
    const [user] = useAuthState(auth);
    const [messages, setMessages] = useState([]);
    const [connected, setConnected] = useState(false);
    const [difficulty, players] = useDifficultyAndPlayersState(firestore, user);
    //const socket = useRef();
    //socket.current = new WebSocket('ws://localhost:5000');

    useEffect(() => {
        if(difficulty === "human") {
            const socket = new WebSocket('ws://localhost:5000');

            socket.onopen = () => {
                const message = {
                    event: "connection",
                    username: user.displayName,
                    id: user.uid,
                }
                socket.current.send(JSON.stringify(message));
            }

            socket.onmessage = (event) => {
                const message = JSON.parse(event.data);
                setMessages([message]);
                console.log({messages});
            }

            socket.onclose = () => {
                console.log("Socket закрыт");
            }

            socket.onerror = () => {
                console.log("Socket произошла ошибка");
            }
        }
    }, []);

    return (
        <div>
            <div>
                <div className={"leftsidebar"}>
                    <Typography className={"about"}>История игры</Typography>
                    <div style={{overflowY: "auto"}}>
                        {messages.map(mess => <div key={mess.id}>{mess.event === 'connection' ?
                            <div>{mess.username} подключился к игре</div>
                            :
                            <div>{mess.username} xnj-nj</div>
                        }
                        </div>)}
                    </div>
                </div>
                <div className={"sidebar"}>
                    <Typography className={"about"}>Игроки</Typography>
                    <div style={{overflowY: "auto"}}>
                        {players.map(user => <li style={{color: "inherit", alignContent: "center"}} key={user}>{user}</li>)}
                    </div>
                </div>

            </div>
            <Board complexity={difficulty}/>
        </div>
    );
};

export default Game;