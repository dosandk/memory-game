const cards = document.getElementsByClassName('card');
function rotate() {
    this.classList.toggle('turned');
};

Array.prototype.forEach.call(cards, (el => el.addEventListener('click', rotate))); 