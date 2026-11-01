'use strict';
// Assignment 6: Task 0. All jQuery features start after the DOM is available.
$(document).ready(function () {
  console.log('jQuery is ready!');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  $.fx.off = reduceMotion;

  // Tasks 1–3: literal, safe search; never interpret user input as HTML or regex.
  const $search = $('#faq-search');
  const $items = $('.faq-item');
  const $suggestions = $('#faq-suggestions');
  const records = $items.map(function () {
    return { item: this, question: $(this).find('.faq-label').text(), answer: $(this).find('.faq-answer p').text() };
  }).get();
  let activeSuggestion = -1;
  function highlight($element, text, query) {
    $element.empty();
    if (!query) { $element.text(text); return; }
    let offset = 0;
    let found;
    while ((found = text.toLowerCase().indexOf(query.toLowerCase(), offset)) !== -1) {
      $element.append(document.createTextNode(text.slice(offset, found)));
      $element.append($('<mark>').text(text.slice(found, found + query.length)));
      offset = found + query.length;
    }
    $element.append(document.createTextNode(text.slice(offset)));
  }
  function closeSuggestions() {
    $suggestions.prop('hidden', true);
    $search.attr('aria-expanded', 'false').removeAttr('aria-activedescendant');
    activeSuggestion = -1;
  }
  function searchFAQ(showSuggestions = true) {
    const query = $search.val().trim();
    let matches = 0;
    $suggestions.empty();
    records.forEach((record) => {
      const visible = !query || (record.question + ' ' + record.answer).toLowerCase().includes(query.toLowerCase());
      $(record.item).prop('hidden', !visible);
      highlight($(record.item).find('.faq-label'), record.question, query);
      highlight($(record.item).find('.faq-answer p'), record.answer, query);
      // Matching answers open during search; clearing restores the closed state.
      const expanded = Boolean(query && visible);
      $(record.item).find('.faq-question').attr('aria-expanded', String(expanded));
      $(record.item).find('.faq-answer').toggleClass('is-open', expanded).attr('aria-hidden', String(!expanded)).prop('inert', !expanded);
      if (visible) {
        matches++;
        if (query) $('<li>', { role: 'option', id: `suggestion-${matches}`, 'aria-selected': 'false', tabindex: -1 }).text(record.question).appendTo($suggestions);
      }
    });
    $('#search-status').text(matches ? `${matches} matching question${matches === 1 ? '' : 's'}.` : 'No matches. Try Peter, movies, or web.');
    activeSuggestion = -1;
    $search.removeAttr('aria-activedescendant');
    const open = Boolean(query && matches && showSuggestions);
    $suggestions.prop('hidden', !open);
    $search.attr('aria-expanded', String(open));
  }
  $search.on('input', () => searchFAQ()).on('keydown', function (event) {
    const options = $suggestions.children();
    if (event.key === 'Escape') { event.preventDefault(); closeSuggestions(); return; }
    if (event.key === 'Enter' && activeSuggestion >= 0) {
      event.preventDefault(); options.eq(activeSuggestion).trigger('click'); return;
    }
    if (!['ArrowDown', 'ArrowUp'].includes(event.key) || !options.length) return;
    event.preventDefault();
    activeSuggestion = (activeSuggestion + (event.key === 'ArrowDown' ? 1 : -1) + options.length) % options.length;
    $suggestions.prop('hidden', false); $search.attr('aria-expanded', 'true');
    options.attr('aria-selected', 'false');
    const $active = options.eq(activeSuggestion).attr('aria-selected', 'true');
    $search.attr('aria-activedescendant', $active.attr('id'));
  });
  $suggestions.on('mousedown', (event) => event.preventDefault()).on('click', '[role=option]', function () {
    $search.val($(this).text()); searchFAQ(false); $search.trigger('focus');
  });
  $search.on('blur', closeSuggestions);

  // Task 4: frame-throttled scroll percentage, recomputed after layout changes.
  let scrollFrame = false;
  function progress() {
    const maximum = document.documentElement.scrollHeight - window.innerHeight;
    const percent = maximum > 0 ? Math.min(100, Math.max(0, window.scrollY / maximum * 100)) : 100;
    $('#reading-progress').css('width', `${percent}%`);
    $('.reading-track').attr('aria-valuenow', Math.round(percent));
    scrollFrame = false;
  }
  function scheduleProgress() { if (!scrollFrame) { scrollFrame = true; requestAnimationFrame(progress); } }
  $(window).on('scroll resize', scheduleProgress);
  new ResizeObserver(scheduleProgress).observe(document.body);
  progress();

  // Task 5: real site counts animate once on entering the viewport.
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const $number = $(entry.target);
      const target = Number($number.attr('data-count'));
      $({ value: 0 }).animate({ value: target }, {
        duration: reduceMotion ? 0 : 1100,
        step: (value) => $number.text(Math.floor(value)),
        complete: () => $number.text(target)
      });
      counterObserver.unobserve(entry.target);
    });
  });
  $('.number-counter').each(function () { $(this).text('0'); counterObserver.observe(this); });

  // Task 7: one temporary notice; repeated actions replace it, not queue it.
  let noticeTimer;
  function notify(message) {
    clearTimeout(noticeTimer);
    const $notice = $('#site-notice');
    const host = document.querySelector('dialog[open]') || document.body;
    $notice.appendTo(host).stop(true, true).text(message).fadeIn(160);
    noticeTimer = setTimeout(() => $notice.fadeOut(250), 2800);
  }
  $(document).on('demo:success', () => notify('Demo completed successfully. No data was sent.'));

  // Task 6: validated forms simulate a request; reset/close cancels pending work.
  $('[data-validate]').each(function () {
    const form = this;
    const $form = $(form);
    const $submit = $form.find('[type=submit]');
    const label = $submit.text();
    let timer;
    let disabledState = [];
    function restore() {
      clearTimeout(timer);
      disabledState.forEach(([element, wasDisabled]) => { element.disabled = wasDisabled; });
      disabledState = [];
      $form.removeAttr('data-busy aria-busy');
      $submit.text(label);
    }
    $form.on('demo:submit', function (event) {
      event.preventDefault();
      if ($form.attr('data-busy') === 'true') return;
      $form.attr({ 'data-busy': 'true', 'aria-busy': 'true' });
      $form.find('input, textarea, select, button').each(function () { disabledState.push([this, this.disabled]); this.disabled = true; });
      $submit.empty().append($('<span>', { class: 'submit-spinner', 'aria-hidden': 'true' }), document.createTextNode(' Please wait…'));
      timer = setTimeout(() => { restore(); event.originalEvent.detail.complete(); }, 1100);
    }).on('reset', restore);
  });

  // Task 8: only announce success after the clipboard promise succeeds.
  $('[data-copy]').on('click', async function () {
    const $button = $(this);
    if ($button.prop('disabled')) return;
    $button.prop('disabled', true);
    const original = $button.text();
    try {
      await navigator.clipboard.writeText($($button.attr('data-copy')).text());
      $button.text('✓ Copied').attr('title', 'Copied to clipboard!');
      $button.siblings('.copy-feedback').text('Copied to clipboard!');
      notify('Quote copied to clipboard!');
    } catch {
      $button.siblings('.copy-feedback').text('Clipboard unavailable. Select the quote and copy it manually.');
    }
    setTimeout(() => { $button.text(original).prop('disabled', false).removeAttr('title'); $button.siblings('.copy-feedback').text(''); }, 2800);
  });

  // Task 9: reserve existing image boxes and set real src only near the viewport.
  const imageObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const $image = $(entry.target);
      $image.one('load', () => $image.addClass('is-loaded'));
      $image.attr('src', $image.attr('data-src')).removeAttr('data-src');
      imageObserver.unobserve(entry.target);
    });
  }, { rootMargin: '160px' });
  $('img[data-src]').each(function () { imageObserver.observe(this); });
});
