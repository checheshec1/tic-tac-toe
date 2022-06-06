import React, {useContext} from 'react';
import {Box, Modal, Typography} from "@mui/material";
import {Context} from "../index";
import {useAuthState} from "react-firebase-hooks/auth";
import {enterGame} from "../utils/functions";
import Loader from "./Loader";
import {useNavigate} from "react-router-dom";
import {MAIN_ROUTE} from "../utils/consts";
import Sidebar from "./Sidebar";
import {useGetFreeRooms} from "../utils/hooks";

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

export let num;

const RoomList = () => {
    const {auth, firestore} = useContext(Context);
    const [freeRooms] = useGetFreeRooms(firestore);
    const [user, loading] = useAuthState(auth);
    const navigate = useNavigate();

    const backHandler = () => {
        navigate(MAIN_ROUTE);
    }

    const enterHandler = async (event) => {
        await enterGame(firestore, event.target.value, user);
        num = event.target.value;
        await firestore.collection("lobbies").off;
        navigate("/room/" + event.target.value);
    }

    if(loading)
        return <Loader/>



    return (
        <div>
            <Sidebar/>
            <Modal
                open={true}
                onClose={() => backHandler()}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    <Typography id="modal-modal-title" variant="h4" component="h1">Выбор игры</Typography>
                    <form className={"mui-form"} id={"auth-form"} name={"authForm"}>
                        <div className={"mui-textfield mui-textfield--float-label"}>
                            <Typography id="modal-modal-title" variant="h6" component="h3">Доступные комнаты</Typography>
                            <ul style={{margin: 10, border: '2px solid #2196F3', overflowY: 'auto', height: 230}}>
                                {freeRooms.map(room => <li><button
                                    key={room} type={"button"}
                                    className={"mui-btn mui-btn--raised mui-btn--primary item"}
                                    onClick={enterHandler}
                                    value={room}
                                >{room}</button></li>)}
                            </ul>
                        </div>
                        <button type={"submit"} className={"mui-btn mui-btn--raised mui-btn--primary"} onClick={backHandler}>Назад</button>
                    </form>
                </Box>
            </Modal>
        </div>
    );
};

export default RoomList;