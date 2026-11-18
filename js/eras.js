(() => {
  'use strict';

  const { films, eras } = window.SpiderIndexFilms;
  const guides = {
    raimi: {
      entity: 'Q484442', composer: 'Danny Elfman', character: 'Peter Parker',
      title: 'The Raimi trilogy',
      guide: 'Sam Raimi follows Peter from a high-school field trip to his first cramped apartment. The price of a missed shift or a broken promise weighs as heavily as any fight above the city.',
      start: 'Begin with the spider bite, Uncle Ben and the Green Goblin. The two sequels follow this Peter in release order.'
    },
    webb: {
      entity: 'Q229808', composer: 'James Horner', character: 'Peter Parker',
      title: 'The Webb films',
      guide: 'Andrew Garfield gives Peter a skateboard, a camera and a quick tongue. Marc Webb builds his two films around Peter’s search for his parents and his growing attachment to Gwen Stacy.',
      start: 'This film introduces its own Peter and Gwen. Follow their story directly into The Amazing Spider-Man 2.'
    },
    mcu: {
      entity: 'Q23010088', composer: 'Michael Giacchino', character: 'Peter Parker',
      title: 'The MCU films',
      guide: 'Tom Holland’s Peter lives in a Queens where the Avengers already make the news. He juggles the school decathlon and a secret identity while trying to convince Tony Stark he can handle a bigger assignment.',
      start: 'Homecoming introduces Peter’s life at school and at home. For his first encounter with the Avengers, watch Captain America: Civil War first.'
    },
    verse: {
      entity: 'Q29588607', composer: 'Daniel Pemberton', character: 'Miles Morales',
      title: 'The Spider-Verse',
      guide: 'Miles sketches in his notebook and slips out with his uncle to paint a mural under Brooklyn. Halftone dots, hand-drawn marks and shifting color give each visiting Spider-Person a world of their own.',
      start: 'Meet Miles in Brooklyn before following him into Across the Spider-Verse. His first film introduces the other Spider-People as he meets them.'
    }
  };

  const byId = id => document.getElementById(id);
  const selector = document.querySelector('.era-selector');
  const feature = document.querySelector('.era-feature');
  const cache = new Map();
  let selectedEra;
  let activeRequest;
  let panelAnimation;

  async function wikidataEntities(ids, props, signal) {
    const params = new URLSearchParams({
      action: 'wbgetentities', ids: ids.join('|'), props, format: 'json', origin: '*'
    });
    if (props === 'labels') params.set('languages', 'en');
    const response = await fetch('https://www.wikidata.org/w/api.php?' + params, { signal });
    if (!response.ok) throw new Error('Credit service unavailable');
    const data = await response.json();
    if (!data.entities) throw new Error('Missing credit data');
    return data.entities;
  }

  function values(claims, property) {
    const statements = (claims[property] || []).filter(statement =>
      statement.rank !== 'deprecated' && statement.mainsnak.datavalue
    );
    const preferred = statements.filter(statement => statement.rank === 'preferred');
    return (preferred.length ? preferred : statements).map(statement => statement.mainsnak.datavalue.value);
  }

  async function fetchCredits(entity, signal) {
    const records = await wikidataEntities([entity], 'claims', signal);
    const claims = records[entity]?.claims;
    if (!claims) throw new Error('Film record unavailable');

    // Wikidata stores credits as links to people. Resolve their names together in one request.
    const directors = values(claims, 'P57').map(person => person.id);
    const composers = values(claims, 'P86').map(person => person.id);
    const people = [...new Set([...directors, ...composers])];
    const labels = people.length ? await wikidataEntities(people, 'labels', signal) : {};
    const names = ids => ids.map(id => labels[id]?.labels?.en?.value).filter(Boolean).join(', ') || 'Not listed';
    const durations = values(claims, 'P2047')
      .filter(value => value.unit?.endsWith('/Q7727'))
      .map(value => Number(value.amount)).filter(value => Number.isFinite(value) && value > 0);
    // Different releases can have different running times in the same source.
    const minutes = [...new Set(durations)].sort((a, b) => a - b).join(' / ');
    return {
      director: names(directors), plural: directors.length > 1,
      composer: names(composers), runtime: minutes ? minutes + ' min' : 'Not listed'
    };
  }

  function showCredits(credits) {
    byId('director-heading').textContent = credits.plural ? 'Directors' : 'Director';
    byId('credit-director').textContent = credits.director;
    byId('credit-composer').textContent = credits.composer;
    byId('credit-runtime').textContent = credits.runtime;
  }

  async function loadCredits(guide, film) {
    if (activeRequest) activeRequest.abort();
    const controller = new AbortController();
    activeRequest = controller;
    const status = byId('credits-status');
    const facts = byId('era-facts');
    const retry = byId('credits-retry');
    retry.hidden = true;
    if (cache.has(guide.entity)) {
      showCredits(cache.get(guide.entity));
      facts.setAttribute('aria-busy', 'false');
      status.textContent = 'Credits from Wikidata.';
      return;
    }

    showCredits({
      director: film.director, plural: selectedEra === 'verse',
      composer: guide.composer, runtime: film.runtime + ' min'
    });
    facts.setAttribute('aria-busy', 'true');
    status.textContent = 'Checking credits with Wikidata…';
    const timeout = window.setTimeout(() => controller.abort(), 10000);
    try {
      const credits = await fetchCredits(guide.entity, controller.signal);
      if (controller !== activeRequest) return;
      cache.set(guide.entity, credits);
      showCredits(credits);
      status.textContent = 'Credits from Wikidata.';
    } catch {
      if (controller !== activeRequest) return;
      status.textContent = 'Wikidata is unavailable. Showing archive credits.';
      retry.hidden = false;
    } finally {
      window.clearTimeout(timeout);
      if (controller === activeRequest) facts.setAttribute('aria-busy', 'false');
    }
  }

  function showEra(key) {
    const previous = selectedEra;
    selectedEra = Object.hasOwn(guides, key) ? key : 'raimi';
    const guide = guides[selectedEra];
    const series = films.filter(film => film.era === selectedEra);
    const film = series[0];
    const animated = selectedEra === 'verse';
    const title = film.title + ' (' + film.year + ')';
    for (const link of selector.querySelectorAll('[data-era]')) {
      if (link.dataset.era === selectedEra) link.setAttribute('aria-current', 'true');
      else link.removeAttribute('aria-current');
    }
    const poster = byId('era-poster');
    poster.src = film.image;
    poster.alt = title + ' film poster';
    byId('era-year').textContent = film.year;
    byId('era-format').textContent = (animated ? 'Animation' : 'Live action') + ' · ' + guide.character;
    byId('era-title').textContent = guide.title;
    byId('era-performer').textContent = eras[selectedEra].lead + (animated ? ' voices ' : ' as ') + guide.character;
    byId('era-guide').textContent = guide.guide;
    byId('era-film').textContent = title;
    byId('era-start').textContent = guide.start;
    byId('era-film-link').href = 'film.html?id=' + film.id;
    const catalogLink = byId('era-films-link');
    catalogLink.href = 'movies.html?era=' + selectedEra;
    catalogLink.firstChild.textContent = 'See all ' + series.length + ' films ';
    byId('credits-source').href = 'https://www.wikidata.org/wiki/' + guide.entity;
    loadCredits(guide, film);
    if (previous && previous !== selectedEra) {
      panelAnimation?.cancel();
      if (matchMedia('(prefers-reduced-motion: no-preference)').matches && feature.animate) {
        panelAnimation = feature.animate([
          { opacity: .78, transform: 'translateY(6px)' },
          { opacity: 1, transform: 'translateY(0)' }
        ], { duration: 240, easing: 'cubic-bezier(.2,.75,.25,1)' });
      }
    }
  }

  function showEraFromUrl() {
    showEra(new URLSearchParams(location.search).get('era'));
  }

  selector.addEventListener('click', event => {
    const link = event.target.closest('a[data-era]');
    if (!link || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    if (link.dataset.era === selectedEra) return;
    history.pushState(null, '', link.href);
    showEra(link.dataset.era);
  });
  byId('credits-retry').addEventListener('click', () => showEra(selectedEra));
  window.addEventListener('popstate', showEraFromUrl);
  showEraFromUrl();
})();
