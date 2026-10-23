<!doctype html>
<html lang="it">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
  <meta name="theme-color" content="#070b16">
  <meta name="color-scheme" content="dark">
  <meta name="description" content="__DESC__">
  <meta property="og:title" content="__TITLE__">
  <meta property="og:description" content="__DESC__">
  <meta property="og:type" content="article">
  <title>__TITLE__</title>
  <link rel="icon" href="../favicon.svg" type="image/svg+xml">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Space+Grotesk:wght@500;600;700&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="../style.css?v=20261023b">
  <link rel="stylesheet" href="resoconti.css?v=20261023b">
</head>
<body>
  <div class="stars" aria-hidden="true"></div>
  <header class="top">
    <div class="wrap top-inner">
      <a class="brand" href="../" aria-label="Starship Tracker, torna al tracker">
        <img src="../favicon.svg" alt="" width="36" height="36">
        <span>Starship <b>Tracker</b></span>
      </a>
      <div class="top-right">
        <a class="top-link" href="../"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m12 19-7-7 7-7"/><path d="M19 12H5"/></svg>Torna al tracker</a>
        __ARCH__
        <p class="updated" id="updated">Caricamento…</p>
      </div>
    </div>
  </header>

  <main class="wrap" id="app">
    <noscript><p class="card">Serve JavaScript per mostrare il resoconto.</p></noscript>
  </main>

  <footer class="wrap foot">
    <p>Solo fatti con data e fonte. Le voci indicate come non ufficiali o non confermate vengono da documenti provvisori, indiscrezioni o community. Orari in ora di Roma. Immagini dai post pubblici su X, di proprietà dei rispettivi autori.</p>
  </footer>

  <dialog id="viewer" aria-label="Immagine ingrandita">
    <button class="viewer-close" type="button" aria-label="Chiudi">✕</button>
    <figure>
      <img id="viewer-img" alt="" referrerpolicy="no-referrer">
      <figcaption id="viewer-cap"></figcaption>
    </figure>
  </dialog>

  <script src="resoconti.js?v=20261023b" defer></script>
</body>
</html>
