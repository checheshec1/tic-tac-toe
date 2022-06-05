import React, {useContext, useState} from "react";
import Square from "./Square";
import {useNavigate} from "react-router-dom";
import {useAuthState} from "react-firebase-hooks/auth";
import {Context} from "../index";
import {calculateWinner, getRandomIntInclusive, minimax} from "../utils/functions";

const Board = ({complexity}) => {
    const [xIsNext, setXIsNext] = useState(true);
    const navigate = useNavigate();
    const {auth, firestore} = useContext(Context);
    const [user] = useAuthState(auth);
    const [squares, setSquares] = useState(Array(9).fill(null));
    const [disable, setDisable] = useState(false)
    let status, winner = null;

    function handleClick(i) {
        const playerSquares = squares.slice();
        if (calculateWinner(playerSquares) || squares[i]) {
            return;
        }
        playerSquares[i] = xIsNext ? 'X' : 'O';
        setSquares(playerSquares);
        setXIsNext(!xIsNext);
        setDisable(true);
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
        setDisable(false);
    }

    const startHuman = () => {

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
    }

    const startHard = () => {
        const cpuSquares = squares.slice();
        const aiPlayer = 'O';
        const bestSpot = minimax(cpuSquares, aiPlayer);
        cpuSquares[bestSpot.index] = xIsNext ? 'X' : 'O';
        setSquares(cpuSquares);
        setXIsNext(!xIsNext);
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

    winner = calculateWinner(squares);
    if (winner) {
        if(winner === 'X')
            status = 'Победитель: ' + user.displayName;
        else if (winner === 'O')
            status = 'Победитель: БОТ';
        else if (winner === 'draw')
            status = 'НИЧЬЯ!'
    } else {
        status = 'Следующий ход: ' + (xIsNext ? (user.displayName) : 'БОТ');
        if(!xIsNext) {
            setTimeout(cpuPlayer, 1000);
        }
    }

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