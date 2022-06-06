import React, {useContext, useState} from 'react';
import {Typography} from "@mui/material";
import {Context} from "../index";
import "./components.css";
import {useAuthState} from "react-firebase-hooks/auth";
import Loader from "./Loader";
import {useGetOnlineUsers} from "../utils/hooks";

const Sidebar = () => {
    const {auth, firestore} = useContext(Context);
    const [user, loading] = useAuthState(auth);
    const [onlineUsers] = useGetOnlineUsers(firestore);

    if (loading)
        return <Loader/>;

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