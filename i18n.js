(() => {
  const STORAGE_KEY = 'rw.language';
  const SUPPORTED_LANGUAGES = ['en', 'de', 'fr', 'it', 'ru'];

  const translations = {
    en: {
      'common.privacyNotice': 'Privacy Notice',
      'common.language': 'Language',
      'common.skipToContent': 'Skip to main content',
      'common.themeToggle': 'Toggle dark mode',
      'common.language.en': 'English',
      'common.language.de': 'Deutsch',
      'common.language.fr': 'Français',
      'common.language.it': 'Italiano',
      'common.language.ru': 'Русский',
      'nav.projects': 'Projects',
      'nav.gallery': 'Gallery',
      'nav.about': 'About',
      'nav.contact': 'Contact',
      'about.education': 'Education',
      'about.experience': 'Experience',
      'home.explore': 'Explore Roger Wetter!',
      'home.projects': 'PROJECTS',
      'home.gallery': 'GALLERY',
      'gallery.create': 'Create your own image',
      'gallery.random': 'Surprise me ✨',
      'gallery.empty': 'No images available.',
      'gallery.image.one': 'image',
      'gallery.image.many': 'images',
      'gallery.loaded': '{count} {word} loaded.',
      'gallery.loadedOwn': '{count} {word} loaded ({own} created by you).',
      'gallery.badge.drawboard': 'Drawboard',
      'gallery.badge.public': 'Public',
      'gallery.error': 'Could not load images (HTTP {status}).',
      'fitness.title': 'Welcome to the Fitness App!',
      'fitness.p1': 'The Fitness App is the result of my bachelor thesis at ZHAW. It was developed to help you achieve your fitness goals, whether it is muscle building, weight loss, or general fitness.',
      'fitness.p2': 'With our app, you can create individual training plans, track your progress, and much more.',
      'fitness.p3': 'During development, special attention was given to user experience (UX), simple design (UI), and user-centered design (UCD).',
      'fitness.insights': 'Insights into the app',
      'stuff.title': 'Stuff',
      'stuff.text': 'Here is my current Stuff Page from Figma shown live, where I regularly create small icons, logos, and much more. With a bit of luck you can catch me live while I follow my passion.',
      'website.title': 'About this Website',
      'website.p1': 'Welcome to roger-wetter.com! This website is a personal project that I developed completely from scratch. My goal was to improve my skills in HTML, CSS, and JavaScript while creating a platform to present my work and interests.',
      'website.h2.dev': 'Built from scratch:',
      'website.p2': 'Every element of this website was carefully programmed by me, from the user interface design to the implementation of interactive functions. I am always striving to improve it and add new features.',
      'website.h2.os': 'Open Source:',
      'website.p3': 'The complete source code of this website is available on GitHub. Feel free to have a look and suggest improvements. Your feedback is always welcome.',
      'website.repo': 'GitHub Repository',
      'website.p4': 'Thank you for your visit and your interest in my work!',
      'contact.text': 'Have a question or want to get in contact? Because of spam issues, I have removed the contact form from this page. Please reach out to me on',
      'connect4.newGame': 'New game',
      'connect4.undo': 'Undo',
      'connect4.turnRed': "It's 🔴 Red's turn!",
      'connect4.turnBlue': "It's 🔵 Blue's turn!",
      'connect4.playAgain': 'Let us play again! {turn}',
      'connect4.winner': 'The player with the {color} coins has won!',
      'connect4.colorRed': 'red',
      'connect4.colorBlue': 'blue',
      'connect4.draw': 'Draw! Click the board to play again.',
      'drawboard.clear': 'Clear canvas',
      'drawboard.eraser': 'Toggle eraser',
      'drawboard.color': 'Pick drawing color',
      'drawboard.width': 'Set line width',
      'drawboard.save': 'Save to gallery',
      'drawboard.canvas': 'Drawing area',
      'drawboard.confirmClear': 'Are you sure you want to clear the whole canvas?',
      'drawboard.empty': 'Draw something first before saving it to the gallery.',
      'drawboard.promptName': 'Name for your image:',
      'drawboard.invalidName': 'Please enter a valid image name.',
      'drawboard.publicWarning': 'Warning: Gallery content is visible to all visitors. Please do not share private data. Do you still want to save this image?',
      'drawboard.saved': 'Saved! You can now find your image in the gallery.',
      '404.title': 'Oops! 404 Error',
      '404.p1': 'Looks like you took a wrong turn!',
      '404.p2': 'But hey, don’t worry! You can always go',
      '404.back': 'back to the homepage'
    },
    de: {
      'common.privacyNotice': 'Datenschutzhinweis',
      'common.language': 'Sprache',
      'common.skipToContent': 'Zum Hauptinhalt springen',
      'common.themeToggle': 'Dunkelmodus umschalten',
      'common.language.en': 'English',
      'common.language.de': 'Deutsch',
      'common.language.fr': 'Français',
      'common.language.it': 'Italiano',
      'common.language.ru': 'Русский',
      'nav.projects': 'Projekte',
      'nav.gallery': 'Galerie',
      'nav.about': 'Über mich',
      'nav.contact': 'Kontakt',
      'about.education': 'Ausbildung',
      'about.experience': 'Erfahrung',
      'home.explore': 'Entdecke Roger Wetter!',
      'home.projects': 'PROJEKTE',
      'home.gallery': 'GALERIE',
      'gallery.create': 'Erstelle dein eigenes Bild',
      'gallery.random': 'Überrasch mich ✨',
      'gallery.empty': 'Keine Bilder vorhanden.',
      'gallery.image.one': 'Bild',
      'gallery.image.many': 'Bilder',
      'gallery.loaded': '{count} {word} geladen.',
      'gallery.loadedOwn': '{count} {word} geladen ({own} von dir erstellt).',
      'gallery.badge.drawboard': 'Drawboard',
      'gallery.badge.public': 'Öffentlich',
      'gallery.error': 'Fehler beim Laden der Bilder (HTTP {status}).',
      'fitness.title': 'Willkommen zur Fitness-App!',
      'fitness.p1': 'Die Fitness-App ist das Ergebnis meiner Bachelorarbeit an der ZHAW. Sie wurde entwickelt, um Ihnen dabei zu helfen, Ihre Fitnessziele zu erreichen, egal ob es um Muskelaufbau, Gewichtsabnahme oder allgemeine Fitness geht.',
      'fitness.p2': 'Mit unserer App können Sie individuelle Trainingspläne erstellen, Ihre Fortschritte verfolgen und vieles mehr.',
      'fitness.p3': 'Bei der Entwicklung wurde besonders auf Benutzererfahrung (UX), simples Design (UI) und Nutzerzentrierung (UCD) geachtet.',
      'fitness.insights': 'Einblicke in die App',
      'stuff.title': 'Stuff',
      'stuff.text': 'Hier ist live meine aktuelle Stuff-Page von Figma, in der ich regelmässig kleine Icons, Logos und vieles mehr erstelle. Mit etwas Glück erwischt man mich live bei meiner Leidenschaft.',
      'website.title': 'Über diese Website',
      'website.p1': 'Herzlich willkommen auf roger-wetter.com! Diese Website ist ein persönliches Projekt, das ich von Grund auf selbst entwickelt habe. Mein Ziel war es, meine Fähigkeiten in HTML, CSS und JavaScript zu verbessern und gleichzeitig eine Plattform zu schaffen, um meine Arbeit und Interessen zu präsentieren.',
      'website.h2.dev': 'Eigenentwicklung:',
      'website.p2': 'Jedes Element dieser Website wurde sorgfältig von mir programmiert, angefangen von der Gestaltung der Benutzeroberfläche bis hin zur Implementierung interaktiver Funktionen. Ich bin stets bestrebt, sie zu verbessern und neue Features hinzuzufügen.',
      'website.h2.os': 'Open Source:',
      'website.p3': 'Der gesamte Quellcode dieser Website ist auf GitHub verfügbar. Sie können ihn sich gerne ansehen und Verbesserungsvorschläge machen. Ihr Feedback ist immer willkommen.',
      'website.repo': 'GitHub-Repository',
      'website.p4': 'Vielen Dank für Ihren Besuch und Ihr Interesse an meiner Arbeit!',
      'contact.text': 'Haben Sie eine Frage oder möchten Kontakt aufnehmen? Wegen Spam-Problemen habe ich das Kontaktformular von dieser Seite entfernt. Bitte kontaktieren Sie mich über',
      'connect4.newGame': 'Neues Spiel',
      'connect4.undo': 'Rückgängig',
      'connect4.turnRed': '🔴 Rot ist am Zug!',
      'connect4.turnBlue': '🔵 Blau ist am Zug!',
      'connect4.playAgain': 'Noch eine Runde! {turn}',
      'connect4.winner': 'Der Spieler mit den {color} Steinen hat gewonnen!',
      'connect4.colorRed': 'roten',
      'connect4.colorBlue': 'blauen',
      'connect4.draw': 'Unentschieden! Klicke auf das Spielfeld, um erneut zu spielen.',
      'drawboard.clear': 'Zeichenfläche leeren',
      'drawboard.eraser': 'Radierer umschalten',
      'drawboard.color': 'Zeichenfarbe wählen',
      'drawboard.width': 'Linienstärke festlegen',
      'drawboard.save': 'In Galerie speichern',
      'drawboard.canvas': 'Zeichenbereich',
      'drawboard.confirmClear': 'Möchtest du wirklich die ganze Zeichenfläche löschen?',
      'drawboard.empty': 'Zeichne erst etwas, bevor du es in die Galerie speicherst.',
      'drawboard.promptName': 'Name für dein Bild:',
      'drawboard.invalidName': 'Bitte gib einen gültigen Bildnamen ein.',
      'drawboard.publicWarning': 'Achtung: Galerie-Inhalte sind öffentlich sichtbar und für alle Besucher einsehbar. Bitte teile keine privaten Daten. Möchtest du das Bild trotzdem speichern?',
      'drawboard.saved': 'Gespeichert! Du findest dein Bild jetzt in der Galerie.',
      '404.title': 'Hoppla! 404-Fehler',
      '404.p1': 'Sieht so aus, als wärst du falsch abgebogen!',
      '404.p2': 'Keine Sorge! Du kannst jederzeit',
      '404.back': 'zur Startseite zurück'
    },
    fr: {
      'common.privacyNotice': 'Avis de confidentialité',
      'common.language': 'Langue',
      'common.skipToContent': 'Aller au contenu principal',
      'common.themeToggle': 'Basculer le mode sombre',
      'common.language.en': 'English',
      'common.language.de': 'Deutsch',
      'common.language.fr': 'Français',
      'common.language.it': 'Italiano',
      'common.language.ru': 'Русский',
      'nav.projects': 'Projets',
      'nav.gallery': 'Galerie',
      'nav.about': 'À propos',
      'nav.contact': 'Contact',
      'about.education': 'Formation',
      'about.experience': 'Expérience',
      'home.explore': 'Découvrez Roger Wetter!',
      'home.projects': 'PROJETS',
      'home.gallery': 'GALERIE',
      'gallery.create': 'Créez votre propre image',
      'gallery.random': 'Surprends-moi ✨',
      'gallery.empty': 'Aucune image disponible.',
      'gallery.image.one': 'image',
      'gallery.image.many': 'images',
      'gallery.loaded': '{count} {word} chargées.',
      'gallery.loadedOwn': '{count} {word} chargées ({own} créées par vous).',
      'gallery.badge.drawboard': 'Drawboard',
      'gallery.badge.public': 'Public',
      'gallery.error': 'Erreur lors du chargement des images (HTTP {status}).',
      'fitness.title': 'Bienvenue dans l’application Fitness!',
      'fitness.p1': 'L’application Fitness est le résultat de mon travail de bachelor à la ZHAW. Elle a été développée pour vous aider à atteindre vos objectifs de forme, que ce soit la prise de muscle, la perte de poids ou la forme générale.',
      'fitness.p2': 'Avec notre application, vous pouvez créer des plans d’entraînement individuels, suivre vos progrès, et bien plus encore.',
      'fitness.p3': 'Pendant le développement, une attention particulière a été portée à l’expérience utilisateur (UX), à un design simple (UI) et à la conception centrée utilisateur (UCD).',
      'fitness.insights': 'Aperçus de l’application',
      'stuff.title': 'Stuff',
      'stuff.text': 'Voici en direct ma page Stuff actuelle sur Figma, où je crée régulièrement de petites icônes, des logos et bien plus encore. Avec un peu de chance, vous me verrez en direct pendant que je poursuis ma passion.',
      'website.title': 'À propos de ce site web',
      'website.p1': 'Bienvenue sur roger-wetter.com! Ce site web est un projet personnel que j’ai développé entièrement de zéro. Mon objectif était d’améliorer mes compétences en HTML, CSS et JavaScript tout en créant une plateforme pour présenter mon travail et mes centres d’intérêt.',
      'website.h2.dev': 'Développement personnel:',
      'website.p2': 'Chaque élément de ce site web a été programmé avec soin par moi, de la conception de l’interface utilisateur à l’implémentation de fonctions interactives. Je cherche constamment à l’améliorer et à ajouter de nouvelles fonctionnalités.',
      'website.h2.os': 'Open source:',
      'website.p3': 'Le code source complet de ce site web est disponible sur GitHub. N’hésitez pas à le consulter et à proposer des améliorations. Vos retours sont toujours les bienvenus.',
      'website.repo': 'Dépôt GitHub',
      'website.p4': 'Merci pour votre visite et pour l’intérêt porté à mon travail!',
      'contact.text': 'Vous avez une question ou souhaitez me contacter? En raison du spam, j’ai supprimé le formulaire de contact de cette page. Merci de me contacter via',
      'connect4.newGame': 'Nouvelle partie',
      'connect4.undo': 'Annuler',
      'connect4.turnRed': '🔴 Au tour de Rouge!',
      'connect4.turnBlue': '🔵 Au tour de Bleu!',
      'connect4.playAgain': 'On rejoue! {turn}',
      'connect4.winner': 'Le joueur avec les jetons {color} a gagné!',
      'connect4.colorRed': 'rouges',
      'connect4.colorBlue': 'bleus',
      'connect4.draw': 'Égalité! Cliquez sur le plateau pour rejouer.',
      'drawboard.clear': 'Effacer le canevas',
      'drawboard.eraser': 'Activer/désactiver la gomme',
      'drawboard.color': 'Choisir la couleur',
      'drawboard.width': 'Définir l’épaisseur',
      'drawboard.save': 'Enregistrer dans la galerie',
      'drawboard.canvas': 'Zone de dessin',
      'drawboard.confirmClear': 'Voulez-vous vraiment effacer tout le canevas?',
      'drawboard.empty': 'Dessinez d’abord quelque chose avant de l’enregistrer dans la galerie.',
      'drawboard.promptName': 'Nom de votre image:',
      'drawboard.invalidName': 'Veuillez saisir un nom d’image valide.',
      'drawboard.publicWarning': 'Attention: Le contenu de la galerie est visible publiquement par tous les visiteurs. Ne partagez pas de données privées. Voulez-vous quand même enregistrer cette image?',
      'drawboard.saved': 'Enregistré! Votre image se trouve maintenant dans la galerie.',
      '404.title': 'Oups! Erreur 404',
      '404.p1': 'On dirait que vous avez pris un mauvais chemin!',
      '404.p2': 'Pas de souci! Vous pouvez toujours',
      '404.back': 'retourner à la page d’accueil'
    },
    it: {
      'common.privacyNotice': 'Informativa sulla privacy',
      'common.language': 'Lingua',
      'common.skipToContent': 'Vai al contenuto principale',
      'common.themeToggle': 'Attiva/disattiva modalità scura',
      'common.language.en': 'English',
      'common.language.de': 'Deutsch',
      'common.language.fr': 'Français',
      'common.language.it': 'Italiano',
      'common.language.ru': 'Русский',
      'nav.projects': 'Progetti',
      'nav.gallery': 'Galleria',
      'nav.about': 'Chi sono',
      'nav.contact': 'Contatto',
      'about.education': 'Formazione',
      'about.experience': 'Esperienza',
      'home.explore': 'Scopri Roger Wetter!',
      'home.projects': 'PROGETTI',
      'home.gallery': 'GALLERIA',
      'gallery.create': 'Crea la tua immagine',
      'gallery.random': 'Sorprendimi ✨',
      'gallery.empty': 'Nessuna immagine disponibile.',
      'gallery.image.one': 'immagine',
      'gallery.image.many': 'immagini',
      'gallery.loaded': '{count} {word} caricate.',
      'gallery.loadedOwn': '{count} {word} caricate ({own} create da te).',
      'gallery.badge.drawboard': 'Drawboard',
      'gallery.badge.public': 'Pubblico',
      'gallery.error': 'Errore durante il caricamento delle immagini (HTTP {status}).',
      'fitness.title': 'Benvenuto nell’app Fitness!',
      'fitness.p1': 'L’app Fitness è il risultato della mia tesi di bachelor alla ZHAW. È stata sviluppata per aiutarti a raggiungere i tuoi obiettivi di fitness, che si tratti di aumento muscolare, perdita di peso o benessere generale.',
      'fitness.p2': 'Con la nostra app puoi creare piani di allenamento personalizzati, monitorare i tuoi progressi e molto altro.',
      'fitness.p3': 'Durante lo sviluppo è stata data particolare attenzione all’esperienza utente (UX), a un design semplice (UI) e alla progettazione centrata sull’utente (UCD).',
      'fitness.insights': 'Panoramica dell’app',
      'stuff.title': 'Stuff',
      'stuff.text': 'Qui trovi in diretta la mia attuale pagina Stuff su Figma, dove creo regolarmente piccole icone, loghi e molto altro. Con un po’ di fortuna puoi trovarmi online mentre seguo la mia passione.',
      'website.title': 'Informazioni su questo sito',
      'website.p1': 'Benvenuto su roger-wetter.com! Questo sito è un progetto personale che ho sviluppato interamente da zero. Il mio obiettivo era migliorare le mie competenze in HTML, CSS e JavaScript, creando al contempo una piattaforma per presentare il mio lavoro e i miei interessi.',
      'website.h2.dev': 'Sviluppo autonomo:',
      'website.p2': 'Ogni elemento di questo sito è stato programmato con cura da me, dalla progettazione dell’interfaccia utente all’implementazione di funzionalità interattive. Mi impegno costantemente a migliorarlo e ad aggiungere nuove funzionalità.',
      'website.h2.os': 'Open source:',
      'website.p3': 'L’intero codice sorgente di questo sito è disponibile su GitHub. Sentiti libero di consultarlo e proporre miglioramenti. Il tuo feedback è sempre benvenuto.',
      'website.repo': 'Repository GitHub',
      'website.p4': 'Grazie per la visita e per l’interesse nel mio lavoro!',
      'contact.text': 'Hai una domanda o vuoi metterti in contatto? A causa dello spam, ho rimosso il modulo di contatto da questa pagina. Ti prego di contattarmi su',
      'connect4.newGame': 'Nuova partita',
      'connect4.undo': 'Annulla',
      'connect4.turnRed': '🔴 Turno del Rosso!',
      'connect4.turnBlue': '🔵 Turno del Blu!',
      'connect4.playAgain': 'Giochiamo di nuovo! {turn}',
      'connect4.winner': 'Il giocatore con i dischi {color} ha vinto!',
      'connect4.colorRed': 'rossi',
      'connect4.colorBlue': 'blu',
      'connect4.draw': 'Pareggio! Clicca sul tabellone per giocare di nuovo.',
      'drawboard.clear': 'Pulisci area di disegno',
      'drawboard.eraser': 'Attiva/disattiva gomma',
      'drawboard.color': 'Scegli colore di disegno',
      'drawboard.width': 'Imposta spessore linea',
      'drawboard.save': 'Salva nella galleria',
      'drawboard.canvas': 'Area di disegno',
      'drawboard.confirmClear': 'Vuoi davvero cancellare tutta l’area di disegno?',
      'drawboard.empty': 'Disegna prima qualcosa, poi salvalo nella galleria.',
      'drawboard.promptName': 'Nome della tua immagine:',
      'drawboard.invalidName': 'Inserisci un nome immagine valido.',
      'drawboard.publicWarning': 'Attenzione: I contenuti della galleria sono visibili pubblicamente a tutti i visitatori. Non condividere dati privati. Vuoi comunque salvare questa immagine?',
      'drawboard.saved': 'Salvato! Ora puoi trovare la tua immagine nella galleria.',
      '404.title': 'Ops! Errore 404',
      '404.p1': 'Sembra che tu abbia preso una strada sbagliata!',
      '404.p2': 'Niente paura! Puoi sempre',
      '404.back': 'tornare alla homepage'
    },
    ru: {
      'common.privacyNotice': 'Уведомление о конфиденциальности',
      'common.language': 'Язык',
      'common.skipToContent': 'Перейти к основному содержимому',
      'common.themeToggle': 'Переключить тёмную тему',
      'common.language.en': 'English',
      'common.language.de': 'Deutsch',
      'common.language.fr': 'Français',
      'common.language.it': 'Italiano',
      'common.language.ru': 'Русский',
      'nav.projects': 'Проекты',
      'nav.gallery': 'Галерея',
      'nav.about': 'О себе',
      'nav.contact': 'Контакты',
      'about.education': 'Образование',
      'about.experience': 'Опыт',
      'home.explore': 'Откройте Roger Wetter!',
      'home.projects': 'ПРОЕКТЫ',
      'home.gallery': 'ГАЛЕРЕЯ',
      'gallery.create': 'Создать своё изображение',
      'gallery.random': 'Удиви меня ✨',
      'gallery.empty': 'Изображения отсутствуют.',
      'gallery.image.one': 'изображение',
      'gallery.image.many': 'изображений',
      'gallery.loaded': 'Загружено: {count} {word}.',
      'gallery.loadedOwn': 'Загружено: {count} {word} ({own} создано вами).',
      'gallery.badge.drawboard': 'Drawboard',
      'gallery.badge.public': 'Публично',
      'gallery.error': 'Ошибка загрузки изображений (HTTP {status}).',
      'fitness.title': 'Добро пожаловать в Fitness App!',
      'fitness.p1': 'Fitness App — результат моей бакалаврской работы в ZHAW. Приложение разработано, чтобы помочь вам достичь фитнес-целей: набора мышечной массы, снижения веса или общего улучшения формы.',
      'fitness.p2': 'С нашим приложением вы можете создавать индивидуальные планы тренировок, отслеживать прогресс и многое другое.',
      'fitness.p3': 'При разработке особое внимание уделялось пользовательскому опыту (UX), простому дизайну (UI) и пользовательско-ориентированному подходу (UCD).',
      'fitness.insights': 'Обзор приложения',
      'stuff.title': 'Stuff',
      'stuff.text': 'Здесь вживую показана моя текущая страница Stuff в Figma, где я регулярно создаю небольшие иконки, логотипы и многое другое. Если повезёт, вы увидите меня онлайн за любимым делом.',
      'website.title': 'Об этом сайте',
      'website.p1': 'Добро пожаловать на roger-wetter.com! Этот сайт — личный проект, который я полностью разработал с нуля. Моя цель — улучшить навыки в HTML, CSS и JavaScript и одновременно создать платформу для представления своих работ и интересов.',
      'website.h2.dev': 'Собственная разработка:',
      'website.p2': 'Каждый элемент этого сайта был тщательно запрограммирован мной — от дизайна интерфейса до реализации интерактивных функций. Я постоянно стремлюсь улучшать сайт и добавлять новые возможности.',
      'website.h2.os': 'Открытый исходный код:',
      'website.p3': 'Полный исходный код этого сайта доступен на GitHub. Вы можете посмотреть его и предложить улучшения. Ваш отзыв всегда приветствуется.',
      'website.repo': 'Репозиторий GitHub',
      'website.p4': 'Спасибо за визит и интерес к моей работе!',
      'contact.text': 'Есть вопрос или хотите связаться со мной? Из-за спама я удалил форму обратной связи с этой страницы. Пожалуйста, свяжитесь со мной через',
      'connect4.newGame': 'Новая игра',
      'connect4.undo': 'Отменить',
      'connect4.turnRed': '🔴 Ход красных!',
      'connect4.turnBlue': '🔵 Ход синих!',
      'connect4.playAgain': 'Сыграем ещё раз! {turn}',
      'connect4.winner': 'Игрок с {color} фишками победил!',
      'connect4.colorRed': 'красными',
      'connect4.colorBlue': 'синими',
      'connect4.draw': 'Ничья! Нажмите на поле, чтобы сыграть снова.',
      'drawboard.clear': 'Очистить холст',
      'drawboard.eraser': 'Включить/выключить ластик',
      'drawboard.color': 'Выбрать цвет рисования',
      'drawboard.width': 'Установить толщину линии',
      'drawboard.save': 'Сохранить в галерею',
      'drawboard.canvas': 'Область рисования',
      'drawboard.confirmClear': 'Вы уверены, что хотите очистить весь холст?',
      'drawboard.empty': 'Сначала что-нибудь нарисуйте, затем сохраните в галерею.',
      'drawboard.promptName': 'Название изображения:',
      'drawboard.invalidName': 'Введите корректное имя изображения.',
      'drawboard.publicWarning': 'Внимание: содержимое галереи публично видно всем посетителям. Не публикуйте личные данные. Всё равно сохранить изображение?',
      'drawboard.saved': 'Сохранено! Теперь ваше изображение доступно в галерее.',
      '404.title': 'Упс! Ошибка 404',
      '404.p1': 'Похоже, вы свернули не туда!',
      '404.p2': 'Не переживайте! Вы всегда можете',
      '404.back': 'вернуться на главную'
    }
  };

  const normalizeLanguage = (value) => {
    if (!value || typeof value !== 'string') return null;
    const short = value.toLowerCase().split('-')[0];
    return SUPPORTED_LANGUAGES.includes(short) ? short : null;
  };

  const getPreferredLanguage = () => {
    const stored = normalizeLanguage(localStorage.getItem(STORAGE_KEY));
    if (stored) return stored;
    const browserLanguages = Array.isArray(navigator.languages) && navigator.languages.length
      ? navigator.languages
      : [navigator.language];
    for (const candidate of browserLanguages) {
      const normalized = normalizeLanguage(candidate);
      if (normalized) return normalized;
    }
    return 'en';
  };

  let currentLanguage = getPreferredLanguage();

  const interpolate = (template, values = {}) =>
    template.replace(/\{(\w+)\}/g, (_, key) => (values[key] ?? ''));

  const t = (key, values = {}) => {
    const entry = translations[currentLanguage]?.[key] ?? translations.en[key] ?? key;
    return typeof entry === 'string' ? interpolate(entry, values) : key;
  };

  const applyTranslations = () => {
    document.documentElement.lang = currentLanguage;
    document.querySelectorAll('[data-i18n]').forEach((element) => {
      element.textContent = t(element.dataset.i18n);
    });
    document.querySelectorAll('[data-i18n-aria-label]').forEach((element) => {
      element.setAttribute('aria-label', t(element.dataset.i18nAriaLabel));
    });
    document.querySelectorAll('[data-i18n-title]').forEach((element) => {
      element.setAttribute('title', t(element.dataset.i18nTitle));
    });
  };

  const buildFooterLanguageSelector = () => {
    const footer = document.querySelector('footer');
    if (!footer || footer.querySelector('.language-selector')) return;
    const privacyLink = footer.querySelector('a[href*="privacy"]');
    if (!privacyLink) return;
    privacyLink.dataset.i18n = 'common.privacyNotice';

    const wrapper = document.createElement('span');
    wrapper.className = 'language-selector';

    const separator = document.createElement('span');
    separator.className = 'language-selector__separator';
    separator.textContent = ' · ';

    const label = document.createElement('label');
    label.className = 'sr-only';
    label.setAttribute('for', 'site-language-select');
    label.dataset.i18n = 'common.language';

    const select = document.createElement('select');
    select.id = 'site-language-select';
    select.className = 'language-selector__select';
    select.setAttribute('aria-label', t('common.language'));

    SUPPORTED_LANGUAGES.forEach((language) => {
      const option = document.createElement('option');
      option.value = language;
      option.textContent = t(`common.language.${language}`);
      if (language === currentLanguage) option.selected = true;
      select.appendChild(option);
    });

    select.addEventListener('change', (event) => {
      setLanguage(event.target.value, true);
    });

    wrapper.appendChild(separator);
    wrapper.appendChild(label);
    wrapper.appendChild(select);
    privacyLink.insertAdjacentElement('afterend', wrapper);
  };

  const updateLanguageSelector = () => {
    const select = document.getElementById('site-language-select');
    if (!select) return;
    select.setAttribute('aria-label', t('common.language'));
    Array.from(select.options).forEach((option) => {
      option.textContent = t(`common.language.${option.value}`);
      option.selected = option.value === currentLanguage;
    });
  };

  const ensureSkipLink = () => {
    if (document.querySelector('.skip-link')) return;
    const main = document.querySelector('main') || document.querySelector('[role="main"]');
    if (!main) return;
    if (!main.id) main.id = 'main-content';
    const skipLink = document.createElement('a');
    skipLink.href = `#${main.id}`;
    skipLink.className = 'skip-link';
    skipLink.dataset.i18n = 'common.skipToContent';
    document.body.insertAdjacentElement('afterbegin', skipLink);
  };

  const setLanguage = (language, persist = false) => {
    const normalized = normalizeLanguage(language) || 'en';
    currentLanguage = normalized;
    if (persist) localStorage.setItem(STORAGE_KEY, normalized);
    applyTranslations();
    updateLanguageSelector();
    document.dispatchEvent(new CustomEvent('rw:language-changed', { detail: { language: normalized } }));
  };

  const getLanguage = () => currentLanguage;

  const onLanguageChange = (handler) => {
    document.addEventListener('rw:language-changed', handler);
  };

  window.RW_I18N = { t, setLanguage, getLanguage, onLanguageChange };

  document.addEventListener('DOMContentLoaded', () => {
    ensureSkipLink();
    buildFooterLanguageSelector();
    setLanguage(currentLanguage, false);
  });
})();
