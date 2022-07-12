# -*- coding: utf-8 -*-
"""
Created on Mon Apr  8 15:57:58 2019

"""

from logic import Logic
from card import Card

logic = Logic()
card = Card()

def enemyProbably(hand, field_history):
    allcards = [d['name'] for d in card.card]
    unseen = list(set(allcards).difference(set(hand).union(set(field_history))))
    enemyLists = []
    # Single
    [enemyLists.append([x]) for x in unseen]
    # Pair
    pairLists = card.getPair(unseen)
    if pairLists:
        [enemyLists.append(x) for x in pairLists]
    if len(unseen) > 15:
        tempUnseen = card.sortingCards(unseen)
        tempUnseen = tempUnseen[-15:]
        comboLists = card.getCombo(tempUnseen)
    else:
        comboLists = card.getCombo(unseen)
    if comboLists:
        [enemyLists.append(x) for x in comboLists]
    return enemyLists

def findMaxValue(hand):
    value = []
    for cards in hand:
        value.append(max(card.getCardValues(cards)))
    return max(value)

def comboSelection(hand):
    tempCombo = card.getCombo(hand)
    comboCombination = []
    for combo in tempCombo:
        otherCombo = card.getCombo(list(set(hand).difference(set(combo))))
        if otherCombo:
            for oCombo in otherCombo:
                comboCombination.append([combo,oCombo])
    if len(comboCombination) == 0:
        comboCombination = tempCombo

    handLeft = []
    selectedCombo = []
    if len(comboCombination) > 0:
        for combo in comboCombination:
            if len(combo) == 2:
                cardLeft = [x for x in hand if x not in combo[0] and x not in combo[1]]
                
                trisCard = card.getTris(cardLeft)
                if len(selectedCombo) == 0:
                    if trisCard:
                        usedCard = []
                        for tris in trisCard:
                            handLeft.append(tris)
                            for _ in tris:
                                usedCard.append(_)

                        cardLeft = [x for x in cardLeft if x not in usedCard]

                    pairCard = card.getPair(cardLeft)
                    if pairCard:
                        usedCard = []
                        for pair in pairCard:
                            handLeft.append(pair)
                            for _ in pair:
                                usedCard.append(_)

                        cardLeft = [x for x in cardLeft if x not in usedCard]

                    for _ in cardLeft:
                        handLeft.append([_])

                    selectedCombo = combo

                elif len(selectedCombo) > 0:
                    tempHandLeft = []
                    if trisCard:
                        usedCard = []
                        for tris in trisCard:
                            tempHandLeft.append(tris)
                            for _ in tris:
                                usedCard.append(_)

                        cardLeft = [x for x in cardLeft if x not in usedCard]

                    pairCard = card.getPair([x for x in cardLeft])
                    if pairCard:
                        usedCard = []
                        for pair in pairCard:
                            tempHandLeft.append(pair)
                            for _ in pair:
                                usedCard.append(_)

                        cardLeft = [x for x in cardLeft if x not in usedCard]

                    for _ in cardLeft:
                        tempHandLeft.append([_])

                    tempHandLeftScore = 0 if tempHandLeft == [] else findMaxValue(tempHandLeft)
                    handLeftScore = 0 if handLeft == [] else findMaxValue(handLeft)     
                    
                    selectedComboScore = [card.getComboScore(selectedCombo[0]), card.getComboScore(selectedCombo[1])]
                    tempComboScore = [card.getComboScore(combo[0]), card.getComboScore(combo[1])]
                    
                    if handLeftScore < tempHandLeftScore:
                        handLeft = tempHandLeft
                        selectedCombo = combo

                    elif handLeftScore == tempHandLeftScore:
                        if len(handLeft) > len(tempHandLeft):
                            handLeft = tempHandLeft
                            selectedCombo = combo
                        
                        elif len(handLeft) == len(tempHandLeft):
                            if max(selectedComboScore)+250 < max(tempComboScore):
                                handLeft = tempHandLeft
                                selectedCombo = combo

            elif len(combo) == 5:
                cardLeft = [x for x in hand if x not in combo]
                fourCard = card.getFourCards(cardLeft)
                
                if len(selectedCombo) == 0:
                    if fourCard:
                        usedCard = []
                        for four in fourCard:
                            handLeft.append(four)
                            for _ in four:
                                usedCard.append(_)

                        cardLeft = [x for x in cardLeft if x not in usedCard]
                    
                    trisCard = card.getTris(cardLeft)
                    if trisCard:
                        usedCard = []
                        for tris in trisCard:
                            handLeft.append(tris)
                            for _ in tris:
                                usedCard.append(_)

                        cardLeft = [x for x in cardLeft if x not in usedCard]

                    pairCard = card.getPair(cardLeft)
                    if pairCard:
                        usedCard = []
                        for pair in pairCard:
                            handLeft.append(pair)
                            for _ in pair:
                                usedCard.append(_)

                        cardLeft = [x for x in cardLeft if x not in usedCard]

                    for _ in cardLeft:
                        handLeft.append([_])

                    selectedCombo = [combo]
                
                elif len(selectedCombo) > 0:
                    tempHandLeft = []
                    if fourCard:
                        usedCard = []
                        for four in fourCard:
                            tempHandLeft.append(four)
                            for _ in four:
                                usedCard.append(_)

                        cardLeft = [x for x in cardLeft if x not in usedCard]
                    
                    trisCard = card.getTris(cardLeft)
                    if trisCard:
                        usedCard = []
                        for tris in trisCard:
                            tempHandLeft.append(tris)
                            for _ in tris:
                                usedCard.append(_)

                        cardLeft = [x for x in cardLeft if x not in usedCard]

                    pairCard = card.getPair([x for x in cardLeft])
                    if pairCard:
                        usedCard = []
                        for pair in pairCard:
                            tempHandLeft.append(pair)
                            for _ in pair:
                                usedCard.append(_)

                        cardLeft = [x for x in cardLeft if x not in usedCard]

                    for _ in cardLeft:
                        tempHandLeft.append([_])
                        
                    tempHandLeftScore = 0 if tempHandLeft == [] else findMaxValue(tempHandLeft)
                    handLeftScore = 0 if handLeft == [] else findMaxValue(handLeft)     
                        
                    selectedComboScore = card.getComboScore(selectedCombo[0])
                    tempComboScore = card.getComboScore(combo)
                    
                    if handLeftScore < tempHandLeftScore:
                        handLeft = tempHandLeft
                        selectedCombo = [combo]

                    elif handLeftScore == tempHandLeftScore:
                        if len(handLeft) > len(tempHandLeft):
                            handLeft = tempHandLeft
                            selectedCombo = [combo]
                        
                        elif len(handLeft) == len(tempHandLeft):
                            if selectedComboScore+250 < tempComboScore:
                                handLeft = tempHandLeft
                                selectedCombo = [combo]
                                   
    return selectedCombo

def cardClassifier(hand, field_history, min_hand):
    probCards = enemyProbably(hand, field_history)
    probSingle = []
    probPair = []
    probCombo = []
    classASP = []
    classA = []
    classB = []
    classC = []
    classD = []
    for i in probCards:
        if len(i) == 1:
            probSingle.append(i[0])
        if len(i) == 2:
            probPair.append(i)
        if len(i) == 5:
            probCombo.append(i)

    # find max and min single
    probSingle = card.sortingCards(probSingle)
    maxSingle = max(card.getCardValues(probSingle))
    minSingle = min(card.getCardValues(probSingle))
    divSingleIndex = int(len(probSingle) * 0.8)
    divSingle = card.getCardValues(probSingle)[divSingleIndex]

    # find max and min pair
    if len(probPair) > 0:
        sortedPair = card.sortingPairs(probPair)
        pairScore = [card.getPairScore(x) for x in sortedPair]
        maxPair = max(pairScore)
        minPair = min(pairScore)
        divPairIndex = int(len(sortedPair) * 0.7)
        divPair = card.getPairScore(sortedPair[divPairIndex])

    # find max and min combo
    maxCombo = 3034
    minCombo = 1029
    divCombo = 2500
    if len(probCombo) > 0:
        tempCombo = probCombo
        sortedCombo = []
        for i in range(len(probCombo)):
            scoreCombo = [card.getComboScore(x) for x in tempCombo]
            index = scoreCombo.index(min(scoreCombo))
            lowestCombo = tempCombo[index]
            sortedCombo.append(lowestCombo)
            tempCombo = tempCombo[:index] + tempCombo[index+1:]

        comboScore = [card.getComboScore(x) for x in sortedCombo]
        maxCombo = max(comboScore)
        minCombo = min(comboScore)
        divComboIndex = int(len(sortedCombo) * 0.7)
        divCombo = card.getComboScore(sortedCombo[divComboIndex])

    # ASP = A single or A pair
    for i in hand:
        value = card.getCardValues([i])[0]
        # find classA single
        if value > maxSingle:
            classA.append([i])
            classASP.append(i)
        # find classB single
        if value > divSingle and value < maxSingle:
            classB.append([i])
        # find classC single
        if value <= divSingle and value > minSingle:
            classC.append([i])
        #find classD single
        if value < minSingle:
            classD.append([i])

    pairs = []
    pairLists = card.getPair(hand)
    if pairLists:
        [pairs.append(x) for x in pairLists]
        pairs = card.sortingPairs(pairs)

    if len(probPair) > 0:
        for i in pairs:
            value = card.getPairScore(i)
            # find classA pair
            if value > maxPair:
                classA.append(i)
                classASP.append(i[0])
                classASP.append(i[1])
            # find classB pair
            if value > divPair and value < maxPair:
                classB.append(i)
            # find classC pair
            if value <= divPair and value > minPair:
                classC.append(i)
            # find classD pair
            if value < minPair:
                classD.append(i)
    elif len(probPair) == 0:
        for i in pairs:
            classA.append(i)
            classASP.append(i[0])
            classASP.append(i[1])

    classASP = list(set(classASP))
    combos = [] 
    comboLists = comboSelection(hand)
    if comboLists:
        [combos.append(x) for x in comboLists]

    for i in combos:
        value = card.getComboScore(i)
        # find classA combo
        if value > maxCombo:
            classA.append(i)
        # find classB combo
        if value > divCombo and value < maxCombo:
            classB.append(i)
        # find classC combo
        if value <= divCombo and value > minCombo:
            classC.append(i)
        # find classD pair
        if value < minCombo:
            classD.append(i)
            
    return {'classA':classA,
            'classB':classB,
            'classC':classC,
            'classD':classD}
            
def twoCard(hand, classA, enemy1, enemy2, enemy3):
    handPair = card.getPair(hand)
    if handPair:
        return handPair[0]
    elif classA or (1 in [enemy1, enemy2, enemy3]):
        return [hand[1]]
    return [hand[0]]


def threeCard(hand, classA, classB, classC, classD, enemy1, enemy2, enemy3):
    handPair = card.getFixPair(hand)
    if handPair:
        filterSingle = [[x] for x in hand if not(any(x in Pair for Pair in handPair))]
        if classA:
            # 1 pair in class A
            if handPair[0] in classA:
                return handPair[0]     
            # single cards in class A
            elif filterSingle[0] in classA:
                return filterSingle[0]
        # If opponent single, play pair
        elif 1 in [enemy1, enemy2, enemy3]:
            return handPair[0]
        # If opponent 2 cards, play single
        elif 2 in [enemy1, enemy2, enemy3]:
            return filterSingle[0]
        else:
            if classD: return classD[0]
            if classC: return classC[0]
            if classB: return classB[0]
            if classA: return classA[0] 
    # All single cards
    else:
        if 1 in [enemy1, enemy2, enemy3]:
            if classA:
                if hand[2] in classA:
                    return [hand[1]]
                return [hand[2]]
            return [hand[2]]
        elif classA:
            if hand[2] in classA:
                return [hand[1]]
            return [hand[0]]
        return [hand[0]]

# Four cards left
def fourCard(hand, classA, classB, classC, classD, enemy1, enemy2, enemy3):
    # Check pair
    handPair = card.getFixPair(hand)
    if handPair:
        # Double pairs
        if len(handPair) == 2:
            sortedPair = card.sortingPairs(handPair)
            if classA:
                if sortedPair[1] in classA:
                    return sortedPair[1]
                return sortedPair[0]
            elif 2 in [enemy1, enemy2, enemy3]:
                return sortedPair[1]
            return sortedPair[0]
        # One pair
        elif len(handPair) == 1:
            filterSingle = [[x] for x in hand if not(any(x in Pair for Pair in handPair))]
            if classA:
                # single cards in class A
                if filterSingle[1] in classA:
                    return filterSingle[0]
                # If enemy single, play pair
                elif 1 in [enemy1, enemy2, enemy3]:
                    return handPair[0]
                # If enemy 2 cards, play single
                elif 2 in [enemy1, enemy2, enemy3]:
                    return filterSingle[0]
                return filterSingle[1]
            else:
                if classD: return classD[0]
                if classC: return classC[0]
                if classB: return classB[0]
                if classA: return classA[0]
    # All single cards
    else:
        if classA:
            return [hand[1]]
        elif 1 in [enemy1, enemy2, enemy3]:
            return [hand[3]]
        return [hand[0]]

# Cards left <= 4
def underFour(hand, classA, classB, classC, classD, enemy1, enemy2, enemy3):
    if len(hand) == 2:
        return twoCard(hand, classA, enemy1, enemy2, enemy3)
    elif len(hand) == 3:
        return threeCard(hand, classA, classB, classC, classD, enemy1, enemy2, enemy3)
    elif len(hand) == 4:
        return fourCard(hand, classA, classB, classC, classD, enemy1, enemy2, enemy3)
    return [hand[0]]

# Cards left > 4
def overFour(hand, classA, classB, classC, classD, enemy1, enemy2, enemy3):
    comboCard = findComboInClass(classD) + findComboInClass(classC) + findComboInClass(classB) + findComboInClass(classA)
    pairCard = findPairInClass(classD) + findPairInClass(classC) + findPairInClass(classB) + findPairInClass(classA)
    singleCard = findSingleInClass(classD) + findSingleInClass(classC) + findSingleInClass(classB) + findSingleInClass(classA)
    if 1 in [enemy1, enemy2, enemy3]:
        if comboCard:
            return comboCard[0]
        elif pairCard:
            return pairCard[0]
        else:
            if classD: return classD[0]
            if classC: return classC[0]
            if classB: return classB[0]
            if classA: return classA[0]
    else:
        if (not comboCard) and (len(pairCard) > len(singleCard)):
            return pairCard[0]
        else:
            if classD: return classD[0]
            if classC: return classC[0]
            if classB: return classB[0]
            if classA: return classA[0]
                
def checkHoldback(hand, field, enemy1, enemy2, enemy3, turn, pass_turn, classA, classB, classC, classD, selected_card):
    # Holdback Single
    if len(field) == 1:
        if len(hand) <= 2:
            return False
        if min(enemy1, enemy2, enemy3) <= 2 and selected_card == [hand[-1]]:
            return False
        if len(classA) < (len(classB) + len(classC) + len(classD)):
            if selected_card == [hand[-1]]:
                return True
        if min([len(hand), enemy1, enemy2, enemy3]) > 6:
            if selected_card == [hand[-1]]:
                return True
    # Holdback Pair
    if len(field) == 2:
        if len(hand) <= 3:
            return False
        if min([len(hand), enemy1, enemy2, enemy3]) > 2:
            if card.getPairScore(selected_card) >= 50:
                return True
    # Holdback Combo
    if len(field) == 5:
        if len(hand) == 5:
            return False
        if min([len(hand), enemy1, enemy2, enemy3]) > 6 and turn <= 4:
            # Check any enemy pass
            if 1 in pass_turn.values():
                # Check any combo from card left
                cardLeft = list(set(hand).difference(set(selected_card)))
                tempCombo = card.getCombo(cardLeft)
                if len(tempCombo) > 0 and (selected_card in classA or selected_card in classB):
                    return True
    return False

def findSingleInClass(className):
    return [x for x in className if len(x) == 1]
def findPairInClass(className):
    return [x for x in className if len(x) == 2]
def findComboInClass(className):
    return [x for x in className if len(x) == 5]

def splitTrisToSingleAndPair(className):
    splitedPair = []
    splitedSingle = []
    pairCards = []
    trisCards = []
    pairs = findPairInClass(className)
    if pairs:
        for pair in pairs:
            pairCards.append(pair[0])
            pairCards.append(pair[1])
        pairCards = card.sortingCards(list(set(pairCards)))
        
        trisInClass = card.getTris(pairCards)
        if trisInClass:
            for tris in trisInClass:
                trisCards.append(tris[0])
                trisCards.append(tris[1])
                trisCards.append(tris[2])
                splitedPair.append(tris[0:2]) 
                splitedSingle.append([tris[2]]) 
            
            pairFromTris = card.getPair(trisCards)
            classResult = [x for x in className if x not in pairFromTris]
            for x in splitedPair: classResult.append(x)
            for x in splitedSingle: classResult.append(x)
            return classResult
    return className


def maxPairInCombo(comboCard):
    # Pair in two combo
    if (card.isFourCards(comboCard[0]) or card.isFullHouse(comboCard[0])) and (card.isFourCards(comboCard[1]) or card.isFullHouse(comboCard[1])):
        tempCard1 = comboCard[0]
        tempPair1 = card.getPair(tempCard1)
        tempCombo1 = [card.getPairScore(x) for x in tempPair1]
        tempCard2 = comboCard[1]
        tempPair2 = card.getPair(tempCard2)
        tempCombo2 = [card.getPairScore(x) for x in tempPair2]
        if max(tempCombo1) > max(tempCombo2):
            return [comboCard[0]]
        return [comboCard[1]]
    # Pair only in one combo
    else:
        if card.isFourCards(comboCard[0]) or card.isFullHouse(comboCard[0]):
            return [comboCard[0]]
        return [comboCard[1]]

def splitComboToPair(comboCard):
    splitResult = []
    # Four cards
    if card.isFourCards(comboCard[0]):
        fourInCombo = card.getFourCards(comboCard[0])
        for x in fourInCombo:
            splitResult.append(x[0:2])
            splitResult.append(x[2:4])
    # Full house
    elif card.isFullHouse(comboCard[0]):
        trisInCombo = card.getTris(comboCard[0])
        splitResult.append([x for x in comboCard[0] if x not in trisInCombo[0]])
        for x in trisInCombo:
            splitResult.append(x[0:2])
        splitResult = card.sortingPairs(splitResult)
    # Straight, Flush, and Straight Flush
    else:
        splitResult = []
    return splitResult

def pairInCombo(comboCard, moveLists, enemy1, enemy2, enemy3):
    # Double combo
    if len(comboCard) == 2:
        if (card.isFourCards(comboCard[0]) or card.isFullHouse(comboCard[0])) or (card.isFourCards(comboCard[1]) or card.isFullHouse(comboCard[1])):
            comboCard = maxPairInCombo(comboCard)
            splitResult = splitComboToPair(comboCard)
            if 2 in [enemy1, enemy2, enemy3]:
                for cards in reversed(splitResult):
                    if cards in moveLists: return cards
                return []
            else:
                for cards in splitResult:
                    if cards in moveLists: return cards
                return []
        return []
    # Single combo
    if len(comboCard) == 1:
        if (card.isFourCards(comboCard[0]) or card.isFullHouse(comboCard[0])):
            comboCard = [comboCard[0]]
            splitResult = splitComboToPair(comboCard)
            if 2 in [enemy1, enemy2, enemy3]:
                for cards in reversed(splitResult):
                    if cards in moveLists: return cards
                return []
            else:
                for cards in splitResult:
                    if cards in moveLists: return cards
                return []
        return []

def maxSingleInCombo(comboCard):
    tempCombo1 = [card.getCardValues([x]) for x in comboCard[0]]
    tempCombo2 = [card.getCardValues([x]) for x in comboCard[1]]    
    if max(tempCombo1) > max(tempCombo2):
        return [comboCard[0]]
    return [comboCard[1]]


def splitComboToSingle(comboCard):
    return [[x] for x in comboCard[0]]

def singleInCombo(comboCard, moveLists, enemy1, enemy2, enemy3):
    if len(comboCard) == 2:
        comboCard = maxSingleInCombo(comboCard)
    splitResult = splitComboToSingle(comboCard)
    if 1 in [enemy1, enemy2, enemy3]:
        for cards in reversed(splitResult):
            if cards in moveLists: return cards
        return []
    else:
        for cards in splitResult:
            if cards in moveLists: return cards
        return []

def splitPairToSingle(pairCard):
    return [[x] for x in pairCard[-1]]

def splitMove(field, moveLists, comboCard, pairCard, singleCard, enemy1, enemy2, enemy3):
    # # Field combo
    if len(field) == 5:
        if comboCard:
            for cards in comboCard:
                if cards in moveLists: return cards
            return []
        return []
    # Field pair
    if len(field) == 2:
        if pairCard:
            if 2 in [enemy1, enemy2, enemy3]:
                for cards in reversed(pairCard):
                    if cards in moveLists: return cards
                else:
                    # Split combo
                    if comboCard:
                        return pairInCombo(comboCard, moveLists, enemy1, enemy2, enemy3)
                    return [] 
            else:
                for cards in pairCard:
                    if cards in moveLists: return cards
                else:
                    # Split combo
                    if comboCard:
                        return pairInCombo(comboCard, moveLists, enemy1, enemy2, enemy3)
                    return [] 
        else:
            # Split combo
            if comboCard:
                return pairInCombo(comboCard, moveLists, enemy1, enemy2, enemy3)
            return [] 
    # Field single
    if len(field) == 1:
        if singleCard:
            for cards in reversed(singleCard):
                if cards in moveLists: return cards
            else:
                # Split pair
                if pairCard:
                    splitResult = splitPairToSingle(pairCard)
                    for cards in splitResult:
                        if cards in moveLists: return cards
                    else:
                        # Split combo
                        if comboCard:
                            return singleInCombo(comboCard, moveLists, enemy1, enemy2, enemy3)
                        return []
                # Split combo
                if comboCard:
                    return singleInCombo(comboCard, moveLists, enemy1, enemy2, enemy3)
                return []
        else:                
            # Split pair
            if pairCard:
                splitResult = splitPairToSingle(pairCard)
                for cards in splitResult:
                    if cards in moveLists: return cards
                else:
                    # Split combo
                    if comboCard:
                        return singleInCombo(comboCard, moveLists, enemy1, enemy2, enemy3)
                    return []
            # Split combo
            if comboCard:
                return singleInCombo(comboCard, moveLists, enemy1, enemy2, enemy3)
            return []

def notControlMove(field, moveLists, comboCard, pairCard, singleCard, enemy1, enemy2, enemy3):
    # Field Combo
    if len(field) == 5:
        if comboCard:
            for cards in comboCard:
                if cards in moveLists: return cards
            return []
        return []
    # Field pair
    if len(field) == 2:
        if pairCard:
            if 2 in [enemy1, enemy2, enemy3]:
                for cards in reversed(pairCard):
                    if cards in moveLists: return cards
                return []
            else:
                for cards in pairCard:
                    if cards in moveLists: return cards
                return []
        return [] 
    # Field single
    if len(field) == 1:
        if singleCard:
            for cards in reversed(singleCard):
                if cards in moveLists: return cards
            return []
        return []
                
def advanceStrategy(hand, field, moveLists, pass_turn, classA, classB, classC, classD, enemy1, enemy2, enemy3, control, moveLen):
    classASingle = findSingleInClass(classA)
    classAPair = findPairInClass(classA)
    classACombo = findComboInClass(classA)

    classBSingle = findSingleInClass(classB)
    classBPair = findPairInClass(classB)
    classBCombo = findComboInClass(classB)

    classCSingle = findSingleInClass(classC)
    classCPair = findPairInClass(classC)
    classCCombo = findComboInClass(classC)

    classDSingle = findSingleInClass(classD)
    classDPair = findPairInClass(classD)
    classDCombo = findComboInClass(classD)

    comboCard = classDCombo + classCCombo + classBCombo + classACombo
    pairCard = classDPair + classCPair + classBPair + classAPair
    singleCard = classDSingle + classCSingle + classBSingle + classASingle
    
    if moveLen <= 2:
        if control:
            if len(classA) > 0:
                return classA[0]
            else:
                if comboCard:
                    return comboCard[0]
                if pairCard:
                    if 2 in [enemy1, enemy2, enemy3]:
                        return pairCard[-1]
                    return pairCard[0]
                if singleCard:
                    return singleCard[-1]
                return []

        if not control:
            if min(enemy1, enemy2, enemy3) <= 2:
                return splitMove(field, moveLists, comboCard, pairCard, singleCard, enemy1, enemy2, enemy3)
            # Opponent cards > 2
            else:
                return notControlMove(field, moveLists, comboCard, pairCard, singleCard, enemy1, enemy2, enemy3)
            
    if moveLen == 3:
        if control:
            if len(classA) > 1:
                return classA[0]
            else:
                if comboCard:
                    return comboCard[0]
                if pairCard:
                    if 2 in [enemy1, enemy2, enemy3]:
                        return pairCard[-1]
                    return pairCard[0]
                if singleCard:
                    return singleCard[-1]
                return []

        if not control:
            if min(enemy1, enemy2, enemy3) <= 2:
                return splitMove(field, moveLists, comboCard, pairCard, singleCard, enemy1, enemy2, enemy3)
            # Opponent cards > 2
            else:
                return notControlMove(field, moveLists, comboCard, pairCard, singleCard, enemy1, enemy2, enemy3)

def moveSelection(hand, field, turn, pass_turn, classA, classB, classC, classD, enemy1, enemy2, enemy3, control, cardClass, moveLists):
    classAlen = len(classA)
    classBlen = len(classB)
    classClen = len(classC)
    classDlen = len(classD)
    
    tempClassA = classA
    tempClassB = classB
    tempClassC = classC
    tempClassD = classD

    moveLen = classAlen + classBlen + classClen + classDlen
    if moveLen <= 3 and len(hand) > 4:
        return advanceStrategy(hand, field, moveLists, pass_turn, classA, classB, classC, classD, enemy1, enemy2, enemy3, control, moveLen)

    if turn == 0:
        classA = [x for x in classA if x in moveLists]
        classB = [x for x in classB if x in moveLists]
        classC = [x for x in classC if x in moveLists]
        classD = [x for x in classD if x in moveLists]
        if classD: return classD[0]
        if classC: return classC[0]
        if classB: return classB[0]
        if classA: return classA[0]

    if classAlen > (classClen + classDlen + classBlen) and classAlen > 0:
        classA = [x for x in classA if x in moveLists]
        if classA: return classA[0]
            
    if control:
        if len(hand) <= 4:
            selected_card = underFour(hand, classA, classB, classC, classD, enemy1, enemy2, enemy3)
            return selected_card
        else:
            selected_card = overFour(hand, classA, classB, classC, classD, enemy1, enemy2, enemy3)
            return selected_card

    if not control:
        
        if len(field) == 1:            
            bigPair = findPairInClass(classA)
            if bigPair:
                bigSingle = bigPair[-1]
                classA.append([bigSingle[0]])
                classA.append([bigSingle[1]])
        
        classA = [x for x in classA if x in moveLists]
        classB = [x for x in classB if x in moveLists]
        classC = [x for x in classC if x in moveLists]
        classD = [x for x in classD if x in moveLists]

        if 1 in [enemy1, enemy2, enemy3]:
            comboCard = findComboInClass(classD) + findComboInClass(classC) + findComboInClass(classB) + findComboInClass(classA)
            pairCard = findPairInClass(classD) + findPairInClass(classC) + findPairInClass(classB) + findPairInClass(classA)
            singleCard = findSingleInClass(classD) + findSingleInClass(classC) + findSingleInClass(classB) + findSingleInClass(classA)
            return splitMove(field, moveLists, comboCard, pairCard, singleCard, enemy1, enemy2, enemy3)
        if classD:
            for selected_card in classD:
                if not checkHoldback(hand, field, enemy1, enemy2, enemy3, turn, pass_turn, tempClassA, tempClassB, tempClassC, tempClassD, selected_card):
                    return selected_card
        if classC:
            for selected_card in classC:
                if not checkHoldback(hand, field, enemy1, enemy2, enemy3, turn, pass_turn, tempClassA, tempClassB, tempClassC, tempClassD, selected_card):
                    return selected_card
        if classB:
            for selected_card in classB:
                if not checkHoldback(hand, field, enemy1, enemy2, enemy3, turn, pass_turn, tempClassA, tempClassB, tempClassC, tempClassD, selected_card):
                    return selected_card
        if classA:
            for selected_card in classA:
                if not checkHoldback(hand, field, enemy1, enemy2, enemy3, turn, pass_turn, tempClassA, tempClassB, tempClassC, tempClassD, selected_card):
                    return selected_card
        return []

def predictedMove(hand, field, control, turn, field_history, enemy1, enemy2, enemy3, pass_turn):
    
    if type(hand) != list:
        hand = hand.translate({ord('"'):None})
        hand = hand.translate({ord(']'):None})
        hand = hand.translate({ord('['):None})
        hand = hand.translate({ord("'"):None})
        hand = hand.translate({ord(' '):None})
        hand = hand.split(",")

    if type(field) != list:
        if field == "[',']":
            field = []
        else:
            field = field.translate({ord('"'):None})
            field = field.translate({ord(']'):None})
            field = field.translate({ord('['):None})
            field = field.translate({ord("'"):None})
            field = field.translate({ord(' '):None})
            field = field.split(",")

    if type(field_history) != list:
        if field_history == "[',']":
            field_history = []
        else:
            field_history = field_history.translate({ord('"'):None})
            field_history = field_history.translate({ord(']'):None})
            field_history = field_history.translate({ord('['):None})
            field_history = field_history.translate({ord("'"):None})
            field_history = field_history.translate({ord(' '):None})
            field_history = field_history.split(",")

    if type(pass_turn) != list and type(pass_turn) != dict:
        pass_turn = pass_turn.translate({ord('"'):None})
        pass_turn = pass_turn.translate({ord(']'):None})
        pass_turn = pass_turn.translate({ord('['):None})
        pass_turn = pass_turn.translate({ord("'"):None})
        pass_turn = pass_turn.translate({ord(' '):None})
        pass_turn = pass_turn.split(",")
        pass_turn = {0:int(pass_turn[0]),
                     1:int(pass_turn[1]),
                     2:int(pass_turn[2]),
                     3:int(pass_turn[3])}

    if control == "true" or control == "True":
        control = True
    elif control == "false" or control == "False":
        control = False
    
    moveLists = logic.possibleMoves(hand, field, control, turn)
    if len(moveLists) == 0:
        return []
    min_enemy = min([enemy1, enemy2, enemy3])
    cardClass = cardClassifier(hand, field_history, min_enemy)
    classA = cardClass['classA']
    classB = cardClass['classB']
    classC = cardClass['classC']
    classD = cardClass['classD']

    filterClassA = [x for x in classA]
    filterClassB = [x for x in classB]
    filterClassC = [x for x in classC]
    filterClassD = [x for x in classD]

    classASingle = findSingleInClass(filterClassA)
    classAPair = findPairInClass(filterClassA)
    classACombo = findComboInClass(filterClassA)
    
    classBSingle = findSingleInClass(filterClassB)
    classBPair = findPairInClass(filterClassB)
    classBCombo = findComboInClass(filterClassB)
    
    classCSingle = findSingleInClass(filterClassC)
    classCPair = findPairInClass(filterClassC)
    classCCombo = findComboInClass(filterClassC)
    
    classDSingle = findSingleInClass(filterClassD)
    classDPair = findPairInClass(filterClassD)
    classDCombo = findComboInClass(filterClassD)
    
    
    if len(classASingle) >= (len(classCSingle) + len(classDSingle)) and len(classASingle) >= len(classBSingle) and (len(filterClassB) + len(filterClassC) + len(filterClassD))>0 and (len(filterClassB) + len(filterClassC) + len(filterClassD)) < len(filterClassA):
        filterClassA = classASingle
        filterClassB = classBSingle
        filterClassC = classCSingle
        filterClassD = classDSingle
    
    else:
        if len(hand) >= 4:
            classAPair = [x for x in classAPair if not(any(x[0] in Combo for Combo in classDCombo)) and not(any(x[1] in Combo for Combo in classDCombo))
                                               and not(any(x[0] in Combo for Combo in classCCombo)) and not(any(x[1] in Combo for Combo in classCCombo))
                                               and not(any(x[0] in Combo for Combo in classBCombo)) and not(any(x[1] in Combo for Combo in classBCombo))
                                               and not(any(x[0] in Combo for Combo in classACombo)) and not(any(x[1] in Combo for Combo in classACombo))]
            
            classBPair = [x for x in classBPair if not(any(x[0] in Combo for Combo in classDCombo)) and not(any(x[1] in Combo for Combo in classDCombo))
                                               and not(any(x[0] in Combo for Combo in classCCombo)) and not(any(x[1] in Combo for Combo in classCCombo))
                                               and not(any(x[0] in Combo for Combo in classBCombo)) and not(any(x[1] in Combo for Combo in classBCombo))
                                               and not(any(x[0] in Combo for Combo in classACombo)) and not(any(x[1] in Combo for Combo in classACombo))]
        
            classCPair = [x for x in classCPair if not(any(x[0] in Combo for Combo in classDCombo)) and not(any(x[1] in Combo for Combo in classDCombo))
                                               and not(any(x[0] in Combo for Combo in classCCombo)) and not(any(x[1] in Combo for Combo in classCCombo))
                                               and not(any(x[0] in Combo for Combo in classBCombo)) and not(any(x[1] in Combo for Combo in classBCombo))
                                               and not(any(x[0] in Combo for Combo in classACombo)) and not(any(x[1] in Combo for Combo in classACombo))]
        
            classDPair = [x for x in classDPair if not(any(x[0] in Combo for Combo in classDCombo)) and not(any(x[1] in Combo for Combo in classDCombo))
                                               and not(any(x[0] in Combo for Combo in classCCombo)) and not(any(x[1] in Combo for Combo in classCCombo))
                                               and not(any(x[0] in Combo for Combo in classBCombo)) and not(any(x[1] in Combo for Combo in classBCombo))
                                               and not(any(x[0] in Combo for Combo in classACombo)) and not(any(x[1] in Combo for Combo in classACombo))]
            
            classASingle = [x for x in classASingle if not(any(x[0] in Pair for Pair in classDPair)) and not(any(x[0] in Combo for Combo in classDCombo))
                                                   and not(any(x[0] in Pair for Pair in classCPair)) and not(any(x[0] in Combo for Combo in classCCombo))
                                                   and not(any(x[0] in Pair for Pair in classBPair)) and not(any(x[0] in Combo for Combo in classBCombo))
                                                   and not(any(x[0] in Pair for Pair in classAPair)) and not(any(x[0] in Combo for Combo in classACombo))]
            
            classBSingle = [x for x in classBSingle if not(any(x[0] in Pair for Pair in classDPair)) and not(any(x[0] in Combo for Combo in classDCombo))
                                                   and not(any(x[0] in Pair for Pair in classCPair)) and not(any(x[0] in Combo for Combo in classCCombo))
                                                   and not(any(x[0] in Pair for Pair in classBPair)) and not(any(x[0] in Combo for Combo in classBCombo))
                                                   and not(any(x[0] in Pair for Pair in classAPair)) and not(any(x[0] in Combo for Combo in classACombo))]
        
            classCSingle = [x for x in classCSingle if not(any(x[0] in Pair for Pair in classDPair)) and not(any(x[0] in Combo for Combo in classDCombo))
                                                   and not(any(x[0] in Pair for Pair in classCPair)) and not(any(x[0] in Combo for Combo in classCCombo))
                                                   and not(any(x[0] in Pair for Pair in classBPair)) and not(any(x[0] in Combo for Combo in classBCombo))
                                                   and not(any(x[0] in Pair for Pair in classAPair)) and not(any(x[0] in Combo for Combo in classACombo))]
        
            classDSingle = [x for x in classDSingle if not(any(x[0] in Pair for Pair in classDPair)) and not(any(x[0] in Combo for Combo in classDCombo))
                                                   and not(any(x[0] in Pair for Pair in classCPair)) and not(any(x[0] in Combo for Combo in classCCombo))
                                                   and not(any(x[0] in Pair for Pair in classBPair)) and not(any(x[0] in Combo for Combo in classBCombo))
                                                   and not(any(x[0] in Pair for Pair in classAPair)) and not(any(x[0] in Combo for Combo in classACombo))]
            
            filterClassA = classACombo + classAPair + classASingle
            filterClassB = classBCombo + classBPair + classBSingle
            filterClassC = classCCombo + classCPair + classCSingle
            filterClassD = classDCombo + classDPair + classDSingle  
        else:
            filterClassA = classACombo + classAPair + classASingle
            filterClassB = classBCombo + classBPair + classBSingle
            filterClassC = classCCombo + classCPair + classCSingle
            filterClassD = classDCombo + classDPair + classDSingle
    
    
    classA = splitTrisToSingleAndPair(filterClassA)
    classB = splitTrisToSingleAndPair(filterClassB)
    classC = splitTrisToSingleAndPair(filterClassC)
    classD = splitTrisToSingleAndPair(filterClassD)
    
    return moveSelection(hand, field, turn, pass_turn, classA, classB, classC, classD, enemy1, enemy2, enemy3, control, cardClass, moveLists)

import sys

if __name__ == "__main__":
    st1=sys.argv[1]
    st2=sys.argv[2]
    st3=sys.argv[3]
    st4=int(sys.argv[4])
    st5=sys.argv[5]
    st6=int(sys.argv[6])
    st7=int(sys.argv[7])
    st8=int(sys.argv[8])
    st9=sys.argv[9]
    print(" ".join(predictedMove(st1, st2, st3, st4, st5, st6, st7, st8, st9)))