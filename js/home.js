(() => {
  "use strict";

  const entries = [
    {
      id: "into-the-spider-verse", title: ["Into the", "Spider-Verse."], category: "Animation",
      stillAlt: "Miles Morales swings between cars on a neon-lit Brooklyn street.",
      blurb: "One Brooklyn kid. A handful of borrowed masks. Miles Morales gets his own origin story in a city drawn like a living comic book.",
      videoId: "g4Hbz2jLxvQ", start: 89, end: 97
    },
    {
      id: "spider-man-2", title: ["Spider-Man", "2."], category: "Raimi trilogy",
      stillAlt: "Peter Parker reaches forward in a narrow city alley.",
      blurb: "Peter Parker is late for class, behind on rent and losing his grip on the mask. Then Otto Octavius takes his unfinished experiment into the streets.",
      videoId: "3jBFwltrxJw", start: 40, end: 48
    },
    {
      id: "amazing-spider-man", title: ["The Amazing", "Spider-Man."], category: "Webb series",
      stillAlt: "Spider-Man scales a building at sunset.",
      blurb: "A clue in his father's briefcase sends Peter Parker to Oscorp. An encounter there changes what he can do, and what he owes the people around him.",
      videoId: "-tnxzJ0SSOw", start: 28, end: 36
    },
    {
      id: "no-way-home", title: ["No Way", "Home."], category: "MCU",
      stillAlt: "Three Spider-Men crouch on a scaffold at night.",
      blurb: "With his face on every screen in New York, Peter turns to Doctor Strange for a fresh start. The spell opens the door to some familiar strangers.",
      videoId: "JfVOs4VSpmA", start: 96, end: 104
    }
  ];
  const hero = document.querySelector(".spotlight");
  const screen = hero.querySelector(".spotlight-screen");
  const stage = hero.querySelector(".spotlight-player");
  const art = hero.querySelector(".spotlight-art");
  const copy = hero.querySelector(".spotlight-copy");
  const title = hero.querySelector("h1");
  const toggle = hero.querySelector(".clip-toggle");
  const note = hero.querySelector(".clip-note");
  const motion = matchMedia("(prefers-reduced-motion: reduce)");
  let wantsPlayback = !motion.matches && !navigator.connection?.saveData;
  let visible = false;
  let current = 0;
  let clip = { entry: entries[0] };
  let apiPromise;

  function loadApi() {
    if (window.YT?.Player) return Promise.resolve(window.YT);
    if (apiPromise) return apiPromise;
    apiPromise = new Promise((resolve, reject) => {
      const script = document.createElement("script");
      function fail() {
        clearTimeout(timer);
        script.remove();
        apiPromise = null;
        reject(new Error("Trailer player unavailable"));
      }
      const timer = setTimeout(fail, 12000);
      window.onYouTubeIframeAPIReady = () => {
        clearTimeout(timer);
        resolve(window.YT);
      };
      script.src = "https://www.youtube.com/iframe_api";
      script.onerror = fail;
      document.head.append(script);
    });
    return apiPromise;
  }

  function mayPlay(item) {
    return item === clip && !item.failed && wantsPlayback && visible && !document.hidden;
  }

  function updateControl() {
    const label = clip.failed ? "Retry film clip" : wantsPlayback ? "Pause film clip" : "Play film clip";
    toggle.classList.toggle("is-playing", wantsPlayback && !clip.failed);
    toggle.setAttribute("aria-label", label);
    toggle.title = label;
    note.hidden = !clip.failed;
  }

  function destroy(item) {
    clearTimeout(item.timeout);
    clearInterval(item.loop);
    item.player?.destroy();
    item.player = null;
    item.ready = item.loading = false;
    stage.replaceChildren();
  }

  function showFallback(item) {
    if (item !== clip) return;
    item.failed = true;
    destroy(item);
    updateControl();
  }

  function replay(item) {
    item.player.seekTo(item.entry.start, true);
    item.player.playVideo();
  }

  function observeState(item, state) {
    if (item !== clip || !item.ready) return;
    clearInterval(item.loop);
    if (state === YT.PlayerState.PLAYING) {
      clearTimeout(item.timeout);
      if (!visible || document.hidden) {
        item.player.pauseVideo();
        return;
      }
      wantsPlayback = true;
      // YouTube reports ENDED at the segment boundary. Also bound native scrubbing to the excerpt.
      item.loop = setInterval(() => {
        if (!mayPlay(item)) return;
        const time = item.player.getCurrentTime();
        if (time >= item.entry.end - .25 || (time > 0 && time < item.entry.start - .6)) replay(item);
      }, 200);
    } else if (state === YT.PlayerState.ENDED && mayPlay(item)) {
      replay(item);
    } else if (state === YT.PlayerState.PAUSED && visible && !document.hidden) {
      wantsPlayback = false;
    }
    updateControl();
  }

  async function createPlayer(item) {
    item.loading = true;
    try {
      const api = await loadApi();
      if (!mayPlay(item)) { item.loading = false; return; }
      const mount = document.createElement("div");
      stage.replaceChildren(mount);
      item.timeout = setTimeout(() => showFallback(item), 20000);
      const { videoId, start, end } = item.entry;
      item.player = new api.Player(mount, {
        width: "100%", height: "100%", videoId,
        playerVars: { controls: 1, playsinline: 1, rel: 0, origin: location.origin, start, end },
        events: {
          onReady(event) {
            if (item !== clip || item.failed) return;
            item.ready = true;
            item.loading = false;
            event.target.getIframe().title = item.entry.title.join(" ") + " Official trailer";
            event.target.mute();
            if (mayPlay(item)) event.target.playVideo();
            else clearTimeout(item.timeout);
          },
          onStateChange: event => observeState(item, event.data),
          onError: () => showFallback(item),
          onAutoplayBlocked() {
            if (item !== clip) return;
            clearTimeout(item.timeout);
            wantsPlayback = false;
            updateControl();
          }
        }
      });
    } catch {
      showFallback(item);
    }
  }

  function syncPlayback() {
    if (mayPlay(clip)) {
      if (clip.ready) clip.player.playVideo();
      else if (!clip.loading) createPlayer(clip);
    } else if (clip.ready) {
      clip.player.pauseVideo();
    }
    updateControl();
  }

  function shift(amount) {
    const previous = clip;
    current = (current + amount + entries.length) % entries.length;
    const entry = entries[current];
    const film = window.SpiderIndexFilms.films.find(item => item.id === entry.id);
    clip = { entry };
    destroy(previous);
    art.alt = entry.stillAlt;
    art.src = "images/stills/" + entry.id + ".webp";
    if (!motion.matches && copy.animate) {
      for (const element of [art, copy]) {
        element.getAnimations().forEach(animation => animation.cancel());
        element.animate([{ opacity: .6 }, { opacity: 1 }], { duration: 280, easing: "ease-out" });
      }
    }
    title.firstElementChild.textContent = entry.title[0];
    title.lastElementChild.textContent = entry.title[1];
    hero.querySelector("#spotlight-facts").replaceChildren(String(film.year), document.createElement("i"),
      entry.category, document.createElement("i"), film.runtime + " min");
    hero.querySelector("#spotlight-blurb").textContent = entry.blurb;
    hero.querySelector("#spotlight-link").href = "film.html?id=" + entry.id;
    hero.querySelector("#spotlight-trailer").href = "https://www.youtube.com/watch?v=" + entry.videoId;
    hero.querySelector("#spotlight-count").textContent = String(current + 1).padStart(2, "0") + " / 04";
    hero.querySelector("[data-spotlight-status]").textContent = "Featured film " + (current + 1) + " of 4. " + film.title;
    syncPlayback();
  }

  toggle.hidden = false;
  toggle.addEventListener("click", () => {
    wantsPlayback = clip.failed || !wantsPlayback;
    clip.failed = false;
    syncPlayback();
  });
  hero.querySelectorAll("[data-direction]").forEach(button => {
    button.addEventListener("click", () => shift(Number(button.dataset.direction)));
  });
  motion.addEventListener("change", () => {
    wantsPlayback = !motion.matches && !navigator.connection?.saveData;
    if (!wantsPlayback) { const old = clip; clip = { entry: old.entry }; destroy(old); }
    syncPlayback();
  });
  document.addEventListener("visibilitychange", syncPlayback);
  window.addEventListener("pagehide", () => { visible = false; syncPlayback(); });
  const observer = new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting && entry.intersectionRatio >= .5;
    syncPlayback();
  }, { threshold: [0, .5] });
  observer.observe(screen);
  window.addEventListener("pageshow", event => {
    if (event.persisted) { observer.unobserve(screen); observer.observe(screen); }
  });
  updateControl();
})();
