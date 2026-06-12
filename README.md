# Freija's Puzzels 🧩

Een vrolijke legpuzzel-webapp voor Freija (6): eenhoorns 🦄, bloemen 🌸 en
dieren 🐶, van 6 tot 100 stukjes met échte puzzelvormen. Werkt op tablet
(slepen met je vinger) én computer (muis). Geen frameworks, geen build-stap.

## Spelen

- **Meteen:** dubbelklik op `index.html` — werkt gewoon vanaf je computer.
- **Of via een mini-server:** `python3 -m http.server` in deze map en open
  http://localhost:8000
- **Of online:** zie "Online zetten" hieronder.

Tip: speel op een tablet in liggende stand (de app vraagt er zelf om).

## Hoe werkt het

1. Kies een plaatje (🦄/🌸/🐶) en hoeveel stukjes (6, 12, 24, 48 of 100).
2. Druk op **Spelen!** en sleep de stukjes naar de goede plek — in de buurt
   is goed genoeg, het stukje klikt vanzelf vast (*plop!*).
3. Knoppen tijdens het puzzelen:
   - kleine **voorbeeld**-foto linksboven → tik = groot bekijken
   - 💡 **hint**: laat de foto even doorschijnen en wijst een stukje aan
   - 🔀 **husselen**: losse stukjes opnieuw verspreiden
   - 🔊 **geluid** aan/uit · 🏠 terug naar het keuzescherm
4. Puzzel af? Confetti! 🎊 Je verdient een ⭐ per plaatje per moeilijkheid —
   spaar ze allemaal!
5. Naam aanpassen: tik op het ✏️ naast de titel. Een halve puzzel wordt
   automatisch bewaard ("Verder spelen").

## Online zetten (GitHub Pages)

1. Maak de repo **public** (Settings → General → Danger Zone → Change
   visibility). Pages is op een privérepo alleen beschikbaar met GitHub Pro.
2. Settings → **Pages** → Source: **GitHub Actions**.
3. Merge naar `main`; de workflow `.github/workflows/pages.yml` zet de app op
   `https://ttdekker.github.io/freijapuzzel/`. Zet die link op het
   beginscherm van de iPad en klaar.

## Zelf foto's toevoegen

De puzzelplaten zijn nu door de app getekend (zie hieronder). Eigen foto's
toevoegen kan zo:

1. Zet een foto in `img/` (liefst liggend, minstens 1200×900), bijv.
   `img/eenhoorn1.jpg`.
2. Voeg in `js/images.js` een entry toe aan de lijst:
   ```js
   { id: 'eenhoorn-eigen', cat: 'eenhoorn', title: 'Mijn eenhoorn',
     type: 'photo', file: 'img/eenhoorn1.jpg', credit: 'Eigen foto' }
   ```
3. Vermeld de bron in `CREDITS.md` als het geen eigen foto is.

## Techniek (kort)

Vanilla HTML/CSS/JS (`js/…`), puzzelstukjes als divs met `clip-path`-nopjes
en een gedeelde achtergrondfoto, Pointer Events voor touch+muis, geluid via
WebAudio-synthese (geen audiobestanden), voortgang/sterren in localStorage.
Zelftest: open `index.html?selftest=1`.

## Credits

De fotosites waren tijdens de bouw geblokkeerd; de 9 platen worden daarom
door de app zelf getekend. Zie `CREDITS.md` voor details en voor hoe echte
foto's verantwoord worden.
