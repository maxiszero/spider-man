# Spider Index

An English-language guide to the Spider-Man films by Ali and Arlan, group SE-2515, at Astana IT University. Explore four screen series, find a starting film and save titles for a movie night.

[Open the live website](https://spider-man-front.netlify.app/)

## Run locally

From this directory run `python -m http.server 5173` and open [localhost:5173](http://localhost:5173/). Deploy the repository root as a static site. There is no build step or API key. The account demo uses Web Crypto and needs HTTPS or localhost.

## Explore the site

- **Index** features four films, links to their screen eras and offers a film finder. Choosing a mood and an opener or sequel gives eight possible recommendations, each with a reason and a watchlist button.
- The spotlight plays a muted six- to seven-second scene from each film’s iTunes preview. Only the selected preview is loaded. Playback pauses outside the viewport and in background tabs. The controls support manual pause and replay. Reduced-motion and data-saving preferences start with a still. The film guide and navigation also work if the external preview is unavailable.
- **Film archive** searches the eleven films by title, performer or year and filters by series.
- **Film detail** gives each title a shareable URL, synopsis, credits and series viewing order.
- **Screen eras** offers a first film for each series and fetches credits from the public Wikidata Action API. It handles loading, timeouts, errors, local fallback credits and retry.
- **Watchlist** saves picks across visits. Guests and local profiles have separate lists.
- **Sign up, sign in and profile** demonstrate browser-local authentication with an email address or phone number. Forms use JavaScript validation and inline feedback. Passwords are verified using a salted derivation. These profiles only exist in the browser that created them.
- **About** introduces the guide, team and sources. Earlier assignment URLs remain accessible through redirects.

## Organization

Root HTML files are the page entry points. Shared typography, layout, theme and navigation live in `css/style.css`, `js/theme.js` and `js/site.js`. Each feature has its own stylesheet or script. `js/films.js` contains the movie index and watchlist operations. Fonts, studio artwork and posters are served locally.

## Credits

Film artwork and catalog references come from [Sony Pictures](https://www.sonypictures.com/movies). The era guide links to the [Wikidata](https://www.wikidata.org/) records used for its live credits. Barlow and Barlow Condensed are distributed with their OFL license texts in `fonts/`. Spider Index is an independent student project.
