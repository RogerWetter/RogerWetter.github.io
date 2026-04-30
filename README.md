<a href="https://roger-wetter.com/">roger-wetter.com</a>

## Gallery (Galerie)

Fotos für die Gallery einfach in folgenden Ordner legen:

`/Gallery/images/`

Unterstützte Dateitypen: `.jpg`, `.jpeg`, `.png`, `.webp`, `.gif`, `.avif`, `.heic`, `.heif`

Beim nächsten Push auf `main` generiert der Workflow `Generate gallery thumbnails`
automatisch verkleinerte WebP-Vorschauen unter `Gallery/images/thumbs/`. Die
Galerie zeigt die Vorschauen im Grid und lädt das Original erst beim Klick auf
ein Bild — so bleibt die Galerie schnell, auch bei vielen mehreren MB grossen
Originalen.

### Drawboard-Einreichungen

Über das Drawboard kann jeder Besucher sein Bild lokal speichern und beim
Speichern optional zur Aufnahme in die offizielle Galerie einreichen. In dem
Fall öffnet das Drawboard ein vorausgefülltes GitHub-Issue mit dem Label
`gallery-submission`, in das die heruntergeladene PNG-Datei gezogen wird.
Der Workflow `Gallery submission` parst den Anhang, legt das Bild plus
Thumbnail an und erstellt automatisch einen Pull Request — du entscheidest
durch Mergen oder Schliessen, ob es in die Galerie kommt.
