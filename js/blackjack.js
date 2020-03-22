const Card = class {
    constructor(num, suit) {
        this.num = num;
        this.suit = suit;
    }

    cardString(){
        return this.num.toString()+this.suit
    }

    getBJValue(){
        if (["K", "Q", "J"].includes(this.num)){
            this.value = 10
            return this.value
        }
        else if (this.num == "A"){
            this.value = 11
            return this.value
        }
        else {
            this.value = parseInt(this.num)
            return this.value
        }
    }
}


const Deck = class {
    constructor(){
        this.deck = []
        const suits = ["S", "H", "C", "D"]
        for (var i=2; i<11; i++){
            const stri = i.toString()
            suits.forEach(suit => this.deck.push(new Card(stri,suit)))
        }

        const faceCards = ["J", "Q", "K", "A"]
        faceCards.forEach(faceCard => suits.forEach(suit => this.deck.push(new Card(faceCard,suit))))

        function shuffleArray(array) {
            for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
            }
        }
        shuffleArray(this.deck)

    }

    showDeck(){
        const dispDeck = []
        this.deck.forEach(card => dispDeck.push(card.cardString()))
        return dispDeck
    }

    drawCard(){
        return this.deck.pop()
    }
}


const BlackJackHand = class {
    constructor(card1, card2){
        this.cards = [card1, card2]
    }

    displayCards(){
        const dispCards = []
        this.cards.forEach(card => dispCards.push(card.cardString()))
        return dispCards.join(" ")
    }

    displayDealerCard(){
        return this.cards[1].cardString()
    }

    addCard(newCard){
        this.cards.push(newCard)
    }

    handScore(){
        let sum = 0;
        const aces = []
        const otherCards = []
        this.cards.forEach(card => {
            if (card.num == "A"){
                aces.push(card)
                console.log("found ace")
            }
            else {
                otherCards.push(card)
                console.log("user card: ", card.cardString())
            }
        })
        otherCards.forEach(card => sum = sum+card.getBJValue())
        if(aces.length > 0 && sum < 11){
            sum = sum + 11
            aces.pop()
            while (aces.length > 0){
                sum = sum + 1
                aces.pop()
            }
        }
        if(aces.length > 0 && sum >= 11){
            while (aces.length > 0){
                sum = sum + 1
                aces.pop()
            }
        }
        return sum
    }
    }

let bankroll = 1000
let wager = ''
let ddError;
document.querySelector("#bankroll").innerHTML = 'Bankroll: $' + bankroll


let deck
let userCard1
let dealerCard1
let userCard2
let dealerCard2
let userCardString1
let userCardString2
let dealerCardString1
let dealerCardString2
let userHand
let dealerHand
let userScore
let dealerScore


function toggleHSButtons(){
    if (document.querySelector("#hit").style.opacity == 0.2){
        document.querySelector("#hit").style.opacity = 1.0
        document.querySelector("#stand").style.opacity = 1.0

        document.querySelector("#hit").disabled = false
        document.querySelector("#stand").disabled = false

        document.querySelector("#hit").style.cursor = "default"
        document.querySelector("#stand").style.cursor = "default"
        }

    else {
        document.querySelector("#hit").style.opacity = 0.2
        document.querySelector("#stand").style.opacity = 0.2

        document.querySelector("#hit").disabled = true
        document.querySelector("#stand").disabled = true

        document.querySelector("#hit").style.cursor = "not-allowed"
        document.querySelector("#stand").style.cursor = "not-allowed"
    }
}

function toggleNWButtons(){
    if (document.querySelector("#newHand").style.opacity == 0.2){
        document.querySelector("#newHand").style.opacity = 1.0
        document.querySelector("#wagerForm").style.display = "inline-block"
    }
    else {
        document.querySelector("#newHand").style.opacity = 0.2
        document.querySelector("#wagerForm").style.display = "none"
    }
}

function setBanner(text){
    document.querySelector("#wagerLabel").innerHTML = text
}

function setBankroll(number){
    bankroll = number
    document.querySelector("#bankroll").innerHTML = 'Bankroll: $' + bankroll
}

function setChange(change){
    if (change < 0){
        document.querySelector("#rollChange").innerHTML = "     -$" + -change;
        document.querySelector("#rollChange").style.color = '#ff0026';
        setTimeout(() => document.querySelector("#rollChange").innerHTML = "", 2500)
    }
    else{
        document.querySelector("#rollChange").innerHTML = "     +$" + change
        document.querySelector("#rollChange").style.color = '#3cff00';
        setTimeout(() => document.querySelector("#rollChange").innerHTML = "", 2500)
    }
}

function DDButtonOn(){
        document.querySelector("#doubleDown").style.opacity = 1.0
        document.querySelector("#doubleDown").disabled = false
        document.querySelector("#doubleDown").style.cursor = "default"
}

function DDButtonOff(){
        document.querySelector("#doubleDown").style.opacity = 0.2
        document.querySelector("#doubleDown").disabled = true
        document.querySelector("#doubleDown").style.cursor = "not-allowed"
}

document.querySelector('#wagerForm').onsubmit = function(e){
        e.preventDefault();
        newHand();
}

function hitCard(){
    DDButtonOff()
    const card = deck.drawCard()
    const cardString = card.cardString()
    document.querySelector("#userCardContainer").innerHTML = document.querySelector("#userCardContainer").innerHTML + '   <img src="/images/' + cardString + '.jpg" alt="User card"/>'
    userHand.addCard(card)
    userScore = userHand.handScore()
    if (userScore > 21){
        document.querySelector("#userScore").innerHTML = "User Score: BUSTED!"
        setBanner(`Loss: -${wager}`)
        toggleHSButtons()
        toggleNWButtons()
        document.querySelector("#wager").focus()
        }
    else{
        document.querySelector("#userScore").innerHTML = 'User Score ' + userScore
    }
}

function doubleDown(){
    setBankroll(bankroll - parseInt(wager))
    setChange(-parseInt(wager))
    wager = (parseInt(wager) * 2).toString()
    setBanner(`Wager this hand: ${wager}`)
    hitCard()
    if (userScore > 21){
        return
    }
    stand()
}


function stand(){
     document.querySelector("#dealerCardContainer").innerHTML = '<img src="/images/' + dealerCardString1 + '.jpg" alt="Dealer card" />  <img src="/images/' + dealerCardString2 + '.jpg" alt="Dealer card"/>'
     document.querySelector("#dealerScore").innerHTML = 'Dealer Score ' + dealerScore
     DDButtonOff()
     while (dealerScore < 17){
        const newCard = deck.drawCard()
        const newCardString = newCard.cardString()
        dealerHand.addCard(newCard)
        document.querySelector("#dealerCardContainer").innerHTML = document.querySelector("#dealerCardContainer").innerHTML + '   <img src="/images/' + newCardString + '.jpg" alt="Dealer card"/>'
        dealerScore = dealerHand.handScore()
        document.querySelector("#dealerScore").innerHTML = 'Dealer Score ' + dealerScore
    }
    document.querySelector("#dealerScore").innerHTML = 'Dealer Score ' + dealerScore

    // Dealer busts
    if (dealerScore > 21){
        setBankroll(bankroll + 2*parseInt(wager))
        setChange(2*parseInt(wager))
        document.querySelector("#dealerScore").innerHTML = "Dealer Score: BUSTED!"
        setBanner("Winner!")
        toggleHSButtons()
        toggleNWButtons()
        document.querySelector("#wager").focus()
    }

    // User higher score
    else if (userScore > dealerScore){
        setBankroll(bankroll +  2*parseInt(wager))
        setChange(2*parseInt(wager))
        setBanner('Winner!')
        toggleHSButtons()
        toggleNWButtons()
        document.querySelector("#wager").focus()
    }

    // Dealer higher score
    else if (dealerScore > userScore){
        setBanner('Dealer wins.')
        toggleHSButtons()
        toggleNWButtons()
        document.querySelector("#wager").focus()
    }

    // Push
    else if (dealerScore == userScore){
        setBanner('Push')
        setBankroll(bankroll + parseInt(wager))
        setChange(parseInt(wager))
        toggleHSButtons()
        toggleNWButtons()
        document.querySelector("#wager").focus()
    }
}

function newHand(){
    wager = document.querySelector("#wager").value

    // Clear wager field
    document.querySelector("#wager").value = ''

    // Check that wager is valid
    if (wager == ''){
        setBanner("Please enter a wager")
        return
    }
    else if (parseInt(wager) > bankroll){
        console.log("insufficient funds")
        setBanner('Error: Insufficient funds')
        return
    }
    else if (isNaN(parseInt(wager))){
        setBanner("Enter a valid wager")
        return
    }

    setChange(-parseInt(wager))
    toggleHSButtons()
    toggleNWButtons()

    // Check if enough funds to double down
    if (parseInt(wager)*2 > bankroll){
        DDButtonOff()
    }
    else {
        DDButtonOn()
    }

    // Deal new hand
    setBankroll(bankroll - parseInt(wager))
    setBanner(`Wager this hand: ${wager}`)
    deck = new Deck()
    userCard1 = deck.drawCard()
    dealerCard1 = deck.drawCard()
    userCard2 = deck.drawCard()
    dealerCard2 = deck.drawCard()
    userCardString1 = userCard1.cardString()
    userCardString2 = userCard2.cardString()
    dealerCardString1 = dealerCard1.cardString()
    dealerCardString2 = dealerCard2.cardString()
    userHand = new BlackJackHand(userCard1, userCard2)
    dealerHand = new BlackJackHand(dealerCard1, dealerCard2)
    userScore = userHand.handScore()
    dealerScore = dealerHand.handScore()

    document.querySelector("#dealerScore").innerHTML = 'Dealer Showing: ' + dealerCard1.getBJValue()
    document.querySelector("#userScore").innerHTML = 'User Score ' + userScore
    document.querySelector("#userCardContainer").innerHTML = '<img src="/images/' + userCardString1 + '.jpg" alt="User card"/>  <img src="/images/' + userCardString2 + '.jpg" alt="User card"/>'
    document.querySelector("#dealerCardContainer").innerHTML = '<img src="/images/' + dealerCardString1 + '.jpg" alt="Dealer card"/>  <img src="/images/purple_back.jpg" alt="Dealer card"/>'

    // Check if dealer has blackjack
    if (dealerScore == 21){
        document.querySelector("#dealerCardContainer").innerHTML = '<img src="/images/' + dealerCardString1 + '.jpg" alt="Dealer card" />  <img src="/images/' + dealerCardString2 + '.jpg" alt="Dealer card"/>'
        document.querySelector("#dealerScore").innerHTML = 'Dealer Score ' + dealerScore
        if (userScore == 21){
            setBanner("PUSH")
            setBankroll(bankroll+parseInt(wager))
            setChange(parseInt(wager))
            DDButtonOff()
            toggleHSButtons()
            toggleNWButtons()
            document.querySelector("#wager").focus()
        }
        else {
            setBanner("Dealer has BlackJack. Dealer wins.")
            DDButtonOff()
            toggleHSButtons()
            toggleNWButtons()
            document.querySelector("#wager").focus()
        }
    }

    // Check if user has blackjack
    else if (userScore == 21){
        document.querySelector("#dealerCardContainer").innerHTML = '<img src="/static/images3/' + dealerCardString1 + '.jpg" alt="Dealer card" />  <img src="/static/images3/' + dealerCardString2 + '.jpg" alt="Dealer card"/>'
        document.querySelector("#dealerScore").innerHTML = 'Dealer Score ' + dealerScore
        setBanner("BLACKJACK!")
        setBankroll(bankroll + (5/2)*parseInt(wager))
        setChange((5/2)*parseInt(wager))
        DDButtonOff()
        toggleHSButtons()
        toggleNWButtons()
        document.querySelector("#wager").focus()
    }

}
