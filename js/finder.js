(() => {
  'use strict';

  const { films, isSaved, toggleSaved } = window.SpiderIndexFilms;
  // Each pair follows the release order of its series: the opener, then its direct sequel.
  const reasons = {
    verse: [
      'Follow Miles through his first days with the mask. His sketchbook, a Brooklyn mural and a leap between skyscrapers tell you who he is.',
      'Miles has found his feet. Follow him into Gwen’s watercolor world and a Spider-Society whose rules he starts to question.'
    ],
    raimi: [
      'Start with Peter, Uncle Ben and the choice that changes Peter’s life. Sam Raimi gives the quiet family scenes as much weight as the first web swing.',
      'Peter now has rent to pay and a friend he keeps disappointing. Doctor Octopus gives him a reason to reconsider walking away from the suit.'
    ],
    webb: [
      'A briefcase leads Peter to Oscorp and Gwen Stacy. Their first conversations unfold alongside the mystery of his father’s research.',
      'Graduation is pushing Gwen and Peter in different directions. Their decisions carry the romance forward while Electro puts Times Square in danger.'
    ],
    mcu: [
      'Peter wants to impress the Avengers, but he also wants to make it to homecoming. Start with the film where his two plans collide.',
      'Stay with Peter’s classmates as a school trip takes them to Europe. Peter hopes to tell MJ how he feels between stops.'
    ]
  };
  const mood = document.getElementById('finder-mood');
  const history = document.getElementById('finder-history');
  const save = document.getElementById('finder-save');
  const feedback = document.getElementById('finder-feedback');
  const announcement = document.getElementById('finder-announcement');
  const recommendation = document.querySelector('.finder-pick');
  let pick;

  function showSavedState() {
    const saved = isSaved(pick.id);
    save.setAttribute('aria-pressed', String(saved));
    save.textContent = saved ? 'Saved to watchlist' : 'Save to watchlist';
  }

  function showPick(announce) {
    const series = mood.value;
    const position = Number(history.value);
    pick = films.filter(film => film.era === series)[position];
    const reason = reasons[series][position];
    document.getElementById('finder-film').textContent = pick.title;
    document.getElementById('finder-meta').textContent = pick.year + ' · ' + pick.runtime + ' min';
    document.getElementById('finder-poster').src = pick.image;
    document.getElementById('finder-reason').textContent = reason;
    document.getElementById('finder-guide').href = 'film.html?id=' + pick.id;
    feedback.textContent = '';
    showSavedState();
    if (announce) {
      announcement.textContent = 'Your pick: ' + pick.title + '. ' + reason;
      if (!matchMedia('(prefers-reduced-motion: reduce)').matches && recommendation.animate) {
        recommendation.getAnimations().forEach(animation => animation.cancel());
        recommendation.animate([{ opacity: .6, transform: 'translateY(4px)' }, { opacity: 1, transform: 'none' }],
          { duration: 240, easing: 'ease-out' });
      }
    }
  }

  mood.addEventListener('change', () => showPick(true));
  history.addEventListener('change', () => showPick(true));
  save.addEventListener('click', () => {
    try {
      const saved = toggleSaved(pick.id);
      feedback.textContent = saved ? 'Added to your watchlist.' : 'Removed from your watchlist.';
      showSavedState();
    } catch {
      feedback.textContent = 'Your browser could not save this film. Allow site storage and try again.';
    }
  });
  window.addEventListener('storage', showSavedState);
  window.addEventListener('pageshow', () => showPick(false));
  showPick(false);
})();
