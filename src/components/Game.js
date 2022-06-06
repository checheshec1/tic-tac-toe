import React, {useContext, useEffect, useRef, useState} from 'react';
import Board from "./Board";
import {useNavigate} from "react-router-dom";
import {Context} from "../index";
import {useAuthState} from "react-firebase-hooks/auth";
import {Typography} from "@mui/material";
import {useDifficulty, useNewSocket, useOnGameUsers} from "../utils/hooks";

const Game = () => {
    const navigate = useNavigate();
    const {auth, firestore, database} = useContext(Context);
    const [user] = useAuthState(auth);
    const [messages, setMessages] = useState([]);
    const [connected, setConnected] = useState(false);
    const [difficulty] = useDifficulty(database, user);
    const [players] = useOnGameUsers(database, user);

    if(difficulty === 'human') {
        let ws;

        if(ws) {
            ws.onerror = ws.onopen = ws.onclose = null;
            ws.close();
        }

        ws = new WebSocket('ws://localhost:6969');
        ws.onopen = () => {
            console.log("connected");
            const message = {
                event: "connection",
                username: user.displayName,
                id: user.uid,
            }
            ws.send(JSON.stringify(message));
        }
        ws.onmessage = ({data}) => {
            console.log(data);
            setMessages(prevState => [data, ...prevState]);
            console.log(messages);
        }
        ws.onclose = function() {
            ws = null;
        }
    }

    return (
        <div>
            <div>
                <div className={"leftsidebar"}>
                    <Typography className={"about"}>История игры</Typography>
                    <div style={{overflowY: "auto"}}>
                        {messages.map(mess => <div key={mess.id}>{mess.event === 'connection' ?
                            <div>{mess.data}</div>
                            :
                            <div>{mess.username} что-то</div>
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