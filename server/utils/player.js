class Players{
    constructor(){
        this.players = [];
    }
    
    addPlayer(id, username, roomname, roommode, pno, hand,score){
        var gamestatus = "";
        var playstatus = "";
        var hand = [];
        var score = 0;
        var win = 0;
        var player = {id, username, roomname, roommode, pno, gamestatus, playstatus, hand, score, win};
        this.players.push(player);
        return player;
    }   
    
    getPlayer(id){
        try {
            return this.players.find((player)=> player.id === id); // ambil dari array users yang id nya sama
        } catch (error) {
            console.log('error getPlayer from player')
        }
    }

    getPlayerList(roomname){
        try {
            var playerList = this.players.filter((player) => player.roomname === roomname);
            return playerList;
        } catch (error) {
            console.log('error getPlayerList from player')
        }
    }

    getPlayerName(username){
        try {
            var player = this.players.find((player)=>player.username === username);
            if(player){
                var username= player.username;
                return username;
            }
        } catch (error) {
            console.log('error getPlayerName from player')
        }
    }

    getPlayerNames(roomname){
        try {
            var players = this.players.filter((player)=>player.roomname === roomname);
            var usernamesArray = players.map((player) => player.username);
            return usernamesArray;
        } catch (error) {
            console.log('error getPlayerNames from player')
        }
    }

    getPlayerRoom(id){
        try {
            var player = this.players.find((player)=>player.id === id);
            if(player){
                var roomname = player.roomname;
                return roomname;
            }
        } catch (error) {
            console.log('error getPlayerRoom from player')
        }
    }
    
    // liat turn semua player
    getPlayersNumb(roomPlayers , roomPlayerCount){
        try {
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
        } catch (error) {
            console.log('error getPlayersNumb from player')
        }
    }

    removePlayer(id){
        try {
            var player = this.getPlayer(id);
            if (player){
                this.players = this.players.filter((player)=> player.id != id);
            }
            return player;            
        } catch (error) {
            console.log('error removePlayer from player')
        }
    }
    
    removePlayersFromRoom(roomname){
        try {
            var player = this.getPlayerNames(roomname);
            if (player){
                this.players = this.players.filter((player)=> player.roomname != roomname);
            }
            return player;            
        } catch (error) {
            console.log('error removePlayersFromRoom from player')
        }
    }

    updatePlayStatus(id){
        try {
            var player = this.getPlayer(id);
            player.playstatus = "pass";
        } catch (error) {
            console.log('pass error from updatePlayStatus')
        }
    }
}
module.exports = {Players};