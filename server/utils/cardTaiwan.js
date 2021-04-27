class CardTaiwan{
    constructor(){
        this.card = [
            {"name" : "3C",  "value" : 1,  "number": 3,  "image": "C"},
            {"name" : "3D",  "value" : 2,  "number": 3,  "image": "D"},
            {"name" : "3H",  "value" : 3,  "number": 3,  "image": "H"},
            {"name" : "3S",  "value" : 4,  "number": 3,  "image": "S"},

            {"name" : "4C",  "value" : 5,  "number": 4,  "image": "C"},
            {"name" : "4D",  "value" : 6,  "number": 4,  "image": "D"},
            {"name" : "4H",  "value" : 7,  "number": 4,  "image": "H"},
            {"name" : "4S",  "value" : 8,  "number": 4,  "image": "S"},

            {"name" : "5C",  "value" : 9, "number": 5,  "image": "C"},
            {"name" : "5D",  "value" : 10,  "number": 5,  "image": "D"},
            {"name" : "5H",  "value" : 11, "number": 5,  "image": "H"},
            {"name" : "5S",  "value" : 12, "number": 5,  "image": "S"},

            {"name" : "6C",  "value" : 13, "number": 6,  "image": "C"},
            {"name" : "6D",  "value" : 14, "number": 6,  "image": "D"},
            {"name" : "6H",  "value" : 15, "number": 6,  "image": "H"},
            {"name" : "6S",  "value" : 16, "number": 6,  "image": "S"},

            {"name" : "7C",  "value" : 17, "number": 7,  "image": "C"},
            {"name" : "7D",  "value" : 18, "number": 7,  "image": "D"},
            {"name" : "7H",  "value" : 19, "number": 7,  "image": "H"},
            {"name" : "7S",  "value" : 20, "number": 7,  "image": "S"},

            {"name" : "8C",  "value" : 21, "number": 8,  "image": "C"},
            {"name" : "8D",  "value" : 22, "number": 8,  "image": "D"},
            {"name" : "8H",  "value" : 23, "number": 8,  "image": "H"},
            {"name" : "8S",  "value" : 24, "number": 8,  "image": "S"},

            {"name" : "9C",  "value" : 25, "number": 9,  "image": "C"},
            {"name" : "9D",  "value" : 26, "number": 9,  "image": "D"},
            {"name" : "9H",  "value" : 27, "number": 9,  "image": "H"},
            {"name" : "9S",  "value" : 28, "number": 9,  "image": "S"},

            {"name" : "10C", "value" : 29, "number": 10, "image": "C"},
            {"name" : "10D", "value" : 30, "number": 10, "image": "D"},
            {"name" : "10H", "value" : 31, "number": 10, "image": "H"},
            {"name" : "10S", "value" : 32, "number": 10, "image": "S"},

            {"name" : "JC",  "value" : 33, "number": 11,  "image": "C"},
            {"name" : "JD",  "value" : 34, "number": 11,  "image": "D"},
            {"name" : "JH",  "value" : 35, "number": 11,  "image": "H"},
            {"name" : "JS",  "value" : 36, "number": 11,  "image": "S"},

            {"name" : "QC",  "value" : 37, "number": 12,  "image": "C"},
            {"name" : "QD",  "value" : 38, "number": 12,  "image": "D"},
            {"name" : "QH",  "value" : 39, "number": 12,  "image": "H"},
            {"name" : "QS",  "value" : 40, "number": 12,  "image": "S"},

            {"name" : "KC",  "value" : 41, "number": 13,  "image": "C"},
            {"name" : "KD",  "value" : 42, "number": 13,  "image": "D"},
            {"name" : "KH",  "value" : 43, "number": 13,  "image": "H"},
            {"name" : "KS",  "value" : 44, "number": 13,  "image": "S"},

            {"name" : "AC",  "value" : 45, "number": 14,  "image": "C"},
            {"name" : "AD",  "value" : 46, "number": 14,  "image": "D"},
            {"name" : "AH",  "value" : 47, "number": 14,  "image": "H"},
            {"name" : "AS",  "value" : 48, "number": 14,  "image": "S"},

            {"name" : "2C",  "value" : 49, "number": 15,  "image": "C"},
            {"name" : "2D",  "value" : 50, "number": 15,  "image": "D"},
            {"name" : "2H",  "value" : 51, "number": 15,  "image": "H"},
            {"name" : "2S",  "value" : 52, "number": 15,  "image": "S"}
        ]
    }
    sortingCards(card){
        var sortingValues = this.getCardValue(card).sort((a, b) => a - b);
        return this.getCardNames(sortingValues);
    }

    getCardNames(value){
        var names = []
        for (var i=0; i<value.length; i++){
            var name = this.card.find((c)=> c.value === value[i]).name;
            names.push(name);
        }
        return names;
    }

    getCardValue(cardname){
        var values = []
        for (var i=0; i<cardname.length; i++){
            var value = this.card.find((c)=> c.name === cardname[i]).value;
            values.push(value);
        }
        return values;
    }

    getCardNumber(cardname){
        var values = []
        for (var i=0; i<cardname.length; i++){
            var value = this.card.find((c)=> c.name === cardname[i]).number;
            values.push(value);
        }
        return values;
    }
    
    getCardImage(cardname){
        var values = []
        for (var i=0; i<cardname.length; i++){
            var value = this.card.find((c)=> c.name === cardname[i]).image;
            values.push(value);
        }
        return values;
    }

    isSingle(card){
        return card.length === 1;
    }

    isPair(cards){
        if (cards.length === 2){
            var cardNumb = this.getCardNumber(cards);
            return cardNumb[0] === cardNumb[1];
        }
        else return false
    }

    isTris(cards){
        if (cards.length === 3){
            var cardNumb = this.getCardNumber(cards);
            return cardNumb.every((numb, _ , arr) => numb === arr[0]);
        }
        else return false
    }

    isFours(cards){
        if (cards.length === 4){
            var cardNumb = this.getCardNumber(cards);
            return cardNumb.every((numb, _ , arr) => numb === arr[0]);
        }
        else return false
    }

    isStraight(cards){
        if (cards.length === 5) {
            var sortedCards = this.sortingCards(cards);
            var cardNumber = this.getCardNumber(sortedCards);
            var firstCard  = cardNumber[0];
            var secondCard = cardNumber[1];
            var thirdCard  = cardNumber[2];
            var fourthCard = cardNumber[3];
            var fifthCard  = cardNumber[4];
            if(firstCard === 11 && secondCard === 12 && thirdCard === 13 && fourthCard === 14 && fifthCard === 15) return false;
            if(firstCard === 3 && secondCard === 4 && thirdCard === 5 && fourthCard === 6 && fifthCard === 15) return true;
            if(firstCard === 3 && secondCard === 4 && thirdCard === 5 && fourthCard === 14 && fifthCard === 15) return true;
            return ((firstCard + 1) === secondCard && (secondCard + 1) === thirdCard && (thirdCard + 1) === fourthCard && (fourthCard + 1) === fifthCard); 
        }
        else return false;
    }
    
    isFlush(cards){
        if (cards.length === 5) {
            var cardImage= this.getCardImage(cards);
            return cardImage.every((img, _ , arr) => img === arr[0]);
        }
        else return false;     
    }

    isFullHouse(cards){
        if (cards.length === 5) {
            var array1 = cards;
            var array2 = [];
            array2.push(array1[0]);
            
            for(var i=0; i < cards.length -1 ; i++){
                var card1 = this.getCardNumber([array1[0]]);
                var card2 = this.getCardNumber([array1[i+1]]);
                if(card1[0] === card2[0]){
                    array2.push(array1[i+1]);
                }
            }
            
            array1 = array1.filter(x => array2.indexOf(x) === -1);
            return (this.isTris(array1) || this.isPair(array1)) && (this.isTris(array2) || this.isPair(array2))
        }
        else return false; 
    }

    isFourCards(cards){
        if (cards.length === 5) {
            var array1 = cards;
            var array2 = [];
            array2.push(array1[0]);
            
            for(var i=0; i < cards.length -1 ; i++){
                var card1 = this.getCardNumber([array1[0]]);
                var card2 = this.getCardNumber([array1[i+1]]);
                if(card1[0] === card2[0]){
                    array2.push(array1[i+1]);
                }
            }
            
            array1 = array1.filter(x => array2.indexOf(x) === -1);
            return (this.isFours(array1) || this.isSingle(array1)) && (this.isFours(array2) || this.isSingle(array2))
        }
        else return false; 
    }

    isStraightFlush(cards){
        return (this.isFlush(cards) && this.isStraight(cards));
    }

    isCombo(cards){
        return (this.isStraightFlush(cards) || this.isFourCards(cards) || this.isFullHouse(cards) || this.isFlush(cards) || this.isStraight(cards))
    }

    getTris(cards){
        var array1 = cards;
        var array2 = [];
        array2.push(array1[0]);
        
        for(var i=0; i < cards.length -1 ; i++){
            var card1 = this.getCardNumber([array1[0]]);
            var card2 = this.getCardNumber([array1[i+1]]);
            if(card1[0] === card2[0]){
                array2.push(array1[i+1]);
            }
        }
        array1 = array1.filter(x => array2.indexOf(x) === -1);

        return (array1.length === 3) ? array1 : array2;
    }

    getFourCards(cards){
        var array1 = cards;
        var array2 = [];
        array2.push(array1[0]);
        
        for(var i=0; i < cards.length -1 ; i++){
            var card1 = this.getCardNumber([array1[0]]);
            var card2 = this.getCardNumber([array1[i+1]]);
            if(card1[0] === card2[0]){
                array2.push(array1[i+1]);
            }
        }
        array1 = array1.filter(x => array2.indexOf(x) === -1);

        return (array1.length === 4) ? array1 : array2;
    }
    
    getPairScore(cards){
        return Math.max.apply(null, this.getCardValue(cards));
    }

    getComboScore(cards){
        if(this.isStraightFlush(cards)){
            return (5000 + Math.max.apply(null, this.getCardValue(cards)))
        }
        
        if (this.isFourCards(cards)){
            return (4000 + Math.max.apply(null, this.getCardValue(this.getFourCards(cards))))
        }

        if (this.isFullHouse(cards)){
            return (3000 + Math.max.apply(null, this.getCardValue(this.getTris(cards))))
        }

        if (this.isFlush(cards)){
            if(this.getCardImage(cards)[0] === "c") return (2000 + Math.max.apply(null, this.getCardValue(cards)));
            if(this.getCardImage(cards)[0] === "D") return (2250 + Math.max.apply(null, this.getCardValue(cards)));
            if(this.getCardImage(cards)[0] === "H") return (2500 + Math.max.apply(null, this.getCardValue(cards)));
            if(this.getCardImage(cards)[0] === "S") return (2750 + Math.max.apply(null, this.getCardValue(cards)));
        }

        if (this.isStraight(cards)){
            if (cards.includes('2S') || cards.includes('2H') || cards.includes('2C') || cards.includes('2D')){
                if (cards.includes('AS') || cards.includes('AH') || cards.includes('AC') || cards.includes('AD')){
                    var sortedCards = this.sortingCards(cards)
                    var removeTwo = sortedCards.slice(0,3)
                    return (1000 + Math.max.apply(null, this.getCardValue(removeTwo)))
                }
                else{
                    var sortedCards = this.sortingCards(cards)
                    var removeOne = sortedCards.slice(0,4)
                    return (1000 + Math.max.apply(null, this.getCardValue(removeOne)))
                }
            }
            return (1000 + Math.max.apply(null, this.getCardValue(cards)))
        };
    }
}

// module.exports.shuffle = shuffle;
module.exports = {CardTaiwan};