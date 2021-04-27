
const {Logic} = require('./logic');
var logic = new Logic();
const {LogicTaiwan} = require('./logicTaiwan')
var logicTaiwan = new LogicTaiwan();
const {Card} = require('./card');
var card = new Card();
const {CardTaiwan} = require('./cardTaiwan');
var cardTaiwan = new CardTaiwan();

var getRoomModeName = (roommode) =>{
    if (roommode === '0') return "International Mode";
    if (roommode === '1') return "Taiwanese Mode";
    if (roommode === '2') return "Double Penalty";
    if (roommode === '3') return "Panic Mode";
    if (roommode === '4') return "BOT";
}

var getRoomParams = (roommode) => {
    if (roommode === '3'){var timer = 5000}
    else {var timer = 20000}

    if(roommode ==='1'){var lowestCard = '3C'}
    else {var lowestCard = '3D'}

    return {
        'timeCount':timer,
        'lowestCard' : lowestCard        
    }
}

var modeSortingCards = (roommode, draw) => {
    if(roommode === "0" || roommode === "2" || roommode === "3" || roommode === "4") {
        return card.sortingCards(draw);
    }

    if(roommode === "1") {
        return cardTaiwan.sortingCards(draw);
    }
}

var getRoomMoveLogic = (roommode, turn, cardname, passCount, topField) =>{
    if(roommode === "0" || roommode === '2' || roommode === '3' || roommode === "4"){
        if(turn === 1){
            if(!logic.legalFirstMove(cardname)) return ("Must throw 3 Diamonds")
        }

        // check kartu yang di keluarin legal ga
        if(!logic.legalCard(cardname)){
            return ("Only can play single, pair or 5 cards combo");
        }

        if(turn > 1 && passCount != 3){
            if(!logic.legalMove(cardname, topField)) return (`${cardname} is less than ${topField}`)
        }
    }

    // check first turn ato bukan
    else if(roommode === "1"){
        if(turn === 1){
            if(!logicTaiwan.legalFirstMove(cardname)) return ("Must throw 3 Diamonds")
        }

        // check kartu yang di keluarin legal ga
        if(!logicTaiwan.legalCard(cardname)){
            return ("Only can play single, pair or 5 cards combo");
        }

        if(turn > 1 && passCount != 3){
            if(!logicTaiwan.legalMove(cardname, topField)) return (`${cardname} is less than ${topField}`)
        }
    }
}

var countRoomScore = (roommode, hand) => {
    if (roommode === '0' || roommode === '1'|| roommode === "3" || roommode === "4"){
        return hand.length
    }

    if(roommode === '2'){
        var penalty = hand.filter(c => c === '2D' || c === '2C' || c === '2H' || c === '2S')
        if (penalty.length > 0){
            return (hand.length * (2** penalty.length)); 
        }
        else{
            return hand.length
        }
    }
}
module.exports = {
    getRoomParams, 
    getRoomMoveLogic, 
    modeSortingCards,
    countRoomScore,
    getRoomModeName
};