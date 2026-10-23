# Starship Tracker (sito statico)

Static site with no build step: `index.html`, `style.css`, `app.js`, `favicon.svg`, `data/tracker.json`.
**All of the content lives in `data/tracker.json`.** For a daily update you only edit that file.

## Running it locally
`app.js` loads the JSON with `fetch`, so you have to serve the folder over HTTP. Opening it as `file://` won't work.

    python3 -m http.server 8000     # then open http://localhost:8000

It works on any static host as is (GitHub Pages, Netlify, …). The only external dependency is Google Fonts, and it's optional: without it the site falls back to system fonts.

## Keys in `tracker.json`
| Key | Contents |
|---|---|
| `ULTIMO_AGGIORNAMENTO` | Text shown in the header, e.g. `"23 ott 2026, 09:10"` (Rome time) |
| `PROSSIMO_VOLO` | Top panel: `volo`, `net`/`netBreve`, `licenzaFaa`/`licenzaBreve`, `sito`, `obiettivo`, plus `ship` and `booster` = `{titolo, versione, stato{label,tone}, milestones[{nome, fatto, data, nota, src}]}` (progress bar = completed milestones) |
| `NEWS` | `{data, sez, testo, src, nc?}`, newest first. The first 6 are visible and the rest go under "Notizie precedenti". `sez` = section tag (siti/prototipi/test/lanci) |
| `IN_BREVE` | One summary sentence per section `{siti, prototipi, test, lanci}` |
| `SITI`, `VEICOLI`, `TEST`, `LANCI` | Rows for each tab: a short title and summary (`breve`), longer text for the "dettagli" expander (`note`/`ultimo`), `data`, `src` = source link |
| `NON_CONFERMATI`, `NC_SRC`, `NORMATIVO` | Unconfirmed items and regulatory notes (Siti tab) |
| `VOLI_FUTURI` | Flight 16 / Flight 15 cards in the Lanci tab: `{titolo, aperto, proprieta[{label,value,badge?}], fonti[], dettagli?}` |
| `LEGENDE`, `NOTA_PROTOTIPI` | Status legends and the note for the Prototipi tab |
| `FONTI` | Main sources (footer) |
| `X_POSTS` | "Dal mondo X" posts for each section (see below) |

### Conventions
- **Dates:** short Italian format (`"23 ott"`, `"9-10 set"`). Times are always Rome time.
- **Unconfirmed:** `"nc": true` on an item shows it greyed out with a "non confermato" badge.
- **Sources (`src`):** `{ "label": "NSF, 18 ott", "url": "https://..." }`.
- Status colours (`stato`, `esito`) are mapped in `app.js`: Pronto/Completato = green, Test/In corso = blue, Anomalia = amber, Distrutto = red.

### `X_POSTS`
`{ "siti": [post…], "prototipi": [...], "test": [...], "lanci": [...] }`, where each post is:

    { "id": "2113…", "autore": "@VickiCocks15", "data": "22 ott", "ora": "23:50", "media": "video",
      "testo": "…", "url": "https://x.com/VickiCocks15/status/2113…",
      "immagini": [ { "tipo": "foto"|"video", "url": "https://pbs.twimg.com/media/XXXX.jpg", "w": 1920, "h": 1080 } ] }

Only real posts, with the original `pbs.twimg.com` URL (for videos, the `amplify_video_thumb` frame).
`app.js` builds `?format=jpg&name=small` for the thumbnail and `name=large` for the enlarged view.
If an image doesn't load, a placeholder appears and tapping it opens the post on X.
