import React, {useState} from 'react';
import Sidebar from "./Sidebar";
import {useContext} from "react";
import {Context} from "../index";
import {useAuthState} from "react-firebase-hooks/auth";
import Loader from "./Loader";
import {Button} from "@mui/material";
import {useNavigate} from "react-router-dom";
import {CREATE_ROOM, SELECT_ROUTE} from "../utils/consts";

const MainScreen = () => {
    const navigate = useNavigate();
    const {auth, firestore} = useContext(Context);
    const [user, loading] = useAuthState(auth);
    const [activeSelect, setActiveSelect] = useState(false);
    const [activeCreate, setActiveCreate] = useState(false);

    if(loading)
        return <Loader/>

    const createClick = () => {
        navigate(CREATE_ROOM);
    }

    const enterClick = () => {
        setActiveSelect(true);
        navigate(SELECT_ROUTE);
    }

    return (
        <div>
            <Sidebar/>
            {/*<RoomList active={activeSelect} setActive={setActiveSelect}/>*/}
            <Button color="inherit" id={"createLobby"} style={{backgroundColor: "green", marginLeft: '500px'}} onClick={createClick}>Создать комнату</Button>
            <Button color="inherit" id={"enterLobby"} style={{backgroundColor: "yellow"}} onClick={enterClick}>Войти в комнату</Button>
        </div>
    );
};

export default MainScreen;