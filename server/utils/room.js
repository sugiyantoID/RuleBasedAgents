const {Card} = require('./card');
var card = new Card();

const {modeSortingCards, countRoomScore} = require('./roommode');

class Rooms{
    constructor(){
        this.rooms = [];
    }

    generateRoom(roomname, players, gameno){
        var deckString = [
        'AD', '2D', '3D','4D', '5D', '6D','7D', '8D', '9D', '10D', 'JD', 'QD', 'KD',
        'AC', '2C', '3C','4C', '5C', '6C','7C', '8C', '9C', '10C', 'JC', 'QC', 'KC',
        'AH', '2H', '3H','4H', '5H', '6H','7H', '8H', '9H', '10H', 'JH', 'QH', 'KH',
        'AS', '2S', '3S','4S', '5S', '6S','7S', '8S', '9S', '10S', 'JS', 'QS', 'KS']
        
        var deck = card.shuffle(deckString);
        var initDeck = deck;
        var initState = []
        players.forEach((player)=>{
            var draw = deck.slice(0,13);
            player.hand = modeSortingCards(player.roommode, draw)
            deck = deck.slice(13, deck.length);
            const pName = player.username;
            const pHand = modeSortingCards(player.roommode, draw);
            initState.push({pName, pHand})
        });

        var turn = 1;
        var field = []
        var currentTurn;
        var move = [];
        var endState = [];
        var boturl = '';
        var room = {roomname, players, initDeck, turn, field, currentTurn, initState, move, endState, boturl, gameno};
        return room;        
    }

    addRoom(roomname, players){
        var room = this.generateRoom(roomname,players,0);
        this.rooms.push(room);
        return room;
    }

    resetRoom(roomname, players, gameno){
        try {
            var room = this.getRoom(roomname);
            room = this.generateRoom(roomname,players,gameno);
            return room;
        } catch (error) {
            console.log('error resetRoom from room')
        }
    }

    getRoom(roomname){
        try {
            var room = this.rooms.find((r) => r.roomname === roomname);
            return room;
        } catch (error) {
            console.log('error getRoom from room')
        }
    }

    getFirstTurn(roomname, fCard){
        try {
            var player = this.getRoom(roomname).players;
            return player.find(p => p.hand[0] === fCard).username;
        } catch (error) {
            console.log('error getFirstTurn from room')
        }
    }

    throwCard(username, roomname, card){
        try {
            var room = this.getRoom(roomname);
            var getplayer = room.players;
            var playerHand = getplayer.find(x => x.username === username).hand;
            for(var i = 0; i<card.length; i++){
                var returnedCard = playerHand.find( c => c === card[i]);
                playerHand.splice(playerHand.indexOf(returnedCard),1);
            }
            this.updateRoomField(room.roomname, {username, card})
            this.updateLog(room.roomname, {username, card})
            return playerHand;
            
        } catch (error) {
            console.log('error throwCard from room')
        }
    }
    
    updateLog(roomname, field){
        try {
            var room = this.getRoom(roomname);
            room.move.push(field)
        } catch (error) {
            console.log('error updateLog from room')
        }
    }

    updateEndState(roomname){
        try {
            var room = this.getRoom(roomname);
            var players = room.players;
            room.endState = [
                {'p1Name' : players[0].username, 'p1Hand' : players[0].hand},
                {'p2Name' : players[1].username, 'p2Hand' : players[1].hand},
                {'p3Name' : players[2].username, 'p3Hand' : players[2].hand},
                {'p4Name' : players[3].username, 'p4Hand' : players[3].hand}
            ]
        } catch (error) {
            console.log('error updateEndState from room')
        }
    }

    updateRoomField(roomname, field){
        try {
            var room = this.getRoom(roomname).field;
            return room.unshift(field);
        } catch (error) {
            console.log('error updateRoomField from room')
        }
    }

    updatePlayerScore(roomname, roommode){
        try {
            var room = this.getRoom(roomname);
            var players = room.players;
            var score = 0;
            for(var i=0; i<players.length; i++){
                if (players[i].hand.length === 0) var j = i;
                players[i].score -= countRoomScore(roommode, players[i].hand);
                score += countRoomScore(roommode, players[i].hand);
            }
    
            if (typeof j !== "undefined") players[j].score += score;
    
            var currentScore = [];
            players.forEach(p => {
                currentScore.push({"name":p.username, "score":p.score})
            });
            return currentScore;
        } catch (error) {
            console.log('error updatePlayerScore from room')
        }
    }

    updateGameStatus(roomname, status){
        try {
            var room = this.getRoom(roomname);
            var players = room.players;
            players.forEach(p => {
                p.gamestatus = status;
            });            
        } catch (error) {
            console.log('error updateGameStatus from room')
        }
    }

    changeTurn(roomname, roomPlayers, curnumb){
        try {
            for(var i=1; i < roomPlayers.length; i++){
                var numb = (curnumb + i) % 4;
                numb === 0 ? numb = 4 : numb;
                var currentTurn = roomPlayers.find(p => p.pno === numb);
                if(currentTurn.playstatus === ""){
                    this.getRoom(roomname).currentTurn = currentTurn.username;
                    this.getRoom(roomname).turn ++;
                    return currentTurn.username;
                }
            }
        } catch (error) {
            console.log('error changeTurn from room')
        }
    }

    getTopField(roomname){
        try {
            return this.getRoom(roomname).field[0];
        } catch (error) {
            console.log('error getTopField from room')
        }
    }

    getFieldHistory(roomname){
        try {
            var fieldHistory = [];
            var field = this.getRoom(roomname).field;
            // console.log('field = '+ JSON.stringify(field,undefined,2));
            for (var i = 0; i < field.length; i++) {
                for(var j = 0; j<field[i].card.length; j++){
                    fieldHistory.push(field[i].card[j]);
                }
            }
            return fieldHistory;
        } catch (error) {
            console.log('error getFieldHistory from room')
        }
    }

    refreshPlayStatus(roomname){
        try {
            var roomPlayers = this.getRoom(roomname).players;
            var player = roomPlayers.filter(x => x.playstatus === "pass");
            player.forEach(p => {
                p.playstatus = "";
            });            
        } catch (error) {
            console.log('error refreshPlayStatus from room')
        }
    }

    getPassStatus(roomname){
        try {
            var roomPlayers = this.getRoom(roomname).players;
            var passSign = []
            roomPlayers.forEach(p => {
                if (p.playstatus === "pass") {
                    passSign.push(1)
                }
                else{passSign.push(0)}
            })
            return passSign;
            
        } catch (error) {
            console.log('error getPassStatus from room')
        }
    }

    countPassedPlayers(roomname){
        try {
            var roomPlayers = this.getRoom(roomname).players;
            return roomPlayers.filter(x => x.playstatus === "pass").length;
        } catch (error) {
            console.log('error countPassedPlayers from room')
        }
    }

    getPlayersScore(roomname){
        try {
            var playerList = this.getRoom(roomname).players;
            var playersScore = [];
            playerList.forEach(p => {
                var username = p.username;
                var score = p.score;
                playersScore.push([username, score]);
            });
            return playersScore;
        } catch (error) {
            console.log('error getPlayersScore from room')
        }
    }

    getPlayersWin(roomname){
        try {
            var playerList = this.getRoom(roomname).players;
            var playersWin = [];
            playerList.forEach(p => {
                var username = p.username;
                var score = p.win;
                playersWin.push([username, score]);
            });
            return playersWin;
        } catch (error) {
            console.log('error getPlayersWin from room')
        }
        
    }

    isRoomEmpty(roomname){
        try {
            var playerList = this.getRoom(roomname).players;
            var disconnected = playerList.filter(x => x.gamestatus === "disconnected").length;
            if(disconnected === 4){
                return true
            };
            return false
        } catch (error) {
            console.log('error isRoomEmpty from room')
        }
        
    }

    isRoomBotEmpty(roomname){
        try {
            var playerList = this.getRoom(roomname).players;
            var humanLeft = playerList.filter(x => x.username.substring(0,4) !== "BOT-" && x.gamestatus !== "disconnected").length;
            if(humanLeft === 0){
                return true
            };
            return false
        } catch (error) {
            console.log('no room')
        }
    }

    removeRoom(roomname){
        try {
            var room = this.getRoom(roomname);
            if (room){
                this.rooms = this.rooms.filter((room)=> room.roomname != roomname);
            }
            return room;
        } catch (error) {
            console.log('error removeRoom from room')
        }
        
    }
}

module.exports = {Rooms};