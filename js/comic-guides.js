(() => {
  'use strict';

  const guides = window.SpiderIndexComics;
  const linkTo = guide => 'comic-guide.html?id=' + encodeURIComponent(guide.id);

  function node(tag, className, text) {
    const element = document.createElement(tag);
    if (className) element.className = className;
    if (text) element.textContent = text;
    return element;
  }

  function coverImage(guide, lazy = false) {
    const image = node('img');
    image.src = guide.cover;
    image.alt = lazy ? '' : 'Cover of ' + guide.coverTitle;
    image.decoding = 'async';
    if (lazy) image.loading = 'lazy';
    return image;
  }

  function card(guide) {
    const item = node('a', 'guide-card');
    item.href = linkTo(guide);
    const art = node('div', 'guide-thumb');
    art.append(coverImage(guide, true));
    const writing = node('div', 'guide-card-copy');
    const metadata = node('p', 'guide-meta', guide.date + ' · ' + guide.count + ' issues');
    const heading = node('h2', '', guide.title);
    const description = node('p', 'guide-pitch', guide.pitch);
    const foot = node('div', 'guide-card-foot');
    foot.append(node('span', '', guide.level));
    const arrow = node('span', 'comic-arrow', '↗');
    arrow.setAttribute('aria-hidden', 'true');
    foot.append(arrow);
    writing.append(metadata, heading, description, foot);
    item.append(art, writing);
    return item;
  }

  function renderCatalog() {
    const shelfNames = ['All guides', 'First reads', 'Classic Peter', 'Alternate worlds', 'Villains'];
    const url = new URL(window.location.href);
    const search = document.getElementById('guide-search');
    const filters = document.getElementById('guide-shelves');
    let shelf = url.searchParams.get('shelf');
    if (!shelfNames.includes(shelf)) shelf = shelfNames[0];
    search.value = url.searchParams.get('q') || '';

    function refresh(updateUrl) {
      const normalize = text => text.toLowerCase().replace(/[’']/g, '').replace(/[^a-z0-9]+/g, ' ');
      const typedIssues = Array.from(search.value.matchAll(/#\s*(\d+)/g), match => Number(match[1]));
      const words = normalize(search.value.replace(/#\s*\d+/g, '')).trim().split(/\s+/).filter(Boolean);
      const matches = guides.filter(guide => {
        // A search for #4 also finds a route covering issues #3–5.
        const hasIssues = typedIssues.every(number => guide.steps.some(([title]) => {
          const range = title.match(/#(\d+)(?:[–-](\d+))?/);
          return range && number >= Number(range[1]) && number <= Number(range[2] || range[1]);
        }));
        const searchable = normalize([guide.title, guide.pitch, guide.context, guide.team, guide.world,
          guide.date, guide.coverTitle, ...guide.steps.map(step => step[0])].join(' '));
        return (shelf === shelfNames[0] || guide.shelf.includes(shelf)) && hasIssues && words.every(word => searchable.includes(word));
      });
      document.getElementById('guide-grid').replaceChildren(...matches.map(card));
      document.getElementById('guide-count').textContent = matches.length + (matches.length === 1 ? ' reading guide' : ' reading guides');
      document.getElementById('guide-empty').hidden = matches.length > 0;
      Array.from(filters.children).forEach(button => button.setAttribute('aria-pressed', String(button.textContent === shelf)));
      if (updateUrl) {
        if (search.value) url.searchParams.set('q', search.value);
        else url.searchParams.delete('q');
        if (shelf !== shelfNames[0]) url.searchParams.set('shelf', shelf);
        else url.searchParams.delete('shelf');
        history.replaceState(null, '', url);
      }
    }

    shelfNames.forEach(name => {
      const button = node('button', '', name);
      button.type = 'button';
      button.addEventListener('click', () => { shelf = name; refresh(true); });
      filters.append(button);
    });
    search.addEventListener('input', () => refresh(true));
    document.getElementById('guide-reset').addEventListener('click', () => {
      shelf = shelfNames[0];
      search.value = '';
      refresh(true);
      search.focus();
    });
    refresh(false);
  }

  function renderDetail(container) {
    const id = new URLSearchParams(window.location.search).get('id');
    const guide = guides.find(item => item.id === id);
    if (!guide) {
      container.className = 'guide-empty';
      container.append(node('h1', '', 'Reading guide unavailable'), node('p', '', 'Choose a story in the guide directory to see its issue order.'));
      const directory = node('a', 'button secondary', 'Browse reading guides');
      directory.href = 'comics.html';
      container.append(directory);
      return;
    }
    document.title = guide.title + ' · Comic reading guide · Spider Index';
    document.querySelector('meta[name="description"]').content = guide.pitch;
    const layout = node('div', 'detail-layout');
    const art = node('figure', 'detail-art');
    art.append(coverImage(guide));
    const credit = node('figcaption');
    const source = node('a', '', guide.coverTitle);
    source.href = guide.source;
    credit.append(source, document.createTextNode(' · Cover © Marvel'));
    if (guide.artCredit) {
      const edition = node('a', '', guide.artCredit.label);
      edition.href = guide.artCredit.url;
      credit.append(document.createTextNode(' · '), edition);
    }
    art.append(credit);
    const writing = node('div', 'detail-writing');
    writing.append(node('p', 'kicker', guide.date + ' / ' + guide.world), node('h1', '', guide.title),
      node('p', 'detail-deck', guide.pitch));
    const facts = node('dl', 'detail-facts');
    [['Length', guide.count + ' issues'], ['Entry level', guide.level], ['Creators', guide.team]].forEach(([label, value]) => {
      const group = node('div');
      group.append(node('dt', '', label), node('dd', '', value));
      facts.append(group);
    });
    writing.append(facts, node('p', 'detail-context', guide.context));
    const order = node('section', 'detail-order');
    order.append(node('h2', '', 'Reading order'));
    const list = node('ol');
    guide.steps.forEach(([issue, note]) => {
      const step = node('li');
      step.append(node('h3', '', issue), node('p', '', note));
      list.append(step);
    });
    order.append(list);
    writing.append(order);
    const nextGuide = guides.find(item => item.id === guide.next);
    const next = node('aside', 'detail-next');
    next.append(node('p', 'kicker', 'Read next'), node('p', '', guide.bridge));
    const nextLink = node('a', '', nextGuide.title + ' →');
    nextLink.href = linkTo(nextGuide);
    next.append(nextLink);
    writing.append(next);
    layout.append(art, writing);
    container.append(layout);
  }

  const detail = document.getElementById('guide-detail');
  if (detail) renderDetail(detail);
  else if (document.getElementById('guide-grid')) renderCatalog();
})();
