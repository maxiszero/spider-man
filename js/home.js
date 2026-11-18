(() => {
  "use strict";
  const entries = [
    {title:["Into the","Spider-Verse."], id:"into-the-spider-verse", still:"into-the-spider-verse", facts:["2018","Animation","117 min"], alt:"Miles Morales swings between cars on a neon-lit Brooklyn street.", blurb:"One Brooklyn kid. A handful of borrowed masks. Miles Morales gets his own origin story in a city drawn like a living comic book."},
    {title:["Spider-Man","2."], id:"spider-man-2", still:"spider-man-2", facts:["2004","Raimi trilogy","127 min"], alt:"Peter Parker reaches forward in a narrow city alley.", blurb:"Peter Parker is late for class, behind on rent and losing his grip on the mask. Then Otto Octavius takes his unfinished experiment into the streets."},
    {title:["The Amazing","Spider-Man."], id:"amazing-spider-man", still:"amazing-spider-man", facts:["2012","Webb series","136 min"], alt:"Spider-Man scales a building at sunset.", blurb:"A clue in his father's briefcase sends Peter Parker to Oscorp. An encounter there changes what he can do, and what he owes the people around him."},
    {title:["No Way","Home."], id:"no-way-home", still:"no-way-home", facts:["2021","MCU","148 min"], alt:"Three Spider-Men crouch on a scaffold at night.", blurb:"With his face on every screen in New York, Peter turns to Doctor Strange for a fresh start. The spell opens the door to some familiar strangers."}
  ];
  const title = document.querySelector("#spotlight-title");
  const facts = document.querySelector("#spotlight-facts");
  const art = document.querySelector("#spotlight-art");
  const status = document.querySelector("[data-spotlight-status]");
  let current = 0;
  function shift(amount) {
    current = (current + amount + entries.length) % entries.length;
    const entry = entries[current];
    title.firstElementChild.textContent = entry.title[0];
    title.lastElementChild.textContent = entry.title[1];
    facts.replaceChildren();
    entry.facts.forEach((fact, i) => {
      if (i) facts.append(document.createElement("i"));
      facts.append(document.createTextNode(fact));
    });
    art.src = "images/stills/" + entry.still + ".webp";
    art.alt = entry.alt;
    document.querySelector("#spotlight-blurb").textContent = entry.blurb;
    document.querySelector("#spotlight-link").href = "film.html?id=" + entry.id;
    document.querySelector("#spotlight-count").textContent = "0" + (current + 1) + " / 04";
    status.textContent = "Featured film " + (current + 1) + " of 4. " + entry.title.join(" ");
  }
  document.querySelectorAll("[data-direction]").forEach(button => button.addEventListener("click", () => shift(Number(button.dataset.direction))));
})();
