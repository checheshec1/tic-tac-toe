import React, {useContext, useState} from 'react';
import {Typography} from "@mui/material";
import {Context} from "../index";
import "./components.css";
import {useAuthState} from "react-firebase-hooks/auth";
import Loader from "./Loader";

const Sidebar = () => {
    const {auth, firestore} = useContext(Context);
    const [user, loading] = useAuthState(auth);
    const [onlineUsers, setOnlineUsers] = useState([]);

    if (loading)
        return <Loader/>;

    const getOnlineUsers = async () => {
        return await firestore.collection("users").where("online", "==", true)
            .onSnapshot((snapshot) => {
                const users = [];
                snapshot.forEach((doc) => {
                    users.push(doc.data().displayName);
                });
                setOnlineUsers(users);
            })
    }

    getOnlineUsers();

    return (
        <div>
            <div className={"sidebar"}>
                <Typography className={"about"}>Список игроков онлайн</Typography>
                <div style={{overflowY: "auto"}}>
                    <ul>
                        {onlineUsers.map(user => <li style={{color: "inherit", alignContent: "center"}} key={user}>{user}</li>)}
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default Sidebar;