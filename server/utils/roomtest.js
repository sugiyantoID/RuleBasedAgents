const {Card} = require('./card');
var card = new Card();

const {Playertest} = require('./playertest');
var player = new Playertest();

class Roomtest{
    constructor(){
        this.rooms = [{
            "roomname" : "1",
            "players" : [
                {
                    "id": "/#aiZWaK_26Ae5LV_WAAAA",
                    "username": "a",
                    "roomname": "1",
                    "pno": 1,
                    "hand": ["3D", "3S", "5H", "7D", "7S", "8D", "8S", "9C", "10C", "JS", "QS", "KS", "2D" ],
                    "score": 0
                  },
                  {
                    "id": "/#a7-v-pW-qDV8zaOEAAAB",
                    "username": "b",
                    "roomname": "1",
                    "pno": 2,
                    "hand": ["3C", "4C", "6H", "7C", "7H", "8C", "9S", "10S", "KD", "AC", "AS", "2C", "2S" ],
                    "score": 0
                  },
                  {
                    "id": "/#TFASI7UAkMCb9rcBAAAC",
                    "username": "c",
                    "roomname": "1",
                    "pno": 3,
                    "hand": ["3H", "5C", "5S", "6D", "6C", "6S", "9D", "JD", "JH", "QC", "KH", "AD", "AH" ],
                    "score": 0
                  },
                  {
                    "id": "/#-DkQVHeprjWYLmjhAAAD",
                    "username": "d",
                    "roomname": "1",
                    "pno": 4,
                    "hand": ["4D", "4H", "4S", "5D", "8H", "9H", "10D", "10H", "JC", "QD", "QH", "KC", "2H" ],
                    "score": 0
                  }
            ],
            "turn" : 1,
            "field": [],
            "currentTurn" :""
        }];
    }

    getRoom(roomname){
        var room = this.rooms.find((r) => r.roomname === roomname);
        return room;
    }

    throwCard(username, roomname, card){
        var room = this.getRoom(roomname);
        var getplayer = room.players.find(x => x.username === username);
        var playerHand = getplayer.hand;
        var returnedCard = playerHand.find( c => c === card);
        playerHand.splice(playerHand.indexOf(returnedCard),1);
        this.updateRoomField(room.roomname, {username, card})
        return playerHand;
    }
    
    updateRoomField(roomname, field){
        var room = this.getRoom(roomname).field;
        return room.unshift(field);
    }

    updatePlayerScore(roomname, roommode){
        var room = this.getRoom(roomname);
        var players = room.players;
        var score = 0;
        if (roommode === 0 || roommode === 1){
            for(var i=0; i<players.length; i++){
                if (players[i].hand.length === 0) var j = i;
                players[i].score -= players[i].hand.length;
                score += players[i].hand.length;
            }
            if (typeof j !== "undefined") players[j].score += score;
        }

        if(roommode === 2){
            for(var i=0; i<players.length; i++){
                if (players[i].hand.length === 0) var j = i;

                var penalty = players[i].hand.filter(c => c === '2D' || c === '2C' || c === '2H' || c === '2S')
                if (penalty.length > 0){
                    players[i].score -= players[i].hand.length * (2** penalty.length);
                    score += players[i].hand.length * (2** penalty.length);    
                }
                else{
                    players[i].score -= players[i].hand.length;
                    score += players[i].hand.length;
                }
            }
            if (typeof j !== "undefined") players[j].score += score;
        }

        var currentScore = [];
        players.forEach(p => {
            currentScore.push({"name":p.username, "score":p.score})
        });
        return currentScore;
    }

    changeTurn(roomname, currentTurn){
        var playerList = player.getPlayerList(roomname);
        var numb = (currentTurn + 1) % 4;
        numb === 0 ? numb = 4 : numb;
        
        var curpno = playerList.find( n => n.pno === numb).username;
        this.getRoom(roomname).currentTurn = curpno;
        return this.getRoom(roomname).currentTurn;
    }

    addField(roomname, cards){
        this.getRoom(roomname).field.unshift(cards);
        return this.getRoom(roomname)
    }

    getTopField(roomname){
        return this.getRoom(roomname).field[0];
    }
}

module.exports = {Roomtest};