import React, {useContext, useEffect, useState} from "react";
import Square from "./Square";
import {useNavigate} from "react-router-dom";
import {useAuthState} from "react-firebase-hooks/auth";
import {Context} from "../index";
import {
    calculateWinner,
    getRandomIntInclusive,
    minimax,
    removeActiveRoom,
    saveGameInFirestore
} from "../utils/functions";
import {Box, Modal, Typography} from "@mui/material";
import Loader from "./Loader";

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

const Board = ({complexity, squares, xIsNext, setSquares, setXIsNext, disabled, flag, setFlag, room}) => {
    //const [xIsNext, setXIsNext] = useState(true);
    //const [squares, setSquares] = useState(Array(9).fill(null));
    const navigate = useNavigate();
    const {auth, firestore, database} = useContext(Context);
    const [user] = useAuthState(auth);
    const [disable, setDisable] = useState(disabled)
    let status, winner = null;

    /*useEffect(() => {

    }, [squares])*/

    function handleClick(i) {
        if(complexity !== 'human') {
            const playerSquares = squares.slice();
            if (calculateWinner(playerSquares) || squares[i]) {
                return;
            }
            playerSquares[i] = xIsNext ? 'X' : 'O';
            setSquares(playerSquares);
            setXIsNext(!xIsNext);
            setDisable(true);
        } else {
            const playerSquares = squares.slice();
            if (calculateWinner(playerSquares) || squares[i]) {
                return;
            }
            playerSquares[i] = xIsNext ? user.displayName : user.displayName;
            setSquares(playerSquares);
            setFlag(!flag);
            //setDisable(true);
        }
    }

    const cpuPlayer = () => {
        if(complexity === 'easy') {
            startEasy();
        } else if(complexity === 'hard') {
            startHard();
        }
        else if(complexity === 'human') {
            startHuman();
        }
    }

    const startHuman = () => {
        console.log(squares);
    }

    const startEasy = () => {
        let i = getRandomIntInclusive();
        const cpuSquares = squares.slice();
        if (calculateWinner(cpuSquares)) {
            return;
        }
        while(cpuSquares[i]) {
            i = getRandomIntInclusive();
        }
        cpuSquares[i] = xIsNext ? 'X' : 'O';
        setSquares(cpuSquares);
        setXIsNext(!xIsNext);
        setDisable(false);
    }

    const startHard = () => {
        const cpuSquares = squares.slice();
        const aiPlayer = 'O';
        const bestSpot = minimax(cpuSquares, aiPlayer);
        cpuSquares[bestSpot.index] = xIsNext ? 'X' : 'O';
        setSquares(cpuSquares);
        setXIsNext(!xIsNext);
        setDisable(false);
    }

    function renderSquare(i) {
        return (
            <Square
                value={squares[i]}
                onClick={() => handleClick(i)}
                disable={disable}
            />
        );
    }

    const backHandler = () => {
        removeActiveRoom(database, room);
        navigate('/lobby');
    }

    //useEffect(() => {
        winner = calculateWinner(squares);
        if (winner) {
            if(winner === 'X') {
                status = 'Победитель: ' + 'X';
                saveGameInFirestore(firestore, database, room, 'X');
            }
            else if (winner === 'O') {
                status = 'Победитель: O';
                saveGameInFirestore(firestore, database, room, 'O');
            }
            else if (winner === 'draw')
            {
                status = 'НИЧЬЯ!'
                saveGameInFirestore(firestore, database, room, 'Draw');
            }

            return (
                <Modal
                    open={true}
                    aria-labelledby="modal-modal-title"
                    aria-describedby="modal-modal-description"
                >
                    <Box sx={style}>
                        <Typography id="modal-modal-title" variant="h4" component="h1">{status}</Typography>
                        <button type={"submit"} className={"mui-btn mui-btn--raised mui-btn--primary"} onClick={backHandler}>Ок</button>
                    </Box>
                </Modal>
            )
        } else {
            status = 'Следующий ход: ' + (xIsNext ? (user.displayName) : 'БОТ');
            if(complexity !== 'human') {
                if(!xIsNext) {
                    setTimeout(cpuPlayer, 1000);
                }
            }
        }
    //}, [squares])

    return (
        <div className={"board"}>
            <div className="status">{status}</div>
            <div className="board-row">
                {renderSquare(0)}
                {renderSquare(1)}
                {renderSquare(2)}
            </div>
            <div className="board-row">
                {renderSquare(3)}
                {renderSquare(4)}
                {renderSquare(5)}
            </div>
            <div className="board-row">
                {renderSquare(6)}
                {renderSquare(7)}
                {renderSquare(8)}
            </div>
        </div>
    );
}

export default Board;