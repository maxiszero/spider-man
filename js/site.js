(() => {
  "use strict";
  const header = document.querySelector("[data-site-header]");
  const footer = document.querySelector("[data-site-footer]");
  if (!header || !footer) return;

  const paths = {
    bookmark: '<path d="M6 4h12v16l-6-4-6 4z"/>',
    moon: '<path d="M20.5 13.2A8.5 8.5 0 0 1 10.8 3.5 8.5 8.5 0 1 0 20.5 13.2Z"/>',
    sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M2 12h2m16 0h2M5 5l1.4 1.4m11.2 11.2L19 19M5 19l1.4-1.4M17.6 6.4 19 5"/>',
    user: '<circle cx="12" cy="8" r="3.4"/><path d="M5 20v-1a7 7 0 0 1 14 0v1"/>',
    menu: '<path d="M3 6h18M3 12h18M3 18h18"/>',
    close: '<path d="m5 5 14 14M19 5 5 19"/>'
  };
  const icon = name => '<svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">' + paths[name] + '</svg>';
  const brand = '<a class="wordmark" href="index.html" aria-label="Spider Index home"><img src="images/favicon.svg" width="34" height="34" alt=""><span>SPIDER<span class="brand-index">INDEX</span></span></a>';
  const page = document.body.dataset.page;
  const nav = [["home", "Index", "index.html"], ["films", "Film archive", "movies.html"], ["eras", "Screen eras", "eras.html"], ["watchlist", "Watchlist", "watchlist.html"]];
  const links = nav.map(([key, label, href]) => '<a href="' + href + '"' + (page === key ? ' aria-current="page"' : '') + '>' + (key === "watchlist" ? icon("bookmark") : "") + label + '</a>').join("");
  let signedIn = false;
  try { signedIn = Boolean(localStorage.getItem("spider-index.session")); } catch { /* Local-only demo. */ }

  header.innerHTML = '<a class="skip-link" href="#main-content">Skip to content</a><div class="wrap masthead">' + brand +
    '<nav aria-label="Main" id="main-nav">' + links + '</nav><div class="header-tools"><button type="button" class="tool-button" data-theme-toggle></button>' +
    '<a class="account-link" href="' + (signedIn ? 'profile.html' : 'login.html') + '"' + (page === "account" ? ' aria-current="page"' : '') + '>' + icon("user") + '<span>' + (signedIn ? 'Profile' : 'Sign in') + '</span></a>' +
    '<button class="tool-button mobile-menu" aria-controls="main-nav" aria-expanded="false" aria-label="Open navigation" type="button">' + icon("menu") + '</button></div></div>';
  footer.innerHTML = '<div class="wrap footer-inner">' + brand + '<p>An independent Spider-Man film guide.</p><nav aria-label="Footer"><a href="about.html">About the index</a><a href="movies.html">Film archive</a><a href="watchlist.html">Watchlist</a></nav></div>';
  const main = document.querySelector("main");
  if (main && !main.id) main.id = "main-content";
  if (main) header.querySelector(".skip-link").href = "#" + main.id;

  const themeButton = header.querySelector("[data-theme-toggle]");
  function showTheme(theme) {
    document.documentElement.dataset.theme = theme;
    const dark = theme === "dark";
    themeButton.innerHTML = icon(dark ? "sun" : "moon");
    themeButton.setAttribute("aria-label", "Dark mode");
    themeButton.setAttribute("aria-pressed", String(dark));
    themeButton.title = dark ? "Switch to light mode" : "Switch to dark mode";
  }
  showTheme(document.documentElement.dataset.theme === "dark" ? "dark" : "light");
  themeButton.addEventListener("click", () => {
    const theme = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
    showTheme(theme);
    try { localStorage.setItem("spider-index.theme", theme); } catch { /* Keep the current page usable. */ }
  });
  window.addEventListener("storage", event => {
    if (event.key === "spider-index.theme") showTheme(event.newValue === "dark" ? "dark" : "light");
    if (event.key === "spider-index.session") location.reload();
  });
  const menu = header.querySelector(".mobile-menu");
  function openMenu(open) {
    header.classList.toggle("nav-open", open);
    menu.setAttribute("aria-expanded", String(open));
    menu.setAttribute("aria-label", open ? "Close navigation" : "Open navigation");
    menu.innerHTML = icon(open ? "close" : "menu");
  }
  menu.addEventListener("click", () => openMenu(menu.getAttribute("aria-expanded") !== "true"));
  document.addEventListener("keydown", event => {
    if (event.key === "Escape" && header.classList.contains("nav-open")) { openMenu(false); menu.focus(); }
  });
  document.addEventListener("click", event => {
    if (!event.composedPath().includes(header) && header.classList.contains("nav-open")) openMenu(false);
  });
  matchMedia("(min-width: 861px)").addEventListener("change", e => { if (e.matches) openMenu(false); });
})();
