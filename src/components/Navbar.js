import * as React from 'react';
import {AppBar, Box, Toolbar, Typography, Button, IconButton} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import {LOGIN_ROUTE, REGISTRATION_ROUTE, START_ROUTE} from "../utils/consts";
import "./components.css";
import {useNavigate} from 'react-router-dom';
import {useContext} from "react";
import {Context} from "../index";
import {useAuthState} from "react-firebase-hooks/auth";
import {changeStatus} from "../utils/functions";
import Loader from "./Loader";

const Navbar = () => {
    const navigate = useNavigate();
    const {auth, firestore} = useContext(Context);
    const [user, loading] = useAuthState(auth);

    if(loading)
        return <Loader/>

    const loginClick = () => {
        navigate(LOGIN_ROUTE);
    }

    const logoutClick = () => {
        changeStatus(firestore, user.email, false);
        auth.signOut();
        navigate(START_ROUTE);
    }

    const registrationClick = () => {
        navigate(REGISTRATION_ROUTE);
    }

    return(
        <div>
            <Box sx={{flexGrow: 1}}>
                <AppBar position="static">
                    <Toolbar>
                        <IconButton
                            size="large"
                            edge="start"
                            color="inherit"
                            aria-label="menu"
                            sx={{mr: 2}}
                        >
                            <MenuIcon /*onClick={() => setOpenMenu(!openMenu)}*//>
                        </IconButton>
                        <Typography variant="h6" component="div" sx={{flexGrow: 1}}>
                            Крестики-нолики (Сделать меню)
                        </Typography>
                        {user ?
                            <Button color="inherit" id={"enter/details"} /*onClick={loginClick}*/>{user.displayName}</Button>
                            :
                            <Button color="inherit" id={"enter/details"} onClick={loginClick}>Войти</Button>
                        }
                        {user ?
                            <Button color="inherit" id={"register/exit"} onClick={logoutClick}>Выйти</Button>
                            :
                            <Button color="inherit" id={"register/exit"} onClick={registrationClick}>Зарегистрироваться</Button>
                        }
                    </Toolbar>
                </AppBar>
            </Box>
        </div>
    )
}

export default Navbar;