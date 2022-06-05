import React, {useContext} from 'react';
import {Route, Routes} from 'react-router-dom';
import {privateRoutes, publicRoutes} from "../routes";
import {START_ROUTE} from "../utils/consts";
import {Context} from "../index";
import {useAuthState} from "react-firebase-hooks/auth";
import Loader from "./Loader";
import MainScreen from "./MainScreen";
import Room from "./Room";

const AppRouter = () => {
    const {auth} = useContext(Context);
    const [user, loading] = useAuthState(auth);

    if(loading)
        return <Loader/>


    return user ?
        (
        <Routes>
            {privateRoutes.map(({path, Component}) =>
                <Route key={path} path={path} element={Component} exact={true}/>
            )}
            <Route key={"/room/:id"} path={"/room/:id"} element={<Room/>} exact={true}/>
            <Route key={"defaultOnline"} path={START_ROUTE} element={<MainScreen/>} exact={true}/>
        </Routes>
        )
        :
        (
            <Routes>
                {publicRoutes.map(({path, Component}) =>
                    <Route key={path} path={path} element={Component} exact={true}/>
                )}
                <Route key={"default"} path={START_ROUTE} exact={true}/>
            </Routes>
        )
};

export default AppRouter;