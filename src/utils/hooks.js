import {useEffect, useState} from "react";
import {ref, onValue, get, query} from "firebase/database";

export function useDifficulty(db, user) {
    const [difficulty, setDifficulty] = useState();

    useEffect(() => {
        const usersRef = ref(db, 'activeRooms');
        onValue(usersRef, (snapshot) => {

            snapshot.forEach(room => {
                if(room.val().player.includes(user.displayName)) {
                    setDifficulty(room.val().difficulty);
                }
            });
        });
    }, []);

    return [difficulty];
}

export function useOnGameUsers(db, user) {
    const [players, setPlayers] = useState([]);

    useEffect(() => {
        const usersRef = ref(db, 'activeRooms');
        onValue(usersRef, (snapshot) => {
            const users = [];

            snapshot.forEach(username => {
                if(username.val().player.includes(user.displayName)) {
                    users.push(username.val().player);
                }
            });
            users.map(user => setPlayers(user));
        });
    }, [])

    return [players];
}

export function useGetOnlineUsers(db) {
    const [onlineUsers, setOnlineUsers] = useState([]);

    useEffect(() => {
        const usersRef = ref(db, 'onlineUsers');
        onValue(usersRef, (snapshot) => {
            const users = [];

            snapshot.forEach(username => {
                users.push(username.val().username);
            });
            setOnlineUsers(users);
        });
    }, [])

    return [onlineUsers];
}

export function useGetFreeRooms(firestore) {
    const [freeRooms, setFreeRooms] = useState([]);

    const promise = firestore.collection("lobbies").where("enabled", "==", true)
        .onSnapshot((snapshot) => {
            const rooms = [];

            snapshot.forEach((doc) => {
                rooms.push(doc.data().name);
            });

            setFreeRooms(rooms);
        });

    return [freeRooms];
}

/*export function useNewSocket(difficulty) {

    console.log(difficulty);
    if(difficulty === 'human')
        return new WebSocket('ws://localhost:5000');
}*/