const getElements = () => {
  const chooser = document.querySelector('.chooser');
  const playground = document.querySelector('.playground');
  const scores = document.querySelector('.scores');
  const timer = document.querySelector('.timer');

  return {chooser, playground, scores, timer};
};

const {chooser, playground, scores, timer} = getElements();

const domElements = {chooser, playground, scores, timer};

// TODO: for next levels it can be 3 or highest
// const scoresForWin = 2;

let debounce = false;
let cardToCompare = '';
let opened = 0;
let score = 0;
let seconds = 0;
let minutes = 0;
let timerId;

function startNewGame() {
  const n = 4;
  const amount = Math.pow(n, 2) / 2;
  const cardsFront = randomizer(amount);

  domElements.playground.innerHTML = '';

  let cards = '';
  minutes = 0;
  seconds = 0;
  score = 0;

  resetValues();

  if (timerId) {
    stopTimer();
    timerId = '';
  }
  renderScores();
  renderTimer();

  cardsFront.forEach(el => cards += getCardTemplate(el));

  domElements.playground.insertAdjacentHTML('beforeend', cards);
  domElements.playground.addEventListener('click', onCardClick);
}

function onCardClick(e) {
  let target = e.target;

  while (target !== domElements.playground) {
    if (target.classList.contains('card')
      && !target.classList.contains('matched')
      && !debounce
      && target !== cardToCompare) {
      if (!timerId) {
        startTimer();
      }
      rotate(target);
      opened = opened + 1;

      if (cardToCompare && opened === 2) {
        debounce = true;
        setTimeout(() => {
          cardToCompare.id === target.id ? onEqualCards(cardToCompare, target) : onDifferentCards(cardToCompare, target);
        }, 1000)
      } else {
        cardToCompare = target;
      }

      break;
    }

    target = target.parentNode;
  }
}

function randomizer(n) {
  const imagesIndexes = new Array(n).fill(true).map((item, i) => ++i);
  const duplicatedIndexes = Array.prototype.concat.apply([], new Array(2).fill(imagesIndexes));

  return duplicatedIndexes.sort((a, b) => Math.random() - 0.5);
}

function getCardTemplate(name) {
  return `<figure class="card" id="img-${name}">
    <img src="../pics/sets/level-1/${name}.jpg" class="side front" width="100%" height="100%"> 
    <div class='side back'>&nbsp;</div>
  </figure>`;
}

function rotate(card) {
  card.classList.toggle('turned');
}

function resetValues() {
  cardToCompare = '';
  opened = 0;
  debounce = false;
}

function onEqualCards(...args) {
  score += 1;
  args.forEach(el => el.classList.add('matched'));
  resetValues();
  renderScores();

  if (detectEndOfGame()) {
    stopTimer();
    generateEndGamePopup()
  }
}

function onDifferentCards(...args) {
  args.forEach(el => rotate(el));
  resetValues();
}

function detectEndOfGame() {
  // TODO: move 4 to some const
  return score * 2 ===  Math.pow(4, 2)
}

function generateEndGamePopup() {
  // TODO: will be better change it to function and pass properties via arguments
  const popupTemplate = ` <section class="end-game-popup">
    <p class='final-text'>Well Done!</p>
    <p class='final-text'>Your Score: <span>${score}</span></p>
    <p class='final-text'>Your Time: <span>${minutes}:${seconds}</span></p>
    <button class='new-game-btn'>Start New game</button>
  </section>`;

  domElements.playground.insertAdjacentHTML("beforeend", popupTemplate);
  document.querySelector('.new-game-btn').addEventListener('click', startNewGame);
}

function renderScores() {
  domElements.scores.innerHTML = score;
}

function startTimer() {
  timerId = setInterval(() => {
    seconds++;

    if (seconds > 59) {
      minutes++;
      seconds = 0;
    }

    if (seconds < 9) {
      seconds = '0' + seconds;
    }
    renderTimer();
  }, 1000)
}

function renderTimer() {
  domElements.timer.innerHTML = `${minutes}:${seconds}`
}

function stopTimer() {
  clearInterval(timerId);
}

startNewGame();
