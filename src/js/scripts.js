const domElements = {
    chooser: document.querySelector('.chooser'),
    playground: document.querySelector('.playground'),
    scores: document.querySelector('.scores'),
    timer: document.querySelector('.timer')
};
const playGroundSize = parseInt(domElements.chooser.value, 10);
const scoresForWin = 2;

let debounce = false;
let cardToCompare = '';
let opened = 0;
let score = 0;
let seconds = 0;
let minutes = 0;
let timerId;


// Main functionality

function generatePlayground(n) {
    const amount = (n*n)/2;
    const cardsFront = randomizer(amount);
    let cards = '';
    minutes = 0;
    seconds = 0;
    score = 0;
    renderScores();
    renderTimer();

    cardsFront.forEach(el => cards += createCard(el));
    domElements.playground.insertAdjacentHTML("beforeend", cards);

    if(n >= 6){
        Array.from(document.getElementsByClassName('card')).forEach(el => el.classList.add('card-for-6x6'));
        domElements.playground.classList.remove('big-playground');
    }
    if (n >= 8) {
        domElements.playground.classList.add('big-playground');
    }
}

function onCardClick(e) {
     let target = e.target;

     while(target != domElements.playground){
         if(target.classList.contains('card') 
            && !target.classList.contains('matched')
            && !debounce
            && target !== cardToCompare){
                if(!timerId){
                    startTimer();
                }
             rotate(target);
             opened = opened+1;
             if(cardToCompare && opened === 2) {
                 debounce = true;
                 setTimeout(() =>{
                     checkCardsEquality(cardToCompare.id, target.id) ? onEqualCards(cardToCompare, target) : onDifferentCards(cardToCompare, target);
                 },  1000)
            } else {
                cardToCompare = target;
            };
             return;
         }
            target = target.parentNode;
     }
}

// Helpers for generating playground

function randomizer(n) {
    const arr = new Array(n).fill(true).map((item, i) => ++i);
    const pics = [...arr, ...arr];

    return pics.sort((a, b) => Math.random() - 0.5);
}

function createCard(name){
    const card = `<figure class='card' id="img-${name}">
            <img src="../pics/${name}.jpg" class='side front'>
            <div class='side back'>Vickie's memory</div>
        </figure>`;

        return card;
}

function onSizeChange(e) {
    domElements.playground.innerHTML = '';
    generatePlayground(parseInt(e.value, 10));
}

// Helpers for gaming functionality

function rotate(card) {
    card.classList.toggle('turned');
}

function resetValues() {
    cardToCompare = '';
    opened = 0;
    debounce = false;
}

function checkCardsEquality(id1, id2) {
    const isEqual = id1 === id2;
    return isEqual;
}

function onEqualCards(...args){
    score += scoresForWin;
    args.forEach(el => el.classList.add('matched'));
    resetValues();
    renderScores();
    if(detectEndOfGame()){
        stopTimer();
        generateEndGamePopup()}
}

function onDifferentCards(...args){
    args.forEach(el => rotate(el));
    resetValues();
}

function detectEndOfGame() {
    const matchedCards = document.getElementsByClassName('matched');
    return matchedCards.length === playGroundSize*playGroundSize;
}

function startNewGame(){
    domElements.playground.innerHTML = '';
    generatePlayground(playGroundSize);
}

function generateEndGamePopup(){
    const popupTemplate = ` <section class="end-game-popup">
            <p class='final-text'>Well Done!</p>
            <p class='final-text'>Your Score: <span>${score}</span></p>
            <p class='final-text'>Your Time: <span>${minutes}:${seconds}</span></p>
            <button class='new-game-btn'>Start New game</button>
        </section>`

        domElements.playground.insertAdjacentHTML("beforeend", popupTemplate);
        document.querySelector('.new-game-btn').addEventListener('click', startNewGame);
}

// Additional features

function renderScores(){
    domElements.scores.innerHTML = score;
}

function startTimer(){
    timerId = setInterval(() =>{
        seconds++;
        if (seconds>59){
            minutes++;
            seconds = 0;
        }
        if(seconds<9){
            seconds = '0'+seconds;
        }
        renderTimer();
    }, 1000)
}

function renderTimer(){
    domElements.timer.innerHTML = `${minutes}:${seconds}`
}

function stopTimer(){
    clearInterval(timerId);
}

startNewGame();
domElements.playground.addEventListener('click', onCardClick);
