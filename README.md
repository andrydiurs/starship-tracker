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

## Resoconti mensili

Sezione narrativa, un articolo per mese, raggiungibile dal link «Resoconti mensili» in testata.

- `resoconti/index.html`: archivio (legge `data/resoconti/index.json`, mesi dal più recente).
- `resoconti/AAAA-MM.html`: pagina del mese; è il template `resoconti/page.tpl` compilato. Il JS ricava il mese dal nome del file (oppure da `?m=AAAA-MM`).
- `resoconti/resoconti.js` e `resoconti/resoconti.css`: rendering e stile di lettura (si appoggiano a `../style.css`).
- `data/resoconti/AAAA-MM.json`: contenuto del mese.

### Formato di `data/resoconti/AAAA-MM.json`

```json
{
  "id": "2026-10", "mese": "Ottobre 2026", "titolo": "…", "occhiello": "Resoconto mensile",
  "periodo": "1-23 ottobre 2026", "aggiornato": "23 ott 2026, 10:30",
  "nota": "Copre gli eventi dal … (aggiornato al …)", "sommario": "una frase per l'archivio",
  "intro": ["paragrafo", "paragrafo"],
  "sezioni": [
    { "k": "siti|prototipi|test|lanci", "titolo": "Cantieri", "sottotitolo": "…",
      "blocchi": [
        { "p": "Testo con [link](https://…) e **grassetto**" },
        { "x": { "autore": "@utente", "data": "4 ott", "ora": "05:45", "testo": "didascalia in italiano",
                 "url": "https://x.com/…/status/…",
                 "immagini": [ { "tipo": "foto|video", "url": "https://pbs.twimg.com/….jpg", "w": 2048, "h": 1366 } ] } }
      ] }
  ],
  "novembre": { "titolo": "Cosa aspettarsi a …", "blocchi": [ { "p": "…" } ] },
  "fonti": [ { "label": "…", "url": "https://…" } ]
}
```

Il testo viene sottoposto a escape; sono supportati solo `[testo](url)` e `**grassetto**`. Date e orari in ora di Roma.

### Aggiungere un mese

1. Creare `data/resoconti/AAAA-MM.json` nel formato sopra.
2. Aggiungere in cima a `resoconti` in `data/resoconti/index.json` la voce `{ id, mese, titolo, periodo, aggiornato, sommario, copertina, stato }` (`copertina` = URL pbs.twimg.com; `stato` facoltativo, es. «in corso»; toglierlo al mese chiuso).
3. Creare la pagina: copiare `resoconti/2026-10.html` in `resoconti/AAAA-MM.html` e aggiornare `<title>` e le descrizioni (il contenuto arriva dal JSON).
4. Provare in locale con `python3 -m http.server` e pubblicare su `main`.

### Cache

- I dati JSON (`data/tracker.json`, `data/resoconti/*.json`) sono letti con `fetch(..., { cache: "no-cache" })`: l'aggiornamento quotidiano basta modificarli, non serve altro.
- CSS e JS sono richiamati con `?v=AAAAMMGG<lettera>` (es. `style.css?v=20261023b`) in `index.html`, `resoconti/page.tpl` e nelle pagine dei mesi. Quando si modifica CSS o JS, aumentare la versione in tutti questi file.
- Tutte le icone SVG inline hanno `width`/`height` espliciti, così restano piccole anche con un CSS vecchio o assente.
