import React, {useContext, useState} from 'react';
import {Box, Modal, Typography} from "@mui/material";
import "./components.css";
import {useNavigate} from "react-router-dom";
import {MAIN_ROUTE, START_ROUTE} from "../utils/consts";
import {Context} from "../index";
import {addOrDeleteToDatabase, changeStatus} from "../utils/functions";

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

const Login = () => {
    const navigate = useNavigate();
    const {auth, firestore, database} = useContext(Context);
    const [active, setActive] = useState(true);
    const [emailValue, setEmailValue] = useState("");
    const [passwordValue, setPasswordValue] = useState("");
    //const [user] = useAuthState(auth)

    const authHandler = () => {
        let email = emailValue;
        let password = passwordValue;
        const {user} = auth.signInWithEmailAndPassword(email, password)
            .then((result) => {
                changeStatus(firestore, emailValue, true);
                addOrDeleteToDatabase(database, result.user.displayName, result.user.uid, true);
            })
            .catch(() => {
                console.log(auth.errorCode);
            });
        setActive(false);
        navigate(MAIN_ROUTE);
    }

    const backHandler = () => {
        navigate(START_ROUTE);
    }

    return (
        <div>
            <Modal
                open={active}
                onClose={() => {
                    setActive(false);
                    navigate(START_ROUTE);
                }}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    <Typography id="modal-modal-title" variant="h6" component="h2">Авторизация</Typography>
                    <form className={"mui-form"} id={"auth-form"} name={"authForm"}>
                        <div className={"mui-textfield mui-textfield--float-label"}>
                            <input type={"email"} id={"email"} onChange={(e) => setEmailValue(e.target.value)} required/>
                            <label>Email</label>
                        </div>
                        <div className={"mui-textfield mui-textfield--float-label"}>
                            <input type={"password"} id={"password"} onChange={(e) => setPasswordValue(e.target.value)} required/>
                            <label>Пароль</label>
                        </div>
                        <button type={"submit"} className={"mui-btn mui-btn--raised mui-btn--primary"} onClick={authHandler}>Войти</button>
                        <button type={"submit"} className={"mui-btn mui-btn--raised mui-btn--primary"} onClick={backHandler}>Назад</button>
                    </form>
                </Box>
            </Modal>
        </div>
    );
};

export default Login;