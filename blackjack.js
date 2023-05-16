var dealerSum = 0;
var yourSum = 0;

var dealerAceCount = 0;
var yourAceCount = 0;

var hidden;
var deck;

var canHit = true;
var canStay = true;

window.onload = function() {
    buildDeck();
    shuffleDeck();
    startGame();
}

function buildDeck() {
    let values = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"]
    let suits = ["C", "D", "H", "S"]
    deck = [];

    for(let i = 0; i < suits.length; i++) {
        for(let j = 0; j < values.length; j++) {
            deck.push(values[j] + "-" + suits[i]);
        }
    }

    // console.log(deck);
}

function shuffleDeck() {
    for(let i = 0; i < deck.length; i++) {
        let j = Math.floor(Math.random() * deck.length);
        let temp = deck[i];
        deck[i] = deck[j];
        deck[j] = temp;
    }

    console.log(deck);
}

function startGame() {
    hidden = deck.pop();
    dealerSum += getValue(hidden);
    dealerAceCount += checkAce(hidden);
    // console.log(hidden);
    // console.log(dealerSum);
    // <img src="./cards/4-C.png">
    let cardImg = document.createElement("img");
    let card = deck.pop();
    cardImg.src = "./cards/" + card + ".png";
    dealerSum += getValue(card);
    dealerAceCount += checkAce(card);
    document.getElementById("dealer-cards").append(cardImg);
    console.log(dealerSum);

    for(let i = 0; i < 2; i++) {
        let cardImg = document.createElement("img");
        let card = deck.pop();
        cardImg.src = "./cards/" + card + ".png";
        yourSum += getValue(card);
        yourAceCount += checkAce(card);
        document.getElementById("your-cards").append(cardImg);
    }
    console.log(yourSum);

    document.getElementById("hit").addEventListener("click", hit);
    document.getElementById("stay").addEventListener("click", stay);
}

function playAgain() {
    if(!canHit) {
        var playAgain = document.createElement("button");
        playAgain.setAttribute("id", "playAgain")
        playAgain.setAttribute("class", "btn");
        playAgain.innerText = "Play Again?";
        var body = document.getElementsByTagName("body")[0];
        body.appendChild(playAgain);
    }
}

function hit() {
    if(!canHit) {
        return;
    }

    let cardImg = document.createElement("img");
    let card = deck.pop();
    cardImg.src = "./cards/" + card + ".png";
    yourSum += getValue(card);
    yourAceCount += checkAce(card);
    document.getElementById("your-cards").append(cardImg);

    if(reduceAce(yourSum, yourAceCount) > 21) {
        canHit = false;
        canStay = false;
        document.getElementById("results").innerText = "You Lose!";
        let audio = new Audio("losing.wav");
        audio.play();
        playAgain();
        document.getElementById("playAgain").addEventListener("click", restart);
    }
}

function restart() {
    window.location.reload();
}

function stay() {
    if(!canStay) {
        return;
    }

    yourSum = reduceAce(yourSum, yourAceCount);

    canHit = false;
    document.getElementById("hidden").src = "./cards/" + hidden + ".png";

    while(dealerSum < 17) {
        // <img src="./cards/4-C.png">
        let cardImg = document.createElement("img");
        let card = deck.pop();
        cardImg.src = "./cards/" + card + ".png";
        dealerSum += getValue(card);
        dealerAceCount += checkAce(card);
        dealerSum = reduceAce(dealerSum, dealerAceCount);
        document.getElementById("dealer-cards").append(cardImg);
    }

    let audio = ""
    let message = "";
    if(dealerSum > 21) {
        message = "You win!";
        audio = new Audio("win.wav");
    }
    // both you and the dealer <= 21
    else if(yourSum == dealerSum) {
        message = "Tie!";
        audio = new Audio("tie.wav");
    }
    else if(yourSum > dealerSum) {
        message = "You win!";
        audio = new Audio("win.wav");
    }
    else if(dealerSum > yourSum) {
        message = "You Lose!";
        audio = new Audio("losing.wav");
    }

    document.getElementById("dealer-sum").innerText = dealerSum;
    document.getElementById("your-sum").innerText = yourSum;
    document.getElementById("results").innerText = message;
    audio.play();

    playAgain();
    document.getElementById("playAgain").addEventListener("click", restart);
    canStay = false;
}

function reduceAce(playerSum, playerAceCount) {
    while(playerSum > 21 && playerAceCount > 0) {
        playerSum -= 10;
        playerAceCount -= 1;
    }
    return playerSum;
}

function getValue(card) {
    let data = card.split("-");
    let val = data[0];

    if(isNaN(val)) {
        if(val == "A") {
            return 11;
        }
        return 10;
    }

    return parseInt(val);
}

function checkAce(card) {
    if(card[0] == "A") {
        return 1;
    }
    return 0;
}