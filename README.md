<a href="https://roger-wetter.com/">roger-wetter.com</a>

## Gallery (Galerie)

Fotos für die Gallery einfach in folgenden Ordner legen:

`/Gallery/images/`

Unterstützte Dateitypen: `.jpg`, `.jpeg`, `.png`, `.webp`, `.gif`, `.avif`, `.heic`, `.heif`

Beim nächsten Push auf `main` generiert der Workflow `Generate gallery thumbnails`
automatisch verkleinerte WebP-Vorschauen unter `Gallery/images/thumbs/`. Die
Galerie zeigt die Vorschauen im Grid und lädt das Original erst beim Klick auf
ein Bild — so bleibt die Galerie schnell, auch bei vielen, mehrere MB grossen
Originalen.

### Drawboard-Einreichungen

Über das Drawboard kann jeder Besucher sein Bild lokal speichern und beim
Speichern optional zur Aufnahme in die offizielle Galerie einreichen. In dem
Fall öffnet das Drawboard ein vorausgefülltes GitHub-Issue mit dem Label
`gallery-submission`, in das die heruntergeladene PNG-Datei gezogen wird.
Der Workflow `Gallery submission` parst den Anhang, legt das Bild plus
Thumbnail an und erstellt automatisch einen Pull Request — du entscheidest
durch Mergen oder Schliessen, ob es in die Galerie kommt.

> **Setup-Hinweis:** Damit GitHub das Label aus dem vom Drawboard
> vorausgefüllten Link (`?labels=gallery-submission`) automatisch setzt,
> muss das Label `gallery-submission` einmal im Repository angelegt
> werden (Issues → Labels → New label). Fehlt das Label, fällt der
> Workflow seit dieser Änderung zusätzlich auf den versteckten Marker
> `<!-- gallery-submission -->` im Issue-Body zurück, sodass die
> Einreichung trotzdem verarbeitet wird.

## Continuous Integration

Bei jedem Pull Request läuft der `CI`-Workflow und prüft:

* Unit-Tests für das Submission-Skript
  (`.github/workflows/scripts/gallery-submission.test.js`, ausgeführt via
  `node --test`),
* Syntax aller `*.js`-Dateien im Repo (`node --check`),
* alle Workflow-YAMLs unter `.github/workflows/` mit
  [`actionlint`](https://github.com/rhysd/actionlint) inkl. Shellcheck.

Tests können lokal mit `node --test .github/workflows/scripts/gallery-submission.test.js`
ausgeführt werden — Node 18+ genügt, externe Abhängigkeiten gibt es keine.
