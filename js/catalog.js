(() => {
  'use strict';

  const { films, eras, getSavedIds, toggleSaved } = window.SpiderIndexFilms;
  const byId = new Map(films.map(film => [film.id, film]));
  const archive = document.getElementById('film-results');
  const watchlist = document.getElementById('saved-results');
  const detail = document.getElementById('film-detail');
  const marks = {
    add: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" aria-hidden="true"><path d="M6.5 4h11v16l-5.5-3.6L6.5 20z"/></svg>',
    saved: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M6.5 3.2h11a.8.8 0 0 1 .8.8v16a.8.8 0 0 1-1.2.7L12 17.4l-5.1 3.3a.8.8 0 0 1-1.2-.7V4a.8.8 0 0 1 .8-.8Z"/></svg>'
  };

  function saveButton(film, withText = false) {
    return `<button type="button" class="${withText ? 'button detail-save' : 'poster-save'}" data-save="${film.id}" aria-label="Save ${film.title} to watchlist">${marks.add}${withText ? '<span>Save to watchlist</span>' : ''}</button>`;
  }

  function updateSaveButtons() {
    const saved = new Set(getSavedIds());
    document.querySelectorAll('[data-save]').forEach(button => {
      const film = byId.get(button.dataset.save);
      const active = saved.has(film.id);
      const text = active ? 'Remove from watchlist' : 'Save to watchlist';
      button.setAttribute('aria-label', active ? 'Remove ' + film.title + ' from watchlist' : 'Save ' + film.title + ' to watchlist');
      button.title = text;
      button.classList.toggle('is-saved', active);
      button.innerHTML = marks[active ? 'saved' : 'add'] + (button.classList.contains('detail-save') ? '<span>' + text + '</span>' : '');
    });
  }

  function card(film) {
    return `<article class="film-tile">
      <a class="film-link" href="film.html?id=${film.id}">
        <div class="film-poster"><img src="${film.image}" loading="lazy" alt="" width="650" height="975"></div>
        <div class="film-label"><span>${film.year}</span><span>${eras[film.era].shortName}</span></div>
        <h2>${film.title}</h2>
      </a>
      ${saveButton(film)}
    </article>`;
  }

  function normalize(value) {
    return value.toLowerCase().replace(/[^\p{L}\p{N}]/gu, '');
  }

  function initArchive() {
    const search = document.getElementById('film-search');
    const filters = document.getElementById('era-filters');
    const count = document.getElementById('result-count');
    const params = new URLSearchParams(location.search);
    const initialEra = params.get('era');
    let era = Object.hasOwn(eras, initialEra) ? initialEra : '';
    search.value = params.get('q') || '';
    const options = [['', 'All films'], ...Object.entries(eras).map(([id, item]) => [id, item.shortName])];
    filters.innerHTML = options.map(([id, name]) =>
      `<button type="button" class="era-filter" data-era="${id}">${name}</button>`
    ).join('');

    function filterFilms() {
      const input = search.value.trim().toLowerCase();
      const query = normalize(input);
      const terms = input.match(/[\p{L}\p{N}]+/gu) || [];
      const matches = films.filter(film => {
        if (era && film.era !== era) return false;
        if (!input) return true;
        if (!query) return false;
        const series = eras[film.era];
        const keywords = [film.title, String(film.year), film.director, series.shortName, series.name, series.lead,
          film.era === 'verse' ? 'Miles Morales' : 'Peter Parker'];
        if (keywords.some(keyword => normalize(keyword).includes(query))) return true;
        // A combined query such as "Holland 2017" can match more than one field.
        // Match individual numbers as whole words so a sequel number does not match a year.
        const words = keywords.join(' ').toLowerCase().match(/[\p{L}\p{N}]+/gu);
        return terms.length > 1 && terms.every(term => words.some(word =>
          /^\d+$/.test(term) ? word === term : word.startsWith(term)
        ));
      });
      for (const button of filters.querySelectorAll('button')) {
        button.setAttribute('aria-pressed', String(button.dataset.era === era));
      }
      count.textContent = matches.length + (matches.length === 1 ? ' film' : ' films');
      archive.innerHTML = matches.length ? matches.map(card).join('') :
        '<div class="catalog-empty"><h2>No films found</h2><p>Try a different name or year, or clear your filters.</p><button class="button secondary" type="button" id="clear-filters">Clear filters</button></div>';
      updateSaveButtons();
    }

    function applyFilters(revealCards = false) {
      const address = new URL(location.href);
      const query = search.value.trim();
      if (query) address.searchParams.set('q', query);
      else address.searchParams.delete('q');
      if (era) address.searchParams.set('era', era);
      else address.searchParams.delete('era');
      // Filtering is one navigation step, including after many individual keystrokes.
      if (location.protocol !== 'file:') history.replaceState(null, '', address);
      archive.classList.toggle('reveal-results', revealCards);
      filterFilms();
    }

    filters.addEventListener('click', event => {
      const button = event.target.closest('[data-era]');
      if (!button || button.dataset.era === era) return;
      era = button.dataset.era;
      applyFilters(true);
    });
    archive.addEventListener('click', event => {
      if (!event.target.closest('#clear-filters')) return;
      era = '';
      search.value = '';
      applyFilters(true);
      search.focus();
    });
    search.addEventListener('input', () => applyFilters());
    filterFilms();
  }

  function showWatchlist() {
    const saved = getSavedIds();
    const count = document.getElementById('saved-count');
    count.textContent = saved.length + (saved.length === 1 ? ' saved film' : ' saved films');
    if (saved.length) {
      watchlist.innerHTML = saved.map(id => card(byId.get(id))).join('');
      updateSaveButtons();
      return;
    }
    watchlist.innerHTML = `<div class="catalog-empty empty-shelf">
      <div class="shelf-art" aria-hidden="true">
        <img src="images/films/spider-man.webp" alt="" width="650" height="975">
        <img src="images/films/into-the-spider-verse.webp" alt="" width="650" height="975">
        <img src="images/films/amazing-spider-man.webp" alt="" width="650" height="975">
      </div>
      <div><h2>What’s on for tonight?</h2><p>Use the bookmark on any film poster to add your first film.</p>
      <a href="movies.html" class="button" id="empty-browse">Explore films <span aria-hidden="true">→</span></a></div>
    </div>`;
  }

  function showDetail() {
    const id = new URLSearchParams(location.search).get('id') ?? 'spider-man';
    const film = byId.get(id);
    if (!film) {
      document.title = 'Film not found · Spider Index';
      detail.innerHTML = '<div class="catalog-empty"><h1>Film not found</h1><p>Choose a film from the archive to open its guide.</p><a href="movies.html" class="button">Browse films</a></div>';
      return;
    }
    document.title = film.title + ' · Spider Index';
    const era = eras[film.era];
    const series = films.filter(item => item.era === film.era);
    const order = series.indexOf(film) + 1;
    detail.innerHTML = `<div class="film-feature">
      <div class="feature-poster"><img src="${film.image}" alt="Official poster for ${film.title}" width="650" height="975"></div>
      <div class="feature-copy">
        <a class="kicker series-kicker" href="movies.html?era=${film.era}">${era.name}</a>
        <h1>${film.title}</h1>
        <div class="feature-meta"><span>${film.year}</span><span>${Math.floor(film.runtime / 60)}h ${film.runtime % 60}m</span><span>Film ${order} of ${series.length}</span></div>
        <p class="feature-synopsis">${film.synopsis}</p>
        <dl class="film-credits">
          <div><dt>Directed by</dt><dd>${film.director}</dd></div>
          <div><dt>${film.era === 'verse' ? 'Voice of Miles Morales' : 'Peter Parker'}</dt><dd>${era.lead}</dd></div>
        </dl>
        <div class="feature-actions">${saveButton(film, true)}<a href="watchlist.html" class="catalog-back">My watchlist <span aria-hidden="true">→</span></a></div>
      </div>
    </div>
    <div class="film-notes">
      <section class="viewing-note"><p class="kicker">Viewing note</p><h2>Look closer</h2><p>${film.note}</p>
        <a class="studio-link" href="https://www.sonypictures.com/movies/${film.studioSlug}">Poster and credits at Sony Pictures <span aria-hidden="true">↗</span></a>
      </section>
      <section class="series-list"><p class="kicker">Watch order</p><h2>${era.name}</h2>
        <ol>${series.map(item => `<li>${item.id === film.id ?
          `<span aria-current="page">${item.title}</span>` :
          `<a href="film.html?id=${item.id}">${item.title}</a>`}<small>${item.year}</small></li>`).join('')}</ol>
      </section>
    </div>`;
    updateSaveButtons();
  }

  function refreshSaved() {
    if (watchlist) showWatchlist();
    else updateSaveButtons();
  }

  document.addEventListener('click', event => {
    const button = event.target.closest('button[data-save]');
    if (!button) return;
    const id = button.dataset.save;
    const position = watchlist ? getSavedIds().indexOf(id) : -1;
    const status = document.getElementById('save-message');
    try {
      const saved = toggleSaved(id);
      status.textContent = byId.get(id).title + (saved ? ' added to your watchlist.' : ' removed from your watchlist.');
      status.classList.remove('has-error');
      if (watchlist) {
        const remaining = watchlist.querySelectorAll('button[data-save]');
        const next = remaining[Math.min(position, remaining.length - 1)] || document.getElementById('empty-browse');
        if (next) {
          next.closest('.film-tile, .catalog-empty').classList.add('shelf-settle');
          next.focus();
        }
      } else {
        button.querySelector('svg').classList.add('bookmark-changed');
      }
    } catch {
      status.textContent = 'Your browser could not save this change. Allow local storage for this site and try again.';
      status.classList.add('has-error');
    }
  });

  if (archive) initArchive();
  if (watchlist) showWatchlist();
  if (detail) showDetail();
  window.addEventListener('spider-index:watchlist', refreshSaved);
  window.addEventListener('pageshow', refreshSaved);
  window.addEventListener('storage', event => {
    if (!event.key || event.key.startsWith('spider-index.')) refreshSaved();
  });
})();
