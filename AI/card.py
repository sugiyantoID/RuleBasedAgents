# -*- coding: utf-8 -*-
"""
Created on Sun Mar 31 10:17:27 2019

"""

from random import shuffle
from collections import Counter

class Card:
    def __init__(self):
        self.card = [
            {"name" : "3D",  "value" : 1,  "number": 3,  "image": "D"},
            {"name" : "3C",  "value" : 2,  "number": 3,  "image": "C"},
            {"name" : "3H",  "value" : 3,  "number": 3,  "image": "H"},
            {"name" : "3S",  "value" : 4,  "number": 3,  "image": "S"},

            {"name" : "4D",  "value" : 5,  "number": 4,  "image": "D"},
            {"name" : "4C",  "value" : 6,  "number": 4,  "image": "C"},
            {"name" : "4H",  "value" : 7,  "number": 4,  "image": "H"},
            {"name" : "4S",  "value" : 8,  "number": 4,  "image": "S"},

            {"name" : "5D",  "value" : 9,  "number": 5,  "image": "D"},
            {"name" : "5C",  "value" : 10, "number": 5,  "image": "C"},
            {"name" : "5H",  "value" : 11, "number": 5,  "image": "H"},
            {"name" : "5S",  "value" : 12, "number": 5,  "image": "S"},

            {"name" : "6D",  "value" : 13, "number": 6,  "image": "D"},
            {"name" : "6C",  "value" : 14, "number": 6,  "image": "C"},
            {"name" : "6H",  "value" : 15, "number": 6,  "image": "H"},
            {"name" : "6S",  "value" : 16, "number": 6,  "image": "S"},

            {"name" : "7D",  "value" : 17, "number": 7,  "image": "D"},
            {"name" : "7C",  "value" : 18, "number": 7,  "image": "C"},
            {"name" : "7H",  "value" : 19, "number": 7,  "image": "H"},
            {"name" : "7S",  "value" : 20, "number": 7,  "image": "S"},

            {"name" : "8D",  "value" : 21, "number": 8,  "image": "D"},
            {"name" : "8C",  "value" : 22, "number": 8,  "image": "C"},
            {"name" : "8H",  "value" : 23, "number": 8,  "image": "H"},
            {"name" : "8S",  "value" : 24, "number": 8,  "image": "S"},

            {"name" : "9D",  "value" : 25, "number": 9,  "image": "D"},
            {"name" : "9C",  "value" : 26, "number": 9,  "image": "C"},
            {"name" : "9H",  "value" : 27, "number": 9,  "image": "H"},
            {"name" : "9S",  "value" : 28, "number": 9,  "image": "S"},

            {"name" : "10D", "value" : 29, "number": 10, "image": "D"},
            {"name" : "10C", "value" : 30, "number": 10, "image": "C"},
            {"name" : "10H", "value" : 31, "number": 10, "image": "H"},
            {"name" : "10S", "value" : 32, "number": 10, "image": "S"},

            {"name" : "JD",  "value" : 33, "number": 11,  "image": "D"},
            {"name" : "JC",  "value" : 34, "number": 11,  "image": "C"},
            {"name" : "JH",  "value" : 35, "number": 11,  "image": "H"},
            {"name" : "JS",  "value" : 36, "number": 11,  "image": "S"},

            {"name" : "QD",  "value" : 37, "number": 12,  "image": "D"},
            {"name" : "QC",  "value" : 38, "number": 12,  "image": "C"},
            {"name" : "QH",  "value" : 39, "number": 12,  "image": "H"},
            {"name" : "QS",  "value" : 40, "number": 12,  "image": "S"},

            {"name" : "KD",  "value" : 41, "number": 13,  "image": "D"},
            {"name" : "KC",  "value" : 42, "number": 13,  "image": "C"},
            {"name" : "KH",  "value" : 43, "number": 13,  "image": "H"},
            {"name" : "KS",  "value" : 44, "number": 13,  "image": "S"},

            {"name" : "AD",  "value" : 45, "number": 14,  "image": "D"},
            {"name" : "AC",  "value" : 46, "number": 14,  "image": "C"},
            {"name" : "AH",  "value" : 47, "number": 14,  "image": "H"},
            {"name" : "AS",  "value" : 48, "number": 14,  "image": "S"},

            {"name" : "2D",  "value" : 49, "number": 15,  "image": "D"},
            {"name" : "2C",  "value" : 50, "number": 15,  "image": "C"},
            {"name" : "2H",  "value" : 51, "number": 15,  "image": "H"},
            {"name" : "2S",  "value" : 52, "number": 15,  "image": "S"}]

        
    def shuffleDeck(self):
        deck = [i+1 for i in range (52)]
        shuffle(deck)
        deck = self.getCardNames(deck)
        return deck


    def getCardNames(self, values):
        names = []
        for i in range (len(values)):
            cardname = list(filter (lambda x : x['value'] == values[i], self.card))[0]['name']
            names.append(cardname)
        return names
    
    
    def getCardValues(self, cardnames):
        values = []
        for i in range (len(cardnames)):
            cardvalue = list(filter (lambda x : x['name'] == cardnames[i], self.card))[0]['value']
            values.append(cardvalue)
        return values
    
    
    def getCardNumbers(self, cardnames):
        numbers = []
        for i in range (len(cardnames)):
            cardnumb = list(filter (lambda x : x['name'] == cardnames[i], self.card))[0]['number']
            numbers.append(cardnumb)
        return numbers
    
    
    def getCardImage(self, cardnames):
        images = []
        for i in range (len(cardnames)):
            cardimg = list(filter (lambda x : x['name'] == cardnames[i], self.card))[0]['image']
            images.append(cardimg)
        return images
    
    
    def sortingCards(self, cardnames):
        values = self.getCardValues(cardnames)
        values.sort()
        cardName = self.getCardNames(values)
        return cardName
        
    
    def sortingPairs(self, pairs):
        tempPair = pairs
        sortedPair = []
        for i in range(len(pairs)):
            scorePair = [self.getPairScore(x) for x in tempPair]
            index = scorePair.index(min(scorePair))
            lowestPair = tempPair[index]
            sortedPair.append(lowestPair)
            tempPair = tempPair[:index] + tempPair[index+1:]
        return sortedPair
    
    
    def isSingle(self, card):
        return len(card) == 1
    
    
    def isPair(self, cardnames):
        if len(cardnames) == 2:
            values = self.getCardNumbers(cardnames)
            if len(set(values)) == 1: return True
        return False


    def isTris(self, cardnames):
        if len(cardnames) == 3:
            values = self.getCardNumbers(cardnames)
            if len(set(values)) == 1: return True
        return False


    def isFours(self, cardnames):
        if len(cardnames) == 4:
            values = self.getCardNumbers(cardnames)
            if len(set(values)) == 1: return True
        return False


    def isStraight(self, cardnames):
        if len(cardnames) == 5:
            sortedCards = self.sortingCards(cardnames)
            cardNumbers = self.getCardNumbers(sortedCards)
            x = cardNumbers
            if (x[0] == 11 and x[1] == 12 and x[2] == 13 and x[3] == 14 and x[4] == 15): return False
            if (x[0] == 3 and x[1] == 4 and x[2] == 5 and x[3] == 6 and x[4] == 15): return True
            if (x[0] == 3 and x[1] == 4 and x[2] == 5 and x[3] == 14 and x[4] == 15): return True
            return (x[0]+1 == x[1] and x[1]+1 == x[2] and x[2]+1 == x[3] and x[3]+1 == x[4])
        return False
        
    
    def isFlush(self, cardnames):
        if len(cardnames) == 5:
            cardImages = self.getCardImage(cardnames)
            if len(set(cardImages)) == 1: return True
        return False
    
    
    def isFullHouse(self, cardnames):
        if len(cardnames) == 5:
            sortedCards = self.sortingCards(cardnames)
            array1 = sortedCards[0:3]
            array2 = sortedCards[3:5]
            if (self.isTris(array1) and self.isPair(array2)): return True
            
            array1 = sortedCards[0:2]
            array2 = sortedCards[2:5]
            if (self.isTris(array2) and self.isPair(array1)): return True
        return False
        
    
    def isFourCards(self, cardnames):
        if len(cardnames) == 5:
            sortedCards = self.sortingCards(cardnames)
            array1 = sortedCards[0:4]
            array2 = sortedCards[1:5]
            if (self.isFours(array1) or self.isFours(array2)): return True
        return False
    
    
    def isStraightFlush(self, cardnames):
        return (self.isStraight(cardnames) and self.isFlush(cardnames))
    
    
    def isCombo(self, cardnames):
        return (self.isStraight(cardnames) or self.isFlush(cardnames) or
                self.isFullHouse(cardnames) or self.isFourCards(cardnames) or 
                self.isStraightFlush(cardnames))
    
    
    def getPair(self, cardnames):
        sortedCards = self.sortingCards(cardnames)
        pair = []
        for i in range (len(sortedCards) - 1):
            for j in range (i+1, len(sortedCards)):
                if self.getCardNumbers([sortedCards[i]]) == self.getCardNumbers([sortedCards[j]]):
                    pair.append([sortedCards[i], sortedCards[j]])
                else:
                    break
        if len(pair) > 0:
            return pair
        
        
    def getFixPair(self, cardnames):
        sortedCards = self.sortingCards(cardnames)
        pairs = []
        # Four cards
        fourCard = self.getFourCards(sortedCards)
        if fourCard:
            sortedCards = [x for x in sortedCards if not(any(x in cards for cards in fourCard))]
            for cards in fourCard:
                pairs.append([cards[0],cards[1]])
                pairs.append([cards[2],cards[3]])
        # Three cards
        trisCard = self.getTris(sortedCards)
        if trisCard:
            sortedCards = [x for x in sortedCards if not(any(x in cards for cards in trisCard))]
            for cards in trisCard:
                pairs.append([cards[0],cards[1]])
        # Pair
        pairCard = self.getPair(sortedCards)
        if pairCard:
            for cards in pairCard:
                pairs.append(cards)
        pair = self.sortingPairs(pairs)
        if len(pair) > 0:
            return pair
        
        
    def getTris(self, cardnames):
        sortedCards = self.sortingCards(cardnames)
        tris = []
        for i in range (len(sortedCards) - 2):
            for j in range (i+1, len(sortedCards)-1):
                for k in range (j+1, len(sortedCards)):
                    if self.getCardNumbers([sortedCards[i]]) == self.getCardNumbers([sortedCards[j]]) == self.getCardNumbers([sortedCards[k]]):
                        tris.append([sortedCards[i], sortedCards[j], sortedCards[k]])
        if len(tris) > 0:
            return tris
    
    
    def getFourCards (self, cardnames):
        sortedCards = self.sortingCards(cardnames)
        four = []
        for i in range (len(sortedCards) - 3):
            array = sortedCards[i:i+4]
            if self.isFours(array):
                four.append(array)
        if len(four) >0:
            return four
    
    
    def getStraight(self, cardnames):
        sortedCards = self.sortingCards(cardnames)
        straight = []
        if len(sortedCards) >=5:
            for i in range(len(sortedCards)-4):
                for j in range(i, len(sortedCards)-4):
                    for k in range(j, len(sortedCards)-4):
                        for l in range(k, len(sortedCards)-4):
                            for m in range(l, len(sortedCards)-4):
                                temp = (sortedCards[i], sortedCards[j+1], sortedCards[k+2], sortedCards[l+3], sortedCards[m+4])
                                if card.isStraight(list(temp)):
                                    if not(card.isStraightFlush(list(temp))):
                                        straight.append(list(temp))
        return straight
    
    
    def getFlush(self, cardnames):
        sortedCards = self.sortingCards(cardnames)
        flush = []
        if len(sortedCards) >=5:
            for i in range(len(sortedCards)-4):
                for j in range(i, len(sortedCards)-4):
                    for k in range(j, len(sortedCards)-4):
                        for l in range(k, len(sortedCards)-4):
                            for m in range(l, len(sortedCards)-4):
                                temp = (sortedCards[i], sortedCards[j+1], sortedCards[k+2], sortedCards[l+3], sortedCards[m+4])
                                if card.isFlush(list(temp)):
                                    if not(card.isStraightFlush(list(temp))):
                                        flush.append(list(temp))
        return flush
    
    
    def getFullHouse(self, cardnames):
        sortedCards = self.sortingCards(cardnames)
        fullhouse = []
        if len(sortedCards) >=5:
            for i in range(len(sortedCards)-4):
                for j in range(i, len(sortedCards)-4):
                    for k in range(j, len(sortedCards)-4):
                        for l in range(k, len(sortedCards)-4):
                            for m in range(l, len(sortedCards)-4):
                                temp = (sortedCards[i], sortedCards[j+1], sortedCards[k+2], sortedCards[l+3], sortedCards[m+4])
                                if card.isFullHouse(list(temp)):
                                    fullhouse.append(list(temp))
        return fullhouse
        

    def getFourCardsCombo(self, cardnames):
        sortedCards = self.sortingCards(cardnames)
        fourcards = []
        if len(sortedCards) >=5:
            for i in range(len(sortedCards)-4):
                for j in range(i, len(sortedCards)-4):
                    for k in range(j, len(sortedCards)-4):
                        for l in range(k, len(sortedCards)-4):
                            for m in range(l, len(sortedCards)-4):
                                temp = (sortedCards[i], sortedCards[j+1], sortedCards[k+2], sortedCards[l+3], sortedCards[m+4])
                                if card.isFourCards(list(temp)):
                                    fourcards.append(list(temp))
        return fourcards
    
    
    def getStraightFlush(self, cardnames):
        sortedCards = self.sortingCards(cardnames)
        straightflush = []
        if len(sortedCards) >=5:
            for i in range(len(sortedCards)-4):
                for j in range(i, len(sortedCards)-4):
                    for k in range(j, len(sortedCards)-4):
                        for l in range(k, len(sortedCards)-4):
                            for m in range(l, len(sortedCards)-4):
                                temp = (sortedCards[i], sortedCards[j+1], sortedCards[k+2], sortedCards[l+3], sortedCards[m+4])
                                if card.isStraightFlush(list(temp)):
                                    straightflush.append(list(temp))
        return straightflush
    
    def anyFlush(self, cardnames):
        countImage = Counter(self.getCardImage(cardnames)).values()
        return any(i >= 5 for i in countImage)
    
    def getCombo(self, cardnames):
        sortedCards = self.sortingCards(cardnames)
        tris = self.getTris(cardnames)
        fourCards = self.getFourCards(cardnames)
        comboLists = []
        thereFlush = self.anyFlush(cardnames)
        
        if len(sortedCards) >=5:
            for i in range(len(sortedCards)-4):
                for j in range(i, len(sortedCards)-4):
                    for k in range(j, len(sortedCards)-4):
                        for l in range(k, len(sortedCards)-4):
                            for m in range(l, len(sortedCards)-4):
                                temp = [sortedCards[i], sortedCards[j+1], sortedCards[k+2], sortedCards[l+3], sortedCards[m+4]]
                                
                                if len(cardnames) < 15:
                                    if(tris):
                                        # FULLHOUSE
                                        if card.isFullHouse(temp):
                                            comboLists.append(temp)
                                            continue
                                        
                                        if(fourCards):
                                            # FOURCARDS
                                            if card.isFourCards(temp):
                                                comboLists.append(temp)
                                                continue                         
                                    # STRAIGHT
                                    if card.isStraight(temp):
                                        if not(card.isStraightFlush(temp)):
                                            comboLists.append(temp)
                                            continue
                                    if thereFlush:
                                        # FLUSH
                                        if card.isFlush(temp):
                                            if not(card.isStraightFlush(temp)):
                                                comboLists.append(temp)
                                                continue
                                    if thereFlush:
                                        # STRAIGHTFLUSH
                                        if card.isStraightFlush(temp):
                                            comboLists.append(temp)
        return comboLists
    
    
    def getPairScore(self, cardnames):
        return max(self.getCardValues(cardnames))    
    
    def getComboScore(self, cardnames):
        if(self.isStraightFlush(cardnames)):
            if('2S' in cardnames or '2H' in cardnames or '2C' in cardnames or '2D' in cardnames):
                if('AS' in cardnames or 'AH' in cardnames or 'AC' in cardnames or 'AD' in cardnames):
                    sortedCards = self.sortingCards(cardnames)
                    removeTwo = sortedCards[:-2]
                    return (5000 + max(self.getCardValues(removeTwo)))
                else:
                    sortedCards = self.sortingCards(cardnames)
                    removeOne = sortedCards[:-1]
                    return (5000 + max(self.getCardValues(removeOne)))
            return (5000 + max(self.getCardValues(cardnames)))
        
        if(self.isFourCards(cardnames)):
            return (4000 + max(self.getCardValues(self.getFourCards(cardnames)[0])))
        
        if(self.isFullHouse(cardnames)):
            return (3000 + max(self.getCardValues(self.getTris(cardnames)[0])))
    
        if(self.isFlush(cardnames)):
            if(self.getCardImage(cardnames)[0] == "D"): return (2000 + max(self.getCardValues(cardnames)))
            if(self.getCardImage(cardnames)[0] == "C"): return (2250 + max(self.getCardValues(cardnames)))
            if(self.getCardImage(cardnames)[0] == "H"): return (2500 + max(self.getCardValues(cardnames)))
            if(self.getCardImage(cardnames)[0] == "S"): return (2750 + max(self.getCardValues(cardnames)))
    
        if(self.isStraight(cardnames)):
            if('2S' in cardnames or '2H' in cardnames or '2C' in cardnames or '2D' in cardnames):
                if('AS' in cardnames or 'AH' in cardnames or 'AC' in cardnames or 'AD' in cardnames):
                    sortedCards = self.sortingCards(cardnames)
                    removeTwo = sortedCards[:-2]
                    return (1000 + max(self.getCardValues(removeTwo)))
                else:
                    sortedCards = self.sortingCards(cardnames)
                    removeOne = sortedCards[:-1]
                    return (1000 + max(self.getCardValues(removeOne)))
            return (1000 + max(self.getCardValues(cardnames)))
    
card = Card()