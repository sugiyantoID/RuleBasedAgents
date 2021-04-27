const {CardTaiwan} = require('./cardTaiwan');
var card = new CardTaiwan();

class LogicTaiwan{
    
    higherSingle(card1, card2){
        return (card.getCardValue(card1) - card.getCardValue(card2)) > 0;
    }
    
    higherPair(cards1, cards2){
        return (card.getPairScore(cards1) - card.getPairScore(cards2)) > 0;
    }

    higherCombo(cards1, cards2){
        return (card.getComboScore(cards1) - card.getComboScore(cards2)) > 0;
    }

    legalCard(cards){
        return card.isSingle(cards) || card.isPair(cards) || card.isCombo(cards); 
    }
    
    legalFirstMove(cards){
        if (this.legalCard){
            var hand = card.sortingCards(cards);
            return hand[0] === "3C";
        }
    }

    legalMove(cards1, cards2){
        if(this.legalCard(cards1) && this.legalCard(cards2)){
            if (card.isSingle(cards1) && card.isSingle(cards2)){
                return this.higherSingle(cards1, cards2);
            }
    
            if (card.isPair(cards1) && card.isPair(cards2)){
                return this.higherPair(cards1, cards2);
            }
            if (card.isCombo(cards1) && card.isCombo(cards2)){
                return this.higherCombo(cards1, cards2);
            }
        }
    }
}
module.exports = {LogicTaiwan};