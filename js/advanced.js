'use strict';

// Keyboard navigation: normal Tab behavior remains available; arrows wrap.
document.querySelectorAll('.navbar-nav').forEach((menu) => {
  const links = [...menu.querySelectorAll('a')];
  menu.addEventListener('keydown', (event) => {
    const current = links.indexOf(document.activeElement);
    if (current < 0 || event.altKey || event.ctrlKey || event.metaKey) return;
    let next;
    switch (event.key) {
      case 'ArrowRight': case 'ArrowDown': next = (current + 1) % links.length; break;
      case 'ArrowLeft': case 'ArrowUp': next = (current - 1 + links.length) % links.length; break;
      case 'Home': next = 0; break;
      case 'End': next = links.length - 1; break;
      default: return;
    }
    event.preventDefault();
    links[next].focus();
  });
});

// Objects + method, arrays, filter/map higher-order functions and a for loop.
const filmLibrary = {
  films: [
    { era: 'raimi', title: 'Spider-Man', kind: 'live' },
    { era: 'amazing', title: 'The Amazing Spider-Man 2', kind: 'live' },
    { era: 'mcu', title: 'Brand New Day', kind: 'live' },
    { era: 'verse', title: 'Across the Spider-Verse', kind: 'animation' }
  ],
  select(category) {
    switch (category) {
      case 'live': return this.films.filter((film) => film.kind === 'live');
      case 'verse': return this.films.filter((film) => film.kind === 'animation');
      case 'classic': return this.films.filter((film) => ['raimi', 'amazing'].includes(film.era));
      default: return this.films;
    }
  }
};
const filmFilter = document.getElementById('film-filter');
if (filmFilter) {
  function updateFilms() {
    const selected = filmLibrary.select(filmFilter.value);
    const eras = selected.map((film) => film.era);
    const cards = document.querySelectorAll('[data-era]');
    for (const card of cards) {
      card.hidden = !eras.includes(card.dataset.era);
    }
    document.getElementById('film-count').textContent = `${selected.length} films: ${selected.map((film) => film.title).join(', ')}.`;
  }
  filmFilter.addEventListener('change', updateFilms);
  updateFilms();
}

// DOM selection, attributes, dynamic content and event-triggered transitions.
const stars = document.querySelectorAll('[data-rating]');
function setRating(value) {
  stars.forEach((star) => {
    const rating = Number(star.dataset.rating);
    star.classList.toggle('is-selected', rating <= value);
    star.setAttribute('aria-pressed', String(rating === value));
  });
  document.getElementById('rating-message').textContent = value
    ? `Your rating: ${value} out of 5. Thanks, web-head!`
    : 'Choose your rating, from 1 to 5 stars.';
}
stars.forEach((star) => star.addEventListener('click', () => setRating(Number(star.dataset.rating))));
document.getElementById('reset-rating')?.addEventListener('click', () => setRating(0));

// One audio voice: fast repeated clicks never create overlapping effects.
const webSound = {
  context: null,
  oscillator: null,
  playing: false,
  async play() {
    if (this.playing) return false;
    this.playing = true;
    try {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (!AudioContextClass) throw new Error('Audio is unavailable');
      this.context ||= new AudioContextClass();
      if (this.context.state === 'suspended') await this.context.resume();
      const now = this.context.currentTime;
      const tone = this.context.createOscillator();
      const gain = this.context.createGain();
      this.oscillator = tone;
      tone.type = 'triangle';
      tone.frequency.setValueAtTime(1100, now);
      tone.frequency.exponentialRampToValueAtTime(160, now + .22);
      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(.12, now + .015);
      gain.gain.exponentialRampToValueAtTime(.001, now + .24);
      tone.connect(gain); gain.connect(this.context.destination);
      tone.onended = () => { tone.disconnect(); gain.disconnect(); this.oscillator = null; this.playing = false; };
      tone.start(now); tone.stop(now + .25);
      return true;
    } catch (error) {
      this.playing = false;
      throw error;
    }
  }
};
const shoot = document.getElementById('web-shot');
if (shoot) {
  const pulse = document.getElementById('web-pulse');
  let animation;
  shoot.addEventListener('click', async () => {
    try {
      if (!await webSound.play()) return;
      document.getElementById('sound-status').textContent = 'Thwip! Web-shot fired.';
    } catch {
      document.getElementById('sound-status').textContent = 'Audio is unavailable in this browser. The visual web-shot still works.';
    }
    animation?.cancel();
    if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      animation = pulse.animate([
        { transform: 'scale(.6) rotate(0deg)', opacity: .4 },
        { transform: 'scale(1.5) rotate(120deg)', opacity: 1 },
        { transform: 'scale(1) rotate(180deg)', opacity: 1 }
      ], { duration: 500, easing: 'ease-out' });
    }
  });
}
