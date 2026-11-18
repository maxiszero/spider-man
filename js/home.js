(() => {
  "use strict";

  const entries = [
    {
      id: "into-the-spider-verse", title: ["Into the","Spider-Verse."], category: "Animation",
      stillAlt: "Miles Morales swings between cars on a neon-lit Brooklyn street.",
      blurb: "One Brooklyn kid. A handful of borrowed masks. Miles Morales gets his own origin story in a city drawn like a living comic book.",
      start: 84, end: 91,
      preview: "https://video-ssl.itunes.apple.com/itunes-assets/Video118/v4/ce/45/1e/ce451e83-f6ad-9379-0057-b6d16ae1d743/mzvf_4469039092495092691.640x354.h264lc.U.p.m4v",
      store: "https://itunes.apple.com/us/movie/spider-man-into-the-spider-verse/id1444695454?uo=4"
    },
    {
      id: "spider-man-2", title: ["Spider-Man","2."], category: "Raimi trilogy",
      stillAlt: "Peter Parker reaches forward in a narrow city alley.",
      blurb: "Peter Parker is late for class, behind on rent and losing his grip on the mask. Then Otto Octavius takes his unfinished experiment into the streets.",
      start: 123, end: 129,
      preview: "https://video-ssl.itunes.apple.com/itunes-assets/Video118/v4/8d/36/81/8d3681ae-fd27-a588-61d0-4c6fea59c282/mzvf_3729982222607580709.640x458.h264lc.U.p.m4v",
      store: "https://itunes.apple.com/us/movie/spider-man-2/id270736157?uo=4"
    },
    {
      id: "amazing-spider-man", title: ["The Amazing","Spider-Man."], category: "Webb series",
      stillAlt: "Spider-Man scales a building at sunset.",
      blurb: "A clue in his father's briefcase sends Peter Parker to Oscorp. An encounter there changes what he can do, and what he owes the people around him.",
      start: 128.3, end: 134.5,
      preview: "https://video-ssl.itunes.apple.com/itunes-assets/Video128/v4/05/53/80/055380f6-583d-6cb8-4361-e221c1aae549/mzvf_2770200424256029248.640x354.h264lc.U.p.m4v",
      store: "https://itunes.apple.com/us/movie/the-amazing-spider-man/id546074197?uo=4"
    },
    {
      id: "no-way-home", title: ["No Way","Home."], category: "MCU",
      stillAlt: "Three Spider-Men crouch on a scaffold at night.",
      blurb: "With his face on every screen in New York, Peter turns to Doctor Strange for a fresh start. The spell opens the door to some familiar strangers.",
      start: 62, end: 69,
      preview: "https://video-ssl.itunes.apple.com/itunes-assets/Video116/v4/7b/46/b9/7b46b91b-53a0-8eb5-0cdb-c84da7411cec/mzvf_2437796329076422647.640x354.h264lc.U.p.m4v",
      store: "https://itunes.apple.com/us/movie/spider-man-no-way-home/id1598961641?uo=4"
    }
  ];
  const hero = document.querySelector(".spotlight");
  const screen = hero.querySelector(".spotlight-screen");
  const copy = hero.querySelector(".spotlight-copy");
  const title = hero.querySelector("h1");
  const facts = hero.querySelector("#spotlight-facts");
  const toggle = hero.querySelector(".clip-toggle");
  const note = hero.querySelector(".clip-note");
  const motion = matchMedia("(prefers-reduced-motion: reduce)");
  let wantsPlayback = !motion.matches && !navigator.connection?.saveData;
  let visible = false;
  let current = 0;
  let active = { entry: entries[0], frame: screen.firstElementChild };

  function mayPlay(clip) {
    return clip === active && wantsPlayback && visible && !document.hidden && !clip.failed;
  }

  function updateControl() {
    const playing = wantsPlayback && !active.failed;
    const label = active.failed ? "Retry film clip" : playing ? "Pause film clip" : "Play film clip";
    toggle.classList.toggle("is-playing", playing);
    toggle.setAttribute("aria-label", label);
    toggle.title = label;
    note.hidden = !active.failed;
  }

  function release(clip) {
    clearTimeout(clip.timeout);
    if (!clip.video) return;
    const video = clip.video;
    clip.video = null;
    video.pause();
    video.removeAttribute("src");
    video.load();
    video.remove();
  }

  function showFallback(clip) {
    if (clip !== active) return;
    clip.failed = true;
    release(clip);
    updateControl();
  }

  function requestPlayback(clip) {
    const video = clip.video;
    if (!mayPlay(clip) || !video) return;
    video.play().catch(error => {
      if (!mayPlay(clip) || video !== clip.video || error.name === "AbortError") return;
      if (error.name === "NotAllowedError") {
        wantsPlayback = false;
        syncPlayback();
      } else {
        showFallback(clip);
      }
    });
  }

  function loadClip(clip) {
    const { start, end, preview } = clip.entry;
    const video = document.createElement("video");
    clip.video = video;
    video.className = "spotlight-video";
    video.muted = true;
    video.defaultMuted = true;
    video.playsInline = true;
    video.disablePictureInPicture = true;
    video.preload = "metadata";
    video.setAttribute("aria-hidden", "true");

    // Loop only the selected scene, including browsers that pause at a media-fragment end.
    function checkPosition() {
      if (!mayPlay(clip) || clip.video !== video || video.seeking || !video.readyState) return;
      if (video.ended || video.currentTime >= end - .12 || video.currentTime < start - .35) {
        video.currentTime = start;
        if (video.paused) requestPlayback(clip);
      } else if (!video.paused && video.readyState >= 2) {
        clearTimeout(clip.timeout);
        video.classList.add("has-picture");
      }
    }
    for (const event of ["playing", "timeupdate", "seeked", "ended", "pause"]) {
      video.addEventListener(event, checkPosition);
    }
    video.addEventListener("error", () => { if (clip.video === video) showFallback(clip); });
    video.src = preview + "#t=" + start + "," + end;
    clip.frame.append(video);
  }

  function syncPlayback() {
    clearTimeout(active.timeout);
    if (mayPlay(active)) {
      if (!active.video) loadClip(active);
      if (!active.video.classList.contains("has-picture")) {
        const clip = active;
        clip.timeout = setTimeout(() => { if (mayPlay(clip)) showFallback(clip); }, 15000);
      }
      requestPlayback(active);
    } else {
      active.video?.pause();
    }
    updateControl();
  }

  function shift(amount) {
    const previous = active;
    current = (current + amount + entries.length) % entries.length;
    const entry = entries[current];
    const film = window.SpiderIndexFilms.films.find(item => item.id === entry.id);
    const frame = document.createElement("div");
    frame.className = "spotlight-frame";
    const still = new Image();
    still.className = "spotlight-art";
    still.alt = entry.stillAlt;
    still.src = "images/stills/" + entry.id + ".webp";
    frame.append(still);
    screen.append(frame);
    active = { entry, frame };
    clearTimeout(previous.timeout);
    previous.video?.pause();
    previous.frame.setAttribute("aria-hidden", "true");

    // The previous frame stays behind the incoming poster until the dissolve finishes.
    const retire = () => { release(previous); previous.frame.remove(); };
    if (!motion.matches && frame.animate) {
      const fade = frame.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 400, easing: "ease-out" });
      fade.finished.then(retire, retire);
      copy.getAnimations().forEach(animation => animation.cancel());
      copy.animate([{ opacity: .5, transform: "translateY(5px)" }, { opacity: 1, transform: "none" }],
        { duration: 290, easing: "cubic-bezier(.2,.7,.25,1)" });
    } else {
      retire();
    }

    title.firstElementChild.textContent = entry.title[0];
    title.lastElementChild.textContent = entry.title[1];
    facts.replaceChildren(String(film.year), document.createElement("i"), entry.category,
      document.createElement("i"), film.runtime + " min");
    hero.querySelector("#spotlight-blurb").textContent = entry.blurb;
    hero.querySelector("#spotlight-link").href = "film.html?id=" + entry.id;
    hero.querySelector("#spotlight-store").href = entry.store;
    hero.querySelector("#spotlight-count").textContent = String(current + 1).padStart(2, "0") + " / 04";
    hero.querySelector("[data-spotlight-status]").textContent = "Featured film " + (current + 1) + " of 4. " + film.title;
    syncPlayback();
  }

  toggle.hidden = false;
  toggle.addEventListener("click", () => {
    wantsPlayback = active.failed || !wantsPlayback;
    active.failed = false;
    syncPlayback();
  });
  hero.querySelectorAll("[data-direction]").forEach(button => {
    button.addEventListener("click", () => shift(Number(button.dataset.direction)));
  });
  motion.addEventListener("change", () => {
    wantsPlayback = !motion.matches && !navigator.connection?.saveData;
    if (!wantsPlayback) active.video?.classList.remove("has-picture");
    syncPlayback();
  });
  document.addEventListener("visibilitychange", syncPlayback);
  window.addEventListener("pagehide", () => { visible = false; syncPlayback(); });
  window.addEventListener("pageshow", () => {
    const rect = hero.getBoundingClientRect();
    visible = rect.bottom > 0 && rect.top < innerHeight;
    syncPlayback();
  });
  new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting;
    syncPlayback();
  }, { threshold: 0 }).observe(hero);
  updateControl();
})();
