# Les Zombinettes

Jeu éducatif pour le 1er cycle du primaire (PWA, iPad et iPhone) : dictée de mots basée sur la Liste
orthographique officielle du ministère de l'Éducation du Québec (1re, 2e et 3e année), lecture (mot → image),
dictée de nombres jusqu'aux milliers, calculs (additions, soustractions), plus grand / plus petit, lecture de
l'heure, tracé (moulé et attaché) et musique (aigu ou grave, rythme, instrument mystère), avec difficulté
réglable. Les consignes sont dites à voix haute.

## Lancer en local

    python3 -m http.server 4173 --directory .

Puis ouvrir http://localhost:4173. NIP parent par défaut : 1234.

## Installer sur l'iPad

Héberger le dossier tel quel (GitHub Pages, Cloudflare Pages, n'importe quel serveur statique),
ouvrir l'URL dans Safari, Partager, « Sur l'écran d'accueil ». L'app fonctionne ensuite hors ligne.

## Interface

Fond sombre, une couleur d'accent et une scène illustrée par thème (8 thèmes : violet, zombie, vampire, loup-garou, licorne, océan, chanteuse, sirène ; `img/*.svg`, dessinées à la main, pas d'assets externes) en bannière (ratio 3:1) et en fond de page assombri. En mode Couleur, six duos de couleurs prêts à l'emploi (plus le duo du thème). Deux fonds au choix dans Mon style : sombre, ou dégradé tiré des couleurs du thème avec surfaces translucides. La photo de profil peut être remplacée par une photo de l'appareil (recadrée en 256×256, stockée en base64 dans le localStorage). Accueil = page de chaîne (bannière, avatar, abonnés, niveau,
succès) et grille de vignettes par activité avec badge de durée ; barre d'onglets en bas (Accueil, Succès, Style,
Parent) ; progression segmentée dans les exercices ; fin de partie avec score et toast « Succès débloqué ».

## Structure

- `index.html`, `styles.css`, `app.js` : l'app (aucune dépendance, aucun build)
- `sw.js`, `manifest.webmanifest`, `icons/` : PWA
- `data/mots-{1,2,3}.json` : mots par année, extraits du PDF du MEQ par `data/parse_liste.py`

## Comment ça apprend

Chaque mot a une boîte (0 à 3). Un mot réussi monte d'une boîte, un mot raté retombe à 0.
Les boîtes reviennent à chaque dictée / toutes les 2 / 4 / 8 dictées. Les « mots de la semaine »
entrés dans l'espace parent passent en priorité. Trois nouveaux mots maximum par dictée. Les mots sont classés par paliers de difficulté (score
maison : longueur, graphèmes complexes, accents, lettres muettes, doubles lettres) : paliers 1 à 4 pour
la 1re année, 5 à 7 pour la 2e, 8 à 10 pour la 3e. Seuls les paliers débloqués fournissent de nouveaux mots.
Le palier monte tout seul quand 70 % des mots débloqués sont connus (désactivable et réglable dans l'espace parent).

Lettres pièges : en mode « lettres à placer », des lettres qui se confondent avec celles du mot (é/è, b/d, m/n…)
s'ajoutent aux tuiles (0 à 5, réglable).

Lire : un mot écrit, 3 ou 4 images emoji (`data/lecture.json`). Le mot n'est jamais dit avant la réponse. Aux niveaux 2 et 3,
les images proposées ont des noms qui ressemblent au mot (même début, même fin).

Plus grand : deux nombres, « touche le plus grand » ou « le plus petit ». La moitié du temps, les deux nombres ont le
même premier chiffre.

L'heure : horloge à aiguilles en SVG, 3 choix. Niveaux : heures justes, + les 30, puis 5 minutes avec les minutes écrites en rouge (00 à 55) à l'intérieur du cadran. Un des choix
inverse souvent les aiguilles (erreur classique).

Musique : aigu ou grave (deux notes, écart plus petit selon le niveau), rythme (ta, ti-ti, chut ; l'enfant tape sur le
tambour ; très tolérant : réussi si le nombre de coups est bon à un près, raté seulement si elle pitonne au hasard, avec un essai gratuit) et instrument mystère (une courte mélodie jouée
avec un vrai échantillon). Sons synthétisés en Web Audio, sauf les instruments (`audio/instr/`).

Tracer : un modèle de lettre (minuscule, majuscule) ou de chiffre en gris pâle, l'enfant repasse dessus au doigt.
Modèle en police scolaire (Chalkboard SE), centré selon la boîte réelle du glyphe. Lettres et petits mots en attaché
avec Playwrite CA (modèle cursif scolaire canadien). Réussi quand le tracé, épaissi d'une marge, recouvre au moins 60 % du modèle (25 % sans épaississement), que le trait fait au moins 60 % de la hauteur de la lettre affichée et que moins de 20 % de l'encre sort de la zone de tolérance
autour du modèle (le dépassement s'affiche en rouge) ; pas de reconnaissance d'écriture. Choix des jeux de
caractères dans l'espace parent.

## Voix

Les mots, lettres, nombres 0-100, centaines, milliers, heures et phrases du jeu sont pré-générés en mp3 dans `audio/<voix>/` avec des voix
neuronales québécoises (Sylvie et Jean) via edge-tts, et livrés avec l'app. À l'exécution, chaque
morceau de phrase joue son clip s'il existe, sinon la voix système prend le relais (mots de la semaine). Les nombres au-dessus de
100 sont assemblés (« trois mille » + « quatre cents » + « 56 »). Regénérer après un changement de mots ou de phrases :

    "$HOME/Library/Application Support/pipx/venvs/edge-tts/bin/python" data/gen_audio.py

(installation : `brew install pipx && pipx install edge-tts`). Les clips existants ne sont pas refaits.

L'écran « Mon style » (pour l'enfant) permet de choisir la voix (Sylvie et Jean livrées avec l'app, plus Amélie et Daniel si l'appareil
les a), un style de voix (normale, petite, grosse, robot) et un thème de couleurs. Dans chaque
exercice, le bouton 🗣️/🔇 coupe les commentaires (consigne, bravos, explications) pour cet exercice seulement ;
le mot ou le nombre à écrire est toujours dit.

## Hors ligne

Le service worker garde en cache l'app et les données ; les sons se mettent en cache au fur et à mesure qu'ils
sont joués. Le bouton « Préparer le hors-ligne » de l'espace parent télécharge d'un coup tous les clips de la voix
choisie (~12 Mo). La lecture passe par Web Audio, déverrouillé au premier toucher, pour contourner le blocage
de lecture automatique de Safari iOS.

## Sauvegarde

Les progrès vivent dans le localStorage de l'appareil. L'espace parent exporte un fichier JSON (feuille de
partage sur iPad, téléchargement ailleurs) et réimporte ce fichier sur un autre appareil.

Maths : réglages dans l'espace parent (nombres jusqu'à N, premier nombre jusqu'à N, ajout jusqu'à +N,
soustractions oui/non, points pour compter). Dans l'exercice de calcul, le bouton 👀/🙈 cache ou montre les points
(même réglage) ; les nombres de la question ont la couleur de leurs points. Les réponses justes donnent des « abonnés », chaque partie
finie donne un collant.

Source : https://cdn-contenu.quebec.ca/cdn-contenu/education/pfeq/primaire/Liste-orthographique-document-reference.pdf

## Crédits

- Échantillons d'instruments (`audio/instr/`) : [tonejs-instruments](https://github.com/nbrosowsky/tonejs-instruments)
  de Nicholaus Brosowsky, licence [CC-BY 3.0](https://creativecommons.org/licenses/by/3.0/), une note par instrument
  convertie en AAC mono.
- Police Playwrite CA (`fonts/`) : The Playwrite Project Authors (TypeTogether), licence SIL OFL 1.1 (`fonts/OFL.txt`).
