class Playertest{
    constructor(){
        this.players = [
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
                "username": "d",
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
                "username": "b",
                "roomname": "1",
                "pno": 4,
                "hand": ["4D", "4H", "4S", "5D", "8H", "9H", "10D", "10H", "JC", "QD", "QH", "KC", "2H" ],
                "score": 0
              }
        ];
    }
    
    addPlayer(id, username, roomname, pno, hand,score){
        var hand = [];
        var score = 0;
        var player = {id, username, roomname, pno, hand, score};
        this.players.push(player);
        return player;
    }   
    
    getPlayer(id){
        return this.players.find((player)=> player.id === id); // ambil dari array users yang id nya sama
    }

    getPlayerList(roomname){
        var playerList = this.players.filter((player) => player.roomname === roomname);
        return playerList;
    }

    getPlayerName(username){
        var player = this.players.find((player)=>player.username === username);
        if(player){
            var username= player.username;
            return username;
        }
    }

    getPlayerNames(roomname){
        var players = this.players.filter((player)=>player.roomname === roomname);
        var usernamesArray = players.map((player) => player.username);
        return usernamesArray;
    }

    getPlayerRoom(id){
        var player = this.players.find((player)=>player.id === id);
        if(player){
            var roomname = player.roomname;
            return roomname;
        }
    }
    
    // liat turn semua player
    getPlayersNumb(roomPlayers , roomPlayerCount){
        var playersNumb = [];
        var i;
        for(i=0; i<roomPlayerCount; i++){
            var p = roomPlayers[i].username;
            var no = roomPlayers[i].pno;
            var obj = {};
            obj['username'] = p;
            obj['numb'] = no;
            playersNumb.push(obj);
        }
        return playersNumb;
    }

    removePlayer(id){
        var player = this.getPlayer(id);
        if (player){
            this.players = this.players.filter((player)=> player.id != id);
        }
        return player;
    }

    updatePlayerHand(id, hand){
        var player = this.getPlayer(id);
        player.hand = hand;
    }
}
module.exports = {Playertest};