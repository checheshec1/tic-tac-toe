import {useEffect, useState} from "react";

export function useDifficultyAndPlayersState(firestore, user) {
    const [difficulty, setDifficulty] = useState();
    const [players, setPlayers] = useState([]);

    useEffect(() => {
        const promise = firestore.collection("lobbies").where("players", "array-contains", user.displayName)
            .get()
            .then((querySnapshot) => {
                let states = [];
                let dif;
                querySnapshot.forEach((doc) => {
                    dif = doc.data().difficulty;
                    states.push(doc.data().players);
                });
                setDifficulty(dif);
                setPlayers(states);
            })
            .catch((e) => {
                console.log("Error getting document: ", e);
            });
    }, [])

    return [difficulty, players];
}

export function useGetOnlineUsers(firestore) {
    const [onlineUsers, setOnlineUsers] = useState([]);

    const promise = firestore.collection("users").where("online", "==", true)
        .onSnapshot((snapshot) => {
            const users = [];
            snapshot.forEach((doc) => {
                users.push(doc.data().displayName);
            });
            setOnlineUsers(users);
        });

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