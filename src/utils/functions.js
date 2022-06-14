import {ref, child, get, push, update, remove, set, runTransaction, onValue} from "firebase/database";

export const changeStatus = async (firestore, email, status) => {

     return await firestore.collection("users").where("email", "==", email).get()
        .then(function (querySnapshot) {
            querySnapshot.forEach(function (doc) {
                var docRef = firestore.collection("users").doc(doc.id);
                return firestore.runTransaction((transaction) => {
                    return transaction.get(docRef).then((sfDoc) => {
                        if (!sfDoc.exists) {
                            throw "Document does not exist!";
                        }
                        var newStatus = status;
                        transaction.update(docRef, {online: newStatus});
                    });
                }).then(() => {
                    console.log("Transaction successfully committed!");
                })
            });
        })
        .catch(e => {
            console.log(e);
        })

}

export const enterGame = async (db, num, user) => {
    const gameRef = ref(db, `activeRooms/room_${num}`);
    let players;

    get(gameRef)
        .then((snapshot) => {
            if(snapshot.exists()) {

                players = snapshot.val().player;
            } else {
                console.log('No data available');
            }
            players.push(user.displayName);

            runTransaction(gameRef, (game) => {
                if(game) {
                    update(gameRef, {player: players, enabled: false})
                }
            })
                .then(() => console.log('Transaction succesfully commited'));

        })
        .catch(e => {
            console.log(e);
        });

    /*let list = [];

    await firestore.collection("lobbies").where("number", "==", num).get()
        .then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                if(doc.data().enabled) {
                    list = doc.data().players;
                    let docRef = firestore.collection("lobbies").doc(doc.id);
                    return firestore.runTransaction((transaction) => {
                        return transaction.get(docRef).then((sfDoc) => {
                            if(!sfDoc.exists)
                                throw "Document does not exist!";
                            transaction.update(docRef, {players: [...list, user.displayName]});
                            if(list.length === 1)
                                transaction.update(docRef, {enabled: false});
                        });
                    }).then(() => console.log("Transaction successfully committed!"))
                }
            });
        }).catch(e => console.log(e));*/
}

export const createGame = async (firestore, user, created, type, roomName, gameDifficulty) => {

    let list;
    if (type === 'bot') {
        list = [user.displayName, 'bot'];

        return await firestore.collection("lobbies").add({
            created: user.displayName,
            createdAt: created,
            name: roomName,
            number: user.displayName + roomName,
            players: list,
            enabled: false,
            difficulty: gameDifficulty
        })
    } else {
        list = [user.displayName];

        return await firestore.collection("lobbies").add({
            created: user.displayName,
            createdAt: created,
            name: roomName,
            number: user.displayName + roomName,
            players: list,
            enabled: true,
            difficulty: gameDifficulty
        })
    }
}

export const addGameToList = async (db, user, created, type, roomName, gameDifficulty) => {
    let list;

    if(type === 'bot') {
        list = [user.displayName, 'bot'];

        const postGame = {
            created: user.displayName,
            createdAt: created,
            name: roomName,
            number: user.displayName + '_' + roomName,
            player: list,
            enabled: false,
            difficulty: gameDifficulty
        };

        const newRoomKey = `room_${user.displayName}_${roomName}`;
        const updates = {};
        updates['/activeRooms/' + newRoomKey] = postGame;

        return update(ref(db), updates);

    } else  {
        list = [user.displayName];

        const postGame = {
            created: user.displayName,
            createdAt: created,
            name: roomName,
            number: user.displayName + roomName,
            player: list,
            enabled: true,
            difficulty: gameDifficulty
        };

        const newRoomKey = 'room_' + user.displayName + roomName;
        const updates = {};
        updates['/activeRooms/' + newRoomKey] = postGame;

        return update(ref(db), updates);

    }

}

export const addToFirestore = async (firestore, uid, email, nickname, status, created) => {

    return await firestore.collection("users").add({
        createdAt: created,
        displayName: nickname,
        email: email,
        online: status,
        uid: uid
    })
        .then((docRef) => console.log(docRef.id))
        .catch(e => console.log(e));
}

export const addOrDeleteToDatabase = async (db, nickname, uid, saving) => {

    if(saving) {
        const postUser = {
            username: nickname
        }
        const newUserKey = 'user_' + uid;
        const updates = {};
        updates['/onlineUsers/' + newUserKey] = postUser;
        return update(ref(db), updates);
    } else {
        return remove(ref(db, 'onlineUsers/user_' + uid));
    }

}

export const getRandomIntInclusive = () => {
    const min = Math.ceil(0);
    const max = Math.floor(8);
    return Math.floor(Math.random() * (max - min + 1) + min);
}

export function calculateWinner(squares) {
    const lines = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
    ];

    for (let i = 0; i < lines.length; i++) {
        const [a, b, c] = lines[i];
        if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
            return squares[a];
        }
        if(getAvailableSpots(squares).length === 0)
            return 'draw';
    }
    return null;
}

function winning(board, player) {
    return (board[0] === player && board[1] === player && board[2] === player) ||
        (board[3] === player && board[4] === player && board[5] === player) ||
        (board[6] === player && board[7] === player && board[8] === player) ||
        (board[0] === player && board[3] === player && board[6] === player) ||
        (board[1] === player && board[4] === player && board[7] === player) ||
        (board[2] === player && board[5] === player && board[8] === player) ||
        (board[0] === player && board[4] === player && board[8] === player) ||
        (board[2] === player && board[4] === player && board[6] === player);
}

function getAvailableSpots(arr) {
    const spots = [];
    for(let i = 0; i < arr.length; i++){
        if(arr[i] !== "X" && arr[i] !== "O"){
            spots.push(i);
        }
    }
    return spots;
}

export function minimax (newBoard, player) {
    let humanPlayer, aiPlayer;
    humanPlayer = 'X';
    aiPlayer = 'O';
    newBoard = Array.from(newBoard);
    const availSpots = getAvailableSpots(newBoard);
    if(winning(newBoard, aiPlayer)){
        return {score: 10};
    }
    else if(winning(newBoard, humanPlayer)){
        return {score: -10};
    }
    else if(availSpots.length === 0){
        return {score: 0};
    }

    const moves = [];

    for(let j = 0; j < availSpots.length; j++){
        const move = {};
        move.index = availSpots[j];
        newBoard[availSpots[j]] = player;
        if(player === aiPlayer){
            const result = minimax(newBoard, humanPlayer);
            move.score = result.score;
        }
        else{
            const result = minimax(newBoard, aiPlayer);
            move.score = result.score;
        }

        newBoard[availSpots[j]] = move.index;
        moves.push(move);
    }

    let bestMove;

    if(player === aiPlayer){
        let bestScore1 = -100000;
        for(let k = 0; k < moves.length; k++){
            if(moves[k].score > bestScore1){
                bestScore1 = moves[k].score;
                bestMove = k;
            }
        }
    }
    else{
        let bestScore2 = 100000;
        for(let l = 0; l < moves.length; l++){
            if(moves[l].score < bestScore2){
                bestScore2 = moves[l].score;
                bestMove = l;
            }
        }
    }

    return moves[bestMove];
}

export const saveGameInFirestore = (firestore, db, num, winner) => {
    const gameRef = ref(db, `activeRooms/room_${num}`);
    let game;
    console.log(num);

    get(gameRef)
        .then((snapshot) => {
            if (snapshot.exists()) {
                game = snapshot.val();
                console.log(game);
                firestore.collection('lobbies').add({
                    created: game.created,
                    createdAt: game.createdAt,
                    difficulty: game.difficulty,
                    name: game.name,
                    number: game.number,
                    players: game.player,
                    winner: winner
                });
            } else {
                console.log('No data available');
            }
        })
        .catch(e => {
            console.log(e);
        });
}

export const removeActiveRoom = (db, num) => {
    const gameRef = ref(db, `activeRooms/room_${num}`);
    remove(gameRef);
}