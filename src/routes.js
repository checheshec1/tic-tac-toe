import {CREATE_ROOM, LOGIN_ROUTE, MAIN_ROUTE, REGISTRATION_ROUTE, SELECT_ROUTE} from "./utils/consts";
import Registration from "./components/Registration";
import Login from "./components/Login";
import MainScreen from "./components/MainScreen";
import RoomList from "./components/RoomList";
import CreateModal from "./components/createModal";


export const publicRoutes = [
    {
        path: REGISTRATION_ROUTE,
        Component: <Registration/>
    },
    {
        path: LOGIN_ROUTE,
        Component: <Login/>
    }
];

export const privateRoutes = [
    {
        path: MAIN_ROUTE,
        Component: <MainScreen/>
    },
    {
        path: SELECT_ROUTE,
        Component: <RoomList/>
    },
    {
        path: CREATE_ROOM,
        Component: <CreateModal/>
    }
    /*{
        path: GAME_ROUTE,
        Component: <Room/>
    }*/
]