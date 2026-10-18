# Spider-Man — one evolving website

Team: Ali and Arlan. Astana IT University.

Assignments 1, 2, 3 and 4 are integrated into the same four root pages. Each assignment improves the existing website.

Live site: https://spider-man-front.netlify.app/

## Pages
- index.html: original parallax hero, story, powers, film table, custom responsive cards, Grid gallery and Bootstrap carousel.
- movies.html: film posters, Bootstrap card components and credits.
- about.html: team, biography, custom Flexbox cards and named CSS Grid areas.
- contact.html: named CSS Grid layout, Bootstrap form and gallery. Form is a classroom demo; messages are not sent.

## Assignment 3 task map
1. Responsive typography: css/responsive.css, .mq-type on hero, section headings and Home story.
2. CSS-only card layout: .mq-card-row / .mq-card, 1 column below 768px, 2 from 768px, 3 from 992px. Card placement uses our CSS; buttons use Bootstrap.
3. Bootstrap Grid: Home story uses col-12 col-md-6 col-lg-6; abilities use col-lg-4.
4. Spacing: Bootstrap g-3, g-4, p-3, mb-3, mt-3 and responsive utilities.
5. Bootstrap navbar: all pages, hamburger below 992px.
6. Buttons: btn, btn-lg, btn-sm, btn-outline-light and btn-group.
7. Carousel: nine slides on Home, indicators and previous/next controls. Manual playback.
8. Bootstrap cards: Movies uses card, card-body, card-title and card-img-top.
9. Form: Contact uses form-control, form-select, form-check, input-group and fieldset/legend.
10. Accessibility: labelled navigation, current-page indication, keyboard controls, labels, alt text and reduced-motion support.

Assignments 1–2 remain present: semantic HTML, tables, lists, Flexbox cards, named Grid areas and nine-image Grid gallery.

## Styles and running locally
Bootstrap 5.3.3 CSS/JS are loaded from CDN. css/style.css keeps the original Spider-Man design; css/responsive.css integrates the new responsive behavior. Internet access is needed for Bootstrap and Google Fonts.

Run `python -m http.server 5173`, then open http://localhost:5173/.

Old assignment3/*.html URLs redirect to the matching root pages. Previous assignment versions are available in Git history. The report folder contains older Assignment 2 submission materials.


## Assignment 4 — Introduction to JavaScript
Shared implementation: `js/main.js`, loaded with `defer` on all four pages. Styling: `css/interactive.css`.

| Task | Where to demonstrate | Implementation |
|---|---|---|
| 1. Form validation | Join Spider Club popup on any page; Contact form | Submit prevention, required fields, whitespace checks, email format, password minimum 8 characters and confirmation; inline errors and focus on first invalid field |
| 2. FAQ accordion | Home, #faq (Behind the mask) | Click toggles aria-expanded, inert and is-open; CSS grid transition animates answers; closed initially |
| 3. Popup form | Join Spider Club button under each hero | showModal(), close button, outside click and Escape; native focus containment and return to opener |
| 4. Background color | Background button under each hero | Array of four palettes; cycle index; JS updates body.style.backgroundColor; CSS transition |
| 5. Current date and time | Your local time, under each hero | new Date(), Intl.DateTimeFormat, ISO datetime attribute, setInterval every second; viewer local timezone |

The fan-club signup and contact form are browser-only demos: no account, email delivery, storage or network submission. Passwords clear on successful validation and when the popup closes. Reset clears validation errors. Background choice lasts until navigation/reload.

Suggested defense ownership (each person must understand and demonstrate their component): Ali — accordion, background colors and clock; Arlan — validation and popup. This is a suggested split, not a claim about who authored the code.

Validation performed in Chromium at 390px and 1280px: invalid/valid forms, empty/whitespace fields, bad email, short/mismatched passwords, all popup close methods, FAQ toggles, clock tick, background change and all-page overflow.

Report/ZIP submission is still required by the assignment; the existing report folder belongs to Assignment 2. No Assignment 4 report has been created.
