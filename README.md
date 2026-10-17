# Les Zombinettes

Jeu éducatif pour le 1er cycle du primaire (PWA, iPad et iPhone) : dictée de mots basée sur la Liste
orthographique officielle du ministère de l'Éducation du Québec (1re, 2e et 3e année), lecture (mot → image),
dictée de nombres (0 à 199 par défaut, jusqu'à 9999 au besoin), calculs (additions, soustractions), plus grand / plus petit, lecture de
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

Syllabes : une image et un mot dit à voix haute ; l'enfant tape une fois sur le tambour par syllabe orale (le « e » muet
de la fin ne compte pas : « pomme » = 1, « banane » = 2). Un essai gratuit, puis le découpage s'affiche et le tambour le
joue (« pa · pil · lon »). Découpage noté à la main dans `data/syllabes.json`.

Rimes et sons : une image cible dite à voix haute, 3 images ; « Quel mot rime avec chat? » ou « Quel mot commence
comme maison? ». Les mots des choix sont dits aussi. Sons notés à la main dans `data/sons.json` (`r` = son de la fin,
`d` = premier son), parce que l'orthographe ne suffit pas (citron commence par « s »).

Phrases : 3 à 6 mots (réglable) et le point à remettre dans l'ordre (`data/phrases-desordre.json`). La phrase est dite
seulement après la réponse.

Les sous : pièces canadiennes dessinées en SVG (taille relative et couleur réalistes, valeur écrite dessus), à compter au
pavé numérique. Niveaux : 5 ¢ et 10 ¢, + 25 ¢ jusqu'à 1 $, 1 $ et 2 $.

Défi du jour : 3 activités tirées selon la date (un jeu de français, un de maths, un autre) en haut de l'accueil. Les
3 finies dans la journée font monter la série 🔥 (remise à 1 si on saute un jour), avec un collant spécial à 3, 7, 14 et
30 jours.

Plus grand : deux nombres, « touche le plus grand » ou « le plus petit ». La moitié du temps, les deux nombres ont le
même premier chiffre.

L'heure : horloge à aiguilles en SVG, 3 choix. Niveaux : heures justes, + les 30, puis 5 minutes avec les minutes écrites en rouge (00 à 55) à l'intérieur du cadran. Un des choix
inverse souvent les aiguilles (erreur classique).

Piano : « Trouve le ré » sur un clavier de 2 octaves (les deux do sont acceptés). Bouton 💡 Indice : petit dessin et
voix qui rappellent que le do est la touche blanche à gauche du groupe de 2 touches noires (les groupes de 2 s'allument
sur le clavier), puis qu'on monte do, ré, mi… Niveaux : do seulement, do-ré-mi, toutes les notes.

Les notes : « Touche la noire », 3 images (ronde, blanche, noire, deux croches, clé de sol, clé de fa ; SVG de Wikimedia
Commons dans `img/music/`, crédits dans `img/music/CREDITS.md`). Les silences viendront plus tard.

Musique : aigu ou grave (deux notes, écart plus petit selon le niveau), rythme (ta, ti-ti, chut ; l'enfant tape sur le
tambour ; très tolérant : réussi si le nombre de coups est bon à un près, raté seulement si elle pitonne au hasard, avec un essai gratuit) et instrument mystère (un vrai enregistrement de 8 secondes,
2 extraits par instrument ; jamais le même instrument deux fois de suite dans une partie). Sons synthétisés en Web Audio, sauf les instruments (`audio/instr/`).

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

(installation : `brew install pipx && pipx install edge-tts`). Les clips existants ne sont pas refaits ; un clip refusé par le serveur n'est jamais gardé vide (le jeu passe alors à la voix de l'appareil).

L'écran « Mon style » (pour l'enfant) permet de choisir la voix (Sylvie et Jean livrées avec l'app, plus Amélie et Daniel si l'appareil
les a), un style de voix (normale, petite, grosse, robot ; petite et grosse changent la hauteur sans changer la vitesse, par étirement WSOLA) et un thème de couleurs. Dans chaque
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

- Extraits d'instruments (`audio/instr/`) : vrais enregistrements de Wikimedia Commons (domaine public, CC0, CC BY,
  CC BY-SA), 2 extraits de 8 secondes par instrument. Auteurs et licences dans `audio/instr/CREDITS.md`.
- Police Playwrite CA (`fonts/`) : The Playwrite Project Authors (TypeTogether), licence SIL OFL 1.1 (`fonts/OFL.txt`).
