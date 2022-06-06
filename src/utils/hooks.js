import {useEffect, useState} from "react";
import {ref, onValue, get, query} from "firebase/database";

export function useDifficulty(firestore, user) {
    const [difficulty, setDifficulty] = useState();

    useEffect(() => {
        const promise = firestore.collection("lobbies").where("players", "array-contains", user.displayName)
            .get()
            .then((querySnapshot) => {
                let dif;

                querySnapshot.forEach((doc) => {
                    dif = doc.data().difficulty;
                });

                setDifficulty(dif);
            })
            .catch((e) => {
                console.log("Error getting document: ", e);
            });
    }, [])

    return [difficulty];
}

export function useOnGameUsers(firestore, user) {
    const [players, setPlayers] = useState([]);

    const promise = firestore.collection("lobbies").where("players", "array-contains", user.displayName)
        .onSnapshot((snapshot) => {
            const inGameUsers = [];
            const users = [];

            snapshot.forEach((doc) => {
                inGameUsers.push(doc.data().players);
            });

            inGameUsers.map(user => {
                user.map(u => users.push(u));
            });
            setPlayers(users);
        })

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

/*export function useNewSocket() {

    console.log(difficulty);
    if(difficulty === 'human')
        return new WebSocket('ws://localhost:5000');
}*/