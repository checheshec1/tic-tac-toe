import React, {useContext, useEffect, useRef, useState} from 'react';
import Board from "./Board";
import {useNavigate} from "react-router-dom";
import {Context} from "../index";
import {useAuthState} from "react-firebase-hooks/auth";
import {Box, Modal, Typography} from "@mui/material";
import {useDifficulty, useOnGameUsers, useRoomId} from "../utils/hooks";
import Loader from "./Loader";
import {io} from "socket.io-client";

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    height: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
    display: 'block'
};

const Game = ({auth, database}) => {
    const navigate = useNavigate();
    //const {auth, database} = useContext(Context);
    const [user] = useAuthState(auth);
    const [difficulty] = useDifficulty(database, user);
    const [roomNumber] = useRoomId(database, user)
    const [players] = useOnGameUsers(database, user);

    const [squares, setSquares] = useState(Array(9).fill(null));
    let [xIsNext, setXIsNext] = useState(true);
    const [disable, setDisable] = useState(false);
    const [flag, setFlag] = useState(false);
    const [board, setBoard] = useState(squares);


    const socket = useRef();
    const [messages, setMessages] = useState([]);
    const responses = [];
    let status = null;
    console.log("RENDERED");

    useEffect(() => {
        if(difficulty === 'human') {
            setDisable(false);

            socket.current = io('ws://localhost:6969', {
                withCredentials: true,
                extraHeaders: {
                    "my-custom-header": "abcd",
                }
            }).connect();

            const message = {
                userId: user.uid,
                displayName: user.displayName,
                room: roomNumber,
                db: database
            }

            socket.current.emit('userConnected', message);

            socket.current.on('connected', data => {
                console.log(data);
            });

            socket.current.on('enterMessage', data => {
                console.log(data.message);
                responses.push(data);
                //setMessages(responses);
                setMessages(responses);
            });

            /*socket.current.on('statusResponse', data => {
                board = data.board;
            });*/


            /*socket.current.on('boardStatus', data => {
                dis = data.disable;
                setDisable(false);
                console.log(data.disable);
                xIsNext = data.x;
            });*/

            socket.current.on('changeSquares', data => {
                setSquares(data.squares);
                console.log(squares);
            })

            const statusMessage = {
                board: squares,
                room: roomNumber,
                x: xIsNext
            };
            socket.current.emit('statusMessage', statusMessage);

            if (!socket.current.connected) {
                socket.current.connect();
            }

            socket.current.on('X', data => {
                setXIsNext(data.x);
            })


            /*return () => {
                socket.current.disconnect();
            };*/
        }
    }, [difficulty, flag]);



    /*useEffect(() => {
        return socket.disconnect();
    })*/

    /*if(difficulty === 'human') {
        socket.current = io('ws://localhost:6969', {
            withCredentials: true,
            extraHeaders: {
                "my-custom-header": "abcd",
            }
        });

        const client = socket.current;

        client.connect();

        const message = {
            userId: user.uid,
            displayName: user.displayName,
            room: roomNumber,
            db: database
        }

        client.emit('userConnected', message);

        client.disconnect();
    }*/


    return (
        <div>
            <div>
                <div className={"leftsidebar"}>
                    <Typography className={"about"}>История игры</Typography>
                    <div style={{overflowY: "auto"}}>
                        {messages.map(message => <ul><li key={message.message}>{message.message}</li></ul>)}
                        {/*responses.map(message => <ul><li key={message}>{message}</li></ul>)*/}
                    </div>
                </div>
                <div className={"sidebar"}>
                    <Typography className={"about"}>Игроки</Typography>
                    <div style={{overflowY: "auto"}}>
                        {players.map(user => <li style={{color: "inherit", alignContent: "center"}} key={user}>{user}</li>)}
                    </div>
                </div>
            </div>
            {players.length < 2 ?
                <>
                    <Modal
                        open={true}
                        aria-labelledby="modal-modal-title"
                        aria-describedby="modal-modal-description"
                    >
                        <Box sx={style}>
                            <Typography id="modal-modal-title" variant="h4" component="h1">Ожидание соперника</Typography>
                            <Loader/>
                        </Box>
                    </Modal>
                </>
                :
                <>
                    {messages.map(message => <Typography id="modal-modal-title" variant="h4" component="h1" align={"center"}>
                        Игрок {message.player} играет {message.x ? 'X' : 'O'}
                    </Typography>)}
                    <Board complexity={difficulty} squares={squares} setSquares={setSquares} setXIsNext={setXIsNext}
                           xIsNext={xIsNext} disabled={disable} setDisable={setDisable} flag={flag} setFlag={setFlag}
                           room={roomNumber}
                    />
                </>
            }
        </div>
    );

};

export default Game;