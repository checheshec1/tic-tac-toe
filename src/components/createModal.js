import React, {useContext, useState} from 'react';
import {Box, FormControl, FormControlLabel, FormLabel, MenuItem, Modal, Radio, RadioGroup, Select, Typography} from "@mui/material";
import {GAME_ROUTE, MAIN_ROUTE, START_ROUTE} from "../utils/consts";
import {useNavigate} from "react-router-dom";
import {Context} from "../index";
import {useAuthState} from "react-firebase-hooks/auth";
import Loader from "./Loader";
import {createGame} from "../utils/functions";
import firebase from "firebase/compat/app";
import Sidebar from "./Sidebar";

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};

const CreateModal = () => {
    const navigate = useNavigate();
    const {auth, firestore} = useContext(Context);
    const [user, loading] = useAuthState(auth);
    const [gameType, setGameType] = useState('bot');
    const [name, setName] = useState("");
    const [difficulty, setDifficulty] = useState("easy");

    if(loading)
        return <Loader/>

    const selectBotHuman = () => {
        return gameType === 'bot';
    }

    const backHandler = () => {
        navigate(MAIN_ROUTE);
    }

    const createHandler = () => {
        createGame(firestore, user, firebase.firestore.FieldValue.serverTimestamp(), gameType, name, difficulty);
        navigate(GAME_ROUTE + user.displayName + name);
    }

    const changeGameTypeHandler = (event) => {
        setGameType(event.target.value);
        if(event.target.value === 'human')
            setDifficulty("human");
        if(event.target.value === 'bot')
            setDifficulty("easy");
    }

    return (
        <div>
            <Sidebar/>
            <Modal
                open={true}
                onClose={() => {
                    navigate(START_ROUTE);
                }}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    <Typography id="modal-modal-title" variant="h6" component="h2">Создание комнаты</Typography>
                    <form className={"mui-form"} id={"auth-form"} name={"authForm"}>
                        <div className={"mui-textfield mui-textfield--float-label"}>
                            <input type={"text"} id={"roomName"} onChange={(e) => setName(e.target.value)} required/>
                            <label>Название комнаты</label>
                        </div>
                        <div className={"mui-textfield mui-textfield--float-label"}>
                            <FormControl>
                                <FormLabel id="demo-controlled-radio-buttons-group">Тип игры</FormLabel>
                                <RadioGroup
                                    aria-labelledby="demo-controlled-radio-buttons-group"
                                    name="controlled-radio-buttons-group"
                                    value={gameType}
                                    onChange={changeGameTypeHandler}
                                >
                                    <FormControlLabel value="bot" control={<Radio />} label="Игра с ботом" />
                                    <FormControlLabel value="human" control={<Radio />} label="Игра с человеком" />
                                </RadioGroup>
                            </FormControl>
                            {selectBotHuman() ?
                                <>
                                    <FormControl fullWidth required={true}>
                                        <FormLabel id="demo-controlled-radio-buttons-group">Выберите уровень сложности</FormLabel>
                                        <Select
                                            labelId="demo-simple-select-label"
                                            id="demo-simple-select"
                                            value={difficulty}
                                            label="Age"
                                            onChange={(event) => setDifficulty(event.target.value)}
                                            sx={{border: "1px solid #000", boxShadow: 24,}}
                                        >
                                            <MenuItem value={"easy"} >Легко</MenuItem>
                                            <MenuItem value={"hard"}>Сложно</MenuItem>
                                        </Select>
                                    </FormControl>
                                </>
                                : null}
                        </div>
                        <button type={"submit"} className={"mui-btn mui-btn--raised mui-btn--primary"} onClick={createHandler}>Создать</button>
                        <button type={"submit"} className={"mui-btn mui-btn--raised mui-btn--primary"} onClick={backHandler}>Назад</button>
                    </form>
                </Box>
            </Modal>
        </div>
    );
};

export default CreateModal;