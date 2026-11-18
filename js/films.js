(() => {
  'use strict';

  const eras = {
    raimi: { name: 'The Raimi Trilogy', shortName: 'Raimi', lead: 'Tobey Maguire', years: '2002–2007' },
    webb: { name: 'The Amazing Spider-Man', shortName: 'Webb', lead: 'Andrew Garfield', years: '2012–2014' },
    mcu: { name: 'The MCU Films', shortName: 'MCU', lead: 'Tom Holland', years: '2017–2026' },
    verse: { name: 'The Spider-Verse', shortName: 'Spider-Verse', lead: 'Shameik Moore', years: '2018–2023' }
  };

  const films = [
    {
      id: 'spider-man', title: 'Spider-Man', year: 2002, era: 'raimi', runtime: 121,
      director: 'Sam Raimi', studioSlug: 'spiderman',
      synopsis: 'After a spider bite changes his life, shy Queens teenager Peter Parker tries to earn a little money with his new powers. One decision sends him down a different path, just as the Green Goblin takes to the skies.',
      note: 'Watch the dinner at Aunt May’s. A single drop of blood turns a family meal into one of the film’s tensest scenes.'
    },
    {
      id: 'spider-man-2', title: 'Spider-Man 2', year: 2004, era: 'raimi', runtime: 127,
      director: 'Sam Raimi', studioSlug: 'spiderman2',
      synopsis: 'Rent is due, classes are slipping away, and Mary Jane has stopped waiting. As Peter considers giving up the suit, a failed fusion experiment binds scientist Otto Octavius to four mechanical arms.',
      note: 'Notice how the camera gives each of Doc Ock’s metal arms its own personality, even when their owner stays perfectly still.'
    },
    {
      id: 'spider-man-3', title: 'Spider-Man 3', year: 2007, era: 'raimi', runtime: 139,
      director: 'Sam Raimi', studioSlug: 'spiderman3',
      synopsis: 'New York finally loves Spider-Man. Peter’s confidence curdles into resentment when a black symbiote attaches itself to his suit, and a missing piece of his uncle’s story brings old wounds back to the surface.',
      note: 'Look for the photograph in Sandman’s first transformation. A small object and a few handfuls of sand tell his story without dialogue.'
    },
    {
      id: 'amazing-spider-man', title: 'The Amazing Spider-Man', year: 2012, era: 'webb', runtime: 136,
      director: 'Marc Webb', studioSlug: 'theamazingspiderman',
      synopsis: 'A clue in his father’s old briefcase sends teenage Peter Parker to Oscorp. His search for answers crosses paths with Gwen Stacy and a scientist whose experiment could change the city.',
      note: 'Follow Peter’s hands as he designs his web-shooters. Their little clicks and reloads make swinging feel like something he had to learn.'
    },
    {
      id: 'amazing-spider-man-2', title: 'The Amazing Spider-Man 2', year: 2014, era: 'webb', runtime: 142,
      director: 'Marc Webb', studioSlug: 'theamazingspiderman2',
      synopsis: 'Graduation opens a future for Gwen and Peter. Meanwhile, a lonely Oscorp employee gains control of electricity, and an old friend returns with a request Peter may be unable to grant.',
      note: 'Listen for the voices in Electro’s score. His private anxieties become part of the music that fills Times Square.'
    },
    {
      id: 'homecoming', title: 'Spider-Man: Homecoming', year: 2017, era: 'mcu', runtime: 133,
      director: 'Jon Watts', studioSlug: 'spidermanhomecoming',
      synopsis: 'Back in Queens after meeting the Avengers, Peter Parker wants a bigger assignment. Tracking a crew that sells weapons made from alien technology puts his neighborhood and his ordinary high-school life on a collision course.',
      note: 'Watch Peter cross a golf course. Without tall buildings to swing from, he has to cover the distance like any other kid.'
    },
    {
      id: 'into-the-spider-verse', title: 'Spider-Man: Into the Spider-Verse', year: 2018, era: 'verse', runtime: 117,
      director: 'Bob Persichetti, Peter Ramsey and Rodney Rothman', studioSlug: 'spidermanintothespiderverse',
      synopsis: 'Brooklyn teenager Miles Morales is still figuring out a new school when a spider bite gives him powers. A collider brings visitors from other dimensions into his city, each with a different idea of who Spider-Man can be.',
      note: 'In the leap from the skyscraper, the city is upside down. Miles is falling through space, but the frame makes him appear to rise.'
    },
    {
      id: 'far-from-home', title: 'Spider-Man: Far From Home', year: 2019, era: 'mcu', runtime: 129,
      director: 'Jon Watts', studioSlug: 'spidermanfarfromhome',
      synopsis: 'Peter hopes a school trip to Europe will give him time with MJ. When towering elemental creatures attack, a mysterious new hero offers him a chance to share the weight of the job.',
      note: 'Look for the way an ordinary school itinerary structures the action. Each stop takes Peter farther from the streets he knows.'
    },
    {
      id: 'no-way-home', title: 'Spider-Man: No Way Home', year: 2021, era: 'mcu', runtime: 148,
      director: 'Jon Watts', studioSlug: 'spidermannowayhome',
      synopsis: 'With his identity exposed, Peter turns to Doctor Strange in the hope of getting his life back. A spell gone wrong draws visitors from other worlds into his own.',
      note: 'Pay attention to the sound around Peter in Aunt May’s apartment. The change in what he can hear tells you his spider-sense has kicked in.'
    },
    {
      id: 'across-the-spider-verse', title: 'Spider-Man: Across the Spider-Verse', year: 2023, era: 'verse', runtime: 140,
      director: 'Joaquim Dos Santos, Kemp Powers and Justin K. Thompson', studioSlug: 'spidermanacrossthespiderverse',
      synopsis: 'A reunion with Gwen Stacy leads Miles Morales to a society of Spider-People. Their rules bring him into conflict with the people he thought would understand him best.',
      note: 'Watch the watercolor backgrounds in Gwen’s world. Their colors bleed and shift with her emotions, even in the middle of a conversation.'
    },
    {
      id: 'brand-new-day', title: 'Spider-Man: Brand New Day', year: 2026, era: 'mcu', runtime: 139,
      director: 'Destin Daniel Cretton', studioSlug: 'spidermanbrandnewday',
      synopsis: 'Four years after the world forgot his identity, Peter spends his days and nights as Spider-Man. His old friends have built lives without him, and a change in his powers forces him to reconsider how long he can work alone.',
      note: 'Compare this Peter’s working life with his school days in Homecoming. Keeping the city safe has become his full-time job.'
    }
  ].map(film => ({ ...film, image: 'images/films/' + film.id + '.webp' }));

  // Each film has its own key so saving in one tab cannot overwrite a different film in another.
  function storageKey(id) {
    const email = localStorage.getItem('spider-index.session');
    const shelf = email ? 'account.' + encodeURIComponent(email) : 'guest';
    return 'spider-index.watchlist.' + shelf + '.' + id;
  }

  function getSavedIds() {
    try {
      return films.map(({ id }) => ({ id, savedAt: Number(localStorage.getItem(storageKey(id))) }))
        .filter(item => item.savedAt > 0)
        .sort((a, b) => b.savedAt - a.savedAt)
        .map(item => item.id);
    } catch {
      return [];
    }
  }

  function isSaved(id) {
    return getSavedIds().includes(id);
  }

  function toggleSaved(id) {
    if (!films.some(film => film.id === id)) return false;
    const key = storageKey(id);
    const saved = !localStorage.getItem(key);
    if (saved) localStorage.setItem(key, String(Date.now()));
    else localStorage.removeItem(key);
    window.dispatchEvent(new CustomEvent('spider-index:watchlist', { detail: { id, saved } }));
    return saved;
  }

  window.SpiderIndexFilms = { films, eras, getSavedIds, isSaved, toggleSaved };
})();
