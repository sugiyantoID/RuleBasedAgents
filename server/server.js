const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');
var moment = require('moment');
var {PythonShell} = require('python-shell');

// BOT API

// db
const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;
const connectionURL = 'mongodb+srv://Playdata:BigOld2@bigold2logs-7vikf.mongodb.net/test?retryWrites=true&w=majority';
const databaseName = 'RuleBasedAIHumanLog';
var db;

MongoClient.connect(connectionURL, {useNewUrlParser: true}, (error, client)=>{
    if(error){
        return console.log('Unable to connect to database!')
    }

    console.log('Connected to the database')
    db = client.db(databaseName)
})

var insertLog = (initState, move, endState, winner, turn, mode) =>{
    db.collection('playersLog').insertOne({
        initState,
        move,
        endState,
        winner,
        turn,
        mode,
        'dateTime':moment(Date.now()).format('dddd DD/MMMM/Y H:mm:ss')
    })
}

var checkBotMove = (roomname, currentTurn) =>{
    if(!rooms.isRoomBotEmpty(roomname)){
        try {
            if (currentTurn.substring(0,4) === "BOT-") {
                var username = currentTurn;
                var playerRoom = rooms.getRoom(roomname);
                var player = playerRoom.players.find((p)=>p.username === username);
                var botHand = player.hand;
                var turn = playerRoom.turn;
                var roommode = player.roommode;
                var passCount = rooms.countPassedPlayers(roomname);
        
                var fieldHistory = rooms.getFieldHistory(roomname);
                if (fieldHistory.length === 0){
                    fieldHistory = undefined;
                }
        
                var pNumb = player.pno;
                var e1Numb = ((pNumb+1)%4 ===0)? e1Numb = 4: e1Numb = (pNumb+1)%4;
                var e2Numb = ((pNumb+2)%4 ===0)? e2Numb = 4: e2Numb = (pNumb+2)%4;
                var e3Numb = ((pNumb+3)%4 ===0)? e3Numb = 4: e3Numb = (pNumb+3)%4;
        
                var e1Hand = playerRoom.players.find((p)=>p.pno === e1Numb).hand.length;
                var e2Hand = playerRoom.players.find((p)=>p.pno === e2Numb).hand.length;
                var e3Hand = playerRoom.players.find((p)=>p.pno === e3Numb).hand.length;
        
                var passSign = rooms.getPassStatus(roomname);
        
                if (passCount === 3 || turn === 1) {
                    control = true;
                    rooms.refreshPlayStatus(roomname);
                }
                else{control = false}
        
                var cardField = playerRoom.field;
                if (cardField.length > 0){
                    if (cardField[0].card.length === 0) {
                        cardField = undefined
                    }
                    else{
                        cardField = cardField[0].card
                    }
                }
                else{
                    cardField = undefined;
                }
                // get the bot move without api

                var options = {
                    mode :'text',
                    encoding : 'utf8',
                    pythonOption : ['-u'],
                    scriptPath : './AI',
                    args: [botHand, cardField, control, turn-1, fieldHistory, e1Hand, e2Hand, e3Hand, passSign],
                    // pythonPath : './Python3/python'
                }
                
                var test = new PythonShell('rulebaseAI.py', options)
                test.on('message', function(result){
                    if(result === ""){
                        cardname = []
                    }
                    else {cardname = result.split(" ")}
                    // if (result.indexOf('.')!== -1){
                    //     var time = result
                    //     console.log(typeof time)
                    //     console.log(time)
                    // }
                    // if (result.indexOf('.')=== -1){
                    //     var card = result
                    //     if(card === ""){
                    //         cardname = []
                    //     }
                    //     else {cardname = card.split(" ")}
                    //     console.log(typeof cardname)
                    //     console.log(cardname)
                    // }

                    if (turn === 1) { var timeBot = 5000 }
                    else { var timeBot = 1000 }
                    setTimeout(()=>{
                        if (cardname){
                            if (cardname.length === 0) {
                                var prevPno = player.pno;
                                players.updatePlayStatus(username)
                                var passCount = rooms.countPassedPlayers(roomname);
                                
                                rooms.updateLog(roomname, {username, 'card':[]})
                                var roomPlayers = players.getPlayerList(roomname) // ambil list player buar variable change turn
                                var currentTurn = rooms.changeTurn(roomname, roomPlayers, player.pno) // ganti turn
                                io.to(roomname).emit('afterPass', currentTurn, prevPno, passCount); // emit event afterThrow buat update semua kartu player di layar masing2
                                return checkBotMove(roomname, currentTurn)
                            }
                        }
        
        
                        rooms.throwCard(username, roomname, cardname) //buang kartu dan update kartu di tangan
                        var roomPlayers = players.getPlayerList(roomname) // ambil list player buar variable change turn
                        var currentTurn = rooms.changeTurn(roomname, roomPlayers, player.pno) // ganti turn
                        io.to(roomname).emit('afterThrow', currentTurn, rooms.getTopField(roomname), player.hand.length); // emit event afterThrow buat update semua kartu player di layar masing2
                        
                        if(player.hand.length === 0) {
                            io.to(roomname).emit('gameOver')
                            setTimeout(()=>{
                                rooms.updateEndState(roomname)
                                var playerRoom = rooms.getRoom(roomname);
                                insertLog(playerRoom.initState, playerRoom.move, playerRoom.endState, username, playerRoom.turn - 1, getRoomModeName(roommode))
                                rooms.refreshPlayStatus(roomname);
                                playerRoom.turn = 1;
                                playerRoom.field = [];
                                playerRoom.currentTurn = "";
                                playerRoom.move = [];
                                playerRoom.endState = [];
                                rooms.updatePlayerScore(roomname,roommode);
                                player.win += 1;
                                var gameno = 0;
                                roomPlayers.forEach(p => {
                                    gameno += p.win;
                                });
                                var playerRoom = rooms.resetRoom(roomname, roomPlayers, gameno);
                    
                                var room = rooms.getRoom(roomname);
                                room.initState = playerRoom.initState;
                    
                                var firstCard = getRoomParams(roommode).lowestCard;
                                var currentTurn = rooms.getFirstTurn(roomname, firstCard);
                                var playerScore = rooms.getPlayersScore(roomname);
                                var playerWin = rooms.getPlayersWin(roomname);
                                io.to(roomname).emit('newGame', playerScore, currentTurn, playerWin, gameno);
                                return checkBotMove(roomname, currentTurn)
                            },3000)
                        }
                        else{
                            checkBotMove(roomname, currentTurn)
                        }
        
                    }, timeBot)

                })
            }
        } catch (error) {
            console.log("error current turn")
        }
    }
}

//utils
const {Players} = require('./utils/player');
var players = new Players();
const {Rooms} = require('./utils/room');
var rooms = new Rooms();

const {getRoomParams, getRoomMoveLogic, getRoomModeName} = require('./utils/roommode');
const {isRealString} = require('./utils/validation');
const {generateMessage} = require('./utils/message');

const publicPath = path.join(__dirname, '../public');
const port = process.env.PORT || 1234;
var app = express();
var server = http.createServer(app);
var io = socketIO(server);

app.use(express.static(publicPath));

io.on('connection', (socket)=>{
    // console.log('New user connected');
    // ----------------------- EVENT 0. LISTEN PLAYER LOGIN -----------------------
    socket.on('playerLogin', (roomname, username, roommode, callback)=>{
        var roomPlayers = players.getPlayerList(roomname);
        if(roomPlayers.length >0){
            var getRoomMode = roomPlayers[0].roommode;
            if(roommode != getRoomMode) return callback("Must be the same mode")
        }

        var existName = players.getPlayerName(username);
        if(existName){
            return callback("Username already taken")
        }

        if(username.includes("-")){
            return callback("Invalid Name")
        }

        var roomPlayerCount = roomPlayers.length;
        if(roomPlayerCount >= 4){
            return callback('Room is Full')
        }
        if(roomPlayerCount >= 3 && roommode === '4'){ 
            return callback('The maximum players in BOT is 3');
        }
        callback()
    });

    // ----------------------- EVENT 1. LISTEN JOIN ROOM -----------------------
    var id;
    socket.on('joinWaitingRoom', (params,callback)=>{
        var username = params.Username;
        var roomname = params.Room;
        var roomPlayers = players.getPlayerList(roomname);
        var roommode = params.Mode;
        var existName = players.getPlayerName(username);
        id = socket.id;
        if(roomPlayers.length >0){
            var getRoomMode = roomPlayers[0].roommode;
            if(roommode != getRoomMode){
                return callback("Must be the same mode", undefined)
            }
        }

        if(existName){
            return callback("Username already taken", undefined)
        }
        
        if(username.includes("-")){
            return callback("Invalid Name")
        }

        var roomPlayerCount = players.getPlayerList(roomname).length;
        if(roomPlayerCount >= 4){ 
            return callback('Room is Full', undefined);
        }

        if(roomPlayerCount >= 3 && roommode === '4'){ 
            return callback('Room is Full', undefined);
        }
        
        console.log('new player join');
        socket.join(roomname); // join room
        
        var pno = roomPlayerCount + 1;
        players.addPlayer(id, username, roomname, roommode, pno); // setiap player yang join ditambahin ke arr player

        var playerList = players.getPlayerNames(roomname);
        io.to(roomname).emit('updatePlayerList', playerList); // update div nya player
        
        if(pno == 1 && roommode === '4'){
            return callback(undefined, 1)
        }

        //----------------------- EVENT 2. RETURN CALLBACK GAME START -----------------------
        var roomPlayerCount = players.getPlayerList(roomname).length; // ngambil ulang jumlah player
        var roomPlayers = players.getPlayerList(roomname);
        var playersNumb = players.getPlayersNumb(roomPlayers, roomPlayerCount);
        
        // console.log(pno,roommode)
        if(roomPlayerCount === 4){
            rooms.addRoom(roomname, roomPlayers);
            var timeCount = getRoomParams(roommode).timeCount;
            var firstCard = getRoomParams(roommode).lowestCard;
            var currentTurn = rooms.getFirstTurn(roomname, firstCard);
            io.to(roomname).emit('gameStart', playersNumb, currentTurn, timeCount);
            rooms.updateGameStatus(roomname, "playing")
            rooms.getRoom(roomname).currentTurn = currentTurn;
            
            return callback();
        }
        callback(); //gak ngasih apa-apa karna ga error
    });
    // end join room -------------------------------------------------------------------------

    socket.on('botStart', (params, boturl, choosebot)=>{
        var username = params.Username;
        var roomname = params.Room;
        var roommode = params.Mode;
        
        // return console.log(boturl, choosebot)
        var roomPlayerCount = players.getPlayerList(roomname).length; // ngambil ulang jumlah player
        
        for (var i = 0; i < (4-roomPlayerCount); i++) {
            id = "BOT-"+roomname+String(i+1);
            username = id
            pno = roomPlayerCount+i+1
            players.addPlayer(id, username, roomname, roommode, pno);
        }
        
        var roomPlayerCount = players.getPlayerList(roomname).length; // ngambil ulang jumlah player
        var roomPlayers = players.getPlayerList(roomname);
        var playersNumb = players.getPlayersNumb(roomPlayers, roomPlayerCount);
        
        rooms.addRoom(roomname, roomPlayers);

        // console.log(JSON.stringify(rooms, undefined,2))
        playerRoom = rooms.getRoom(roomname);
        if (boturl) {
            playerRoom.boturl = boturl
        }
        else {playerRoom.boturl = choosebot}
        playerRoom = rooms.getRoom(roomname);
        // return console.log(playerRoom)

        // console.log(JSON.stringify(rooms, undefined,2))
        var timeCount = getRoomParams(roommode).timeCount;
        var firstCard = getRoomParams(roommode).lowestCard;
        var currentTurn = rooms.getFirstTurn(roomname, firstCard);
        // console.log(playersNumb, firstCard, currentTurn)
        io.to(roomname).emit('gameStart', playersNumb, currentTurn, timeCount);
        rooms.updateGameStatus(roomname, "playing")
        rooms.getRoom(roomname).currentTurn = currentTurn;

        checkBotMove(roomname, currentTurn);
    })

    //----------------------- EVENT 3. LISTEN INIT HAND -----------------------
    socket.on('initHand', (params, callback)=>{
        var username = params.Username;
        var roomname = params.Room;
        var roommode = params.Mode;
        var playerRoom = rooms.getRoom(roomname);
        var player = playerRoom.players.find((p)=>p.username === username);
        var playerHand = player.hand;

        var myturn = player.pno;

        var p2hand = playerRoom.players.find((x)=>{
            var numb = (myturn + 1) % 4;
            numb === 0 ? numb = 4 : numb;
            if(x.pno === numb){return x;}
        });

        var p3hand = playerRoom.players.find((x)=>{
            var numb = (myturn + 2) % 4;
            numb === 0 ? numb = 4 : numb;
            if(x.pno === numb){return x;}
        });

        var p4hand = playerRoom.players.find((x)=>{
            var numb = (myturn + 3) % 4;
            numb === 0 ? numb = 4 : numb;
            if(x.pno === numb){return x;}
        });

        obj = {
            'myhand' : playerHand,
            'p2hand' : p2hand.hand.length,
            'p3hand' : p3hand.hand.length,
            'p4hand' : p4hand.hand.length,
            'lowestCard' : getRoomParams(roommode).lowestCard
        }
        callback(obj)
    });
    // end init hand -------------------------------------------------------------------------


    socket.on("passTurn", (params)=>{
        var username = params.Username;
        var roomname = params.Room;
        var playerRoom = rooms.getRoom(roomname);
        var player = playerRoom.players.find((p)=>p.username === username);
        var prevPno = player.pno;
        players.updatePlayStatus(socket.id)
        var passCount = rooms.countPassedPlayers(roomname);
        

        rooms.updateLog(roomname, {username, 'card':[]})
        var roomPlayers = players.getPlayerList(roomname) // ambil list player buar variable change turn
        var currentTurn = rooms.changeTurn(roomname, roomPlayers, player.pno) // ganti turn
        io.to(roomname).emit('afterPass', currentTurn, prevPno, passCount); // emit event afterThrow buat update semua kartu player di layar masing2
        checkBotMove(roomname, currentTurn);
    })

    socket.on("throwCard", (params, cardname, callback)=>{
        var username = params.Username;
        var roomname = params.Room;
        var roommode = params.Mode;
        var playerRoom = rooms.getRoom(roomname);
        var player = playerRoom.players.find((p)=>p.username === username);
        var passCount = rooms.countPassedPlayers(roomname);
        // var initState = playerRoom.initState;
        // console.log(JSON.stringify(initState, undefined, 2))
        
        if(playerRoom.turn > 1 && passCount != 3){
            var topField = rooms.getTopField(roomname).card;
        }

        var cb = getRoomMoveLogic(roommode, playerRoom.turn, cardname, passCount, topField);
        if (cb){
            return callback(cb)
        }

        if(passCount === 3){
            rooms.refreshPlayStatus(roomname);
        }
        rooms.throwCard(username, roomname, cardname) //buang kartu dan update kartu di tangan
        var roomPlayers = players.getPlayerList(roomname) // ambil list player buar variable change turn
        var currentTurn = rooms.changeTurn(roomname, roomPlayers, player.pno) // ganti turn
        io.to(roomname).emit('afterThrow', currentTurn, rooms.getTopField(roomname), player.hand.length); // emit event afterThrow buat update semua kartu player di layar masing2

        if(player.hand.length === 0) {
            io.to(roomname).emit('gameOver')
            setTimeout(()=>{
                rooms.updateEndState(roomname)
                var playerRoom = rooms.getRoom(roomname);
                insertLog(playerRoom.initState, playerRoom.move, playerRoom.endState, username, playerRoom.turn - 1, getRoomModeName(roommode))
                rooms.refreshPlayStatus(roomname);
                playerRoom.turn = 1;
                playerRoom.field = [];
                playerRoom.currentTurn = "";
                playerRoom.move = [];
                playerRoom.endState = [];
                rooms.updatePlayerScore(roomname,roommode);
                player.win += 1;
                var gameno = 0;
                roomPlayers.forEach(p => {
                    gameno += p.win;
                });
                var playerRoom = rooms.resetRoom(roomname, roomPlayers);

                var room = rooms.getRoom(roomname);
                room.initState = playerRoom.initState;
                // room.currentTurn = playerRoom.currentTurn;

                var firstCard = getRoomParams(roommode).lowestCard;
                var currentTurn = rooms.getFirstTurn(roomname, firstCard);
                var playerScore = rooms.getPlayersScore(roomname);
                var playerWin = rooms.getPlayersWin(roomname);
                io.to(roomname).emit('newGame', playerScore, currentTurn, playerWin, gameno);
                checkBotMove(roomname, currentTurn);
                return callback();
            },3000)
        }
        else{
            checkBotMove(roomname, currentTurn);
        }
        callback();
    })

    socket.on("cdControlTurn", (params)=>{
        var username = params.Username;
        var roomname = params.Room;
        var roommode = params.Mode;
        var playerRoom = rooms.getRoom(roomname);
        var player = playerRoom.players.find((p)=>p.username === username);
        var passCount = rooms.countPassedPlayers(roomname);

        if(passCount === 3){
            rooms.refreshPlayStatus(roomname);
        }

        rooms.throwCard(username, roomname, [player.hand[0]]) //buang kartu dan update kartu di tangan
        var roomPlayers = players.getPlayerList(roomname) // ambil list player buar variable change turn
        var currentTurn = rooms.changeTurn(roomname, roomPlayers, player.pno) // ganti turn
        io.to(roomname).emit('afterThrow', currentTurn, rooms.getTopField(roomname), player.hand.length); // emit event afterThrow buat update semua kartu player di layar masing2

        if(player.hand.length === 0) {
            io.to(roomname).emit('gameOver')
            setTimeout(()=>{
                rooms.updateEndState(roomname)
                var playerRoom = rooms.getRoom(roomname);
                insertLog(playerRoom.initState, playerRoom.move, playerRoom.endState, username, playerRoom.turn - 1, getRoomModeName(roommode))
                rooms.refreshPlayStatus(roomname);
                playerRoom.turn = 1;
                playerRoom.field = [];
                playerRoom.currentTurn = "";
                playerRoom.move = [];
                playerRoom.endState = [];
                rooms.updatePlayerScore(roomname, roommode);
                player.win += 1;
                var gameno = 0;
                roomPlayers.forEach(p => {
                    gameno += p.win;
                });
                var playerRoom = rooms.resetRoom(roomname, roomPlayers);
                
                var room = rooms.getRoom(roomname);
                room.initState = playerRoom.initState;
                
                var firstCard = getRoomParams(roommode).lowestCard;
                var currentTurn = rooms.getFirstTurn(roomname, firstCard);
                var playerScore = rooms.getPlayersScore(roomname);
                var playerWin = rooms.getPlayersWin(roomname);
                io.to(roomname).emit('newGame', playerScore, currentTurn, playerWin, gameno);
                checkBotMove(roomname, currentTurn);
            },3000)
        }
        else{
            checkBotMove(roomname, currentTurn);
        }
    });

    socket.on('createMessage', (params, message, callback) => {
        var username = players.getPlayerName(params.Username);
        var roomname = params.Room;
        if (username && isRealString(message)) {
          io.to(roomname).emit('newMessage', generateMessage(username, message));
        }
        callback();
    });

    socket.on('disconnect', ()=>{
        var roomname = players.getPlayerRoom(socket.id);
        var player = players.getPlayer(socket.id);
        if(player){
            if(player.gamestatus != "playing"){
                players.removePlayer(id);
                var playerList = players.getPlayerNames(roomname);
                io.to(player.roomname).emit('updatePlayerList', playerList);
            }
            if(player.gamestatus === "playing"){
                player.gamestatus = "disconnected";
                io.to(roomname).emit("playerDisconnected", player.username)
                players.removePlayersFromRoom(roomname)
                rooms.removeRoom(roomname)
                
                // if (rooms.isRoomEmpty(roomname)){
                //     players.removePlayersFromRoom(roomname)
                //     rooms.removeRoom(roomname)
                // }
                // var roommode = player.roommode;
                // console.log(roommode)
                // if (roommode === '4'){
                //     if (rooms.isRoomBotEmpty(roomname)){
                //         players.removePlayersFromRoom(roomname)
                //         rooms.removeRoom(roomname)
                //     }
                // }
            }
        }
        console.log('disconnected')
    });
});

server.listen(port, () => {
    console.log(`Server is up on ${port}`)
}); 