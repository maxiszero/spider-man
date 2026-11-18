(() => {
  let theme = "light";
  try {
    const stored = localStorage.getItem("spider-index.theme");
    if (stored === "dark" || stored === "light") theme = stored;
  } catch { /* The switch also works when storage is unavailable. */ }
  document.documentElement.dataset.theme = theme;
})();
