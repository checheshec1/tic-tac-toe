import React from 'react';
import {Box, Modal, Typography} from "@mui/material";
import {useNavigate} from "react-router-dom";
import {isValid, MAIN_ROUTE, START_ROUTE} from "../utils/consts";
import {useContext, useState} from "react";
import {Context} from "../index";
import {addToFirestore} from "../utils/functions";
import firebase from "firebase/compat/app";

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

const Registration = () => {
    const navigate = useNavigate();
    const {auth, firestore} = useContext(Context);
    const [active, setActive] = useState(true);
    const [displayNameValue, setDisplayNameValue] = useState("");
    const [emailValue, setEmailValue] = useState("");
    const [passwordValue, setPasswordValue] = useState("");
    const [confirmPasswordValue, setConfirmPasswordValue] = useState("")

    const registrationHandler = () => {
        let email = emailValue;
        let password = passwordValue;
        let nickname = displayNameValue;
        let confirmPassword = confirmPasswordValue;
        console.log(email, password, nickname, confirmPassword);

        if (isValid(nickname) && password === confirmPassword) {
            const {user} =  auth.createUserWithEmailAndPassword(email, password)
                .then((result) => {
                    result.user.updateProfile({displayName: nickname});
                    addToFirestore(firestore, result.user.uid, email, nickname, true, firebase.firestore.FieldValue.serverTimestamp())
                });
            setActive(false);
            navigate(MAIN_ROUTE);
        }
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
                    <Typography id="modal-modal-title" variant="h6" component="h2">Регистрация нового пользователя</Typography>
                    <form className={"mui-form"} id={"auth-form"}>
                        <div className={"mui-textfield mui-textfield--float-label"}>
                            <input type={"text"} id={"nickname"} onChange={(e) => setDisplayNameValue(e.target.value)} required/>
                            <label>Псевдоним</label>
                        </div>
                        <div className={"mui-textfield mui-textfield--float-label"}>
                            <input type={"email"} id={"email"} onChange={(e) => setEmailValue(e.target.value)} required/>
                            <label>Email</label>
                        </div>
                        <div className={"mui-textfield mui-textfield--float-label"}>
                            <input type={"password"} id={"password"} onChange={(e) => setPasswordValue(e.target.value)} required/>
                            <label>Пароль</label>
                        </div>
                        <div className={"mui-textfield mui-textfield--float-label"}>
                            <input type={"password"} id={"confirmPassword"} onChange={(e) => setConfirmPasswordValue(e.target.value)} required/>
                            <label>Повторите ввод пароля</label>
                        </div>
                        <button type={"submit"} className={"mui-btn mui-btn--raised mui-btn--primary"} onClick={registrationHandler}>Зарегистрироваться</button>
                        <button type={"submit"} className={"mui-btn mui-btn--raised mui-btn--primary"} onClick={backHandler}>Назад</button>
                    </form>
                </Box>
            </Modal>
        </div>
    );
};

export default Registration;