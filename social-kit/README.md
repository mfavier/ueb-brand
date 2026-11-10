# UEB — Kit de templates sociaux, proposition 02

Sept rendez-vous éditoriaux, une même famille graphique. La proposition v02 traduit la charte publique 2026 en compositions réutilisables, avec leurs exemples et leurs fichiers sources. Elle développe la matière photo et le blason en fond, allège les signatures répétées et donne plus de place aux informations utiles.

**Commencer par la [planche d’ensemble](previews/planche-feed.png)**, puis ouvrir les exemples à taille réelle. Le [catalogue local](previews/index.html) s’ouvre dans un navigateur, sans serveur ni connexion.

Les déclinaisons verticales sont réunies dans la [planche story](previews/planche-stories.png).

Les recherches de photo, de blason en fond et de « Player of the week » clair ou sombre sont réunies dans la [planche d’explorations](previews/planche-explorations.png) et son [catalogue local](previews/explorations.html).

## Direction graphique

La cohérence vient de la grille, des deux familles typographiques et des rôles stables de la couleur. La signature club reste simple : blason officiel entier ou matière décorative de blason, éventuellement accompagnée du nom en grand. Les titres sont grands ; les informations sont rangées. Les petits « Since 1946 », numéros de rubrique, slogans et URL de haut ou bas sont retirés lorsqu’ils n’apportent pas d’information au post.

Le bilan et le programme gardent des fonds clairs. Le « Player of the week » dispose d’une version claire par défaut avec portrait lumineux, et d’une variante sombre. L’or ponctue l’identité. Les autres recherches emploient une photo de fond ou un grand blason décoratif monochrome et partiel. Les photos restent naturelles ; les marques de fond laissent une zone de lecture calme.

Sur les programmes et les résultats, viser des informations utiles d’environ 44 à 52 px et des heures ou scores d’environ 64 à 88 px sur un canevas de 1 080 px. Juger aussi le résultat à 360 px de large : si l’information exige un zoom, réduire la quantité de contenu ou créer une diapositive supplémentaire.

Les formules de rubrique sont courtes et récurrentes. Le détail utile au public prime dans le texte. Pour la série courante, conserver ces compositions, les polices et les espacements ; remplacer les contenus dans les zones prévues.

## Les sept templates

Chaque ligne propose un **modèle à remplir**, un **exemple fictif** et une version story. Les SVG gardent du texte éditable ; les PNG sont des références visuelles et des exports aux dimensions exactes.

| Type | Modèle SVG, 4:5 | Exemple PNG, 4:5 | Exemple PNG, story |
|---|---|---|---|
| 01 · Résultats de plusieurs matchs | [Modèle](templates/01-resultats-feed.svg) | [Exemple](examples/01-resultats-feed.png) | [Story](examples/01-resultats-story.png) |
| 02 · Programme du week-end | [Modèle](templates/02-programme-feed.svg) | [Exemple](examples/02-programme-feed.png) | [Story](examples/02-programme-story.png) |
| 03 · Présentation de partenaire | [Modèle](templates/03-partenaire-feed.svg) | [Exemple](examples/03-partenaire-feed.png) | [Story](examples/03-partenaire-story.png) |
| 04 · Player of the week | [Modèle](templates/04-player-of-the-week-feed.svg) | [Exemple](examples/04-player-of-the-week-feed.png) | [Story](examples/04-player-of-the-week-story.png) |
| 05 · Annonce officielle | [Modèle](templates/05-annonce-officielle-feed.svg) | [Exemple](examples/05-annonce-officielle-feed.png) | [Story](examples/05-annonce-officielle-story.png) |
| 06 · Communication pratique | [Modèle](templates/06-communication-feed.svg) | [Exemple](examples/06-communication-feed.png) | [Story](examples/06-communication-story.png) |
| 07 · Score final d’une rencontre | [Modèle](templates/07-score-final-feed.svg) | [Exemple](examples/07-score-final-feed.png) | [Story](examples/07-score-final-story.png) |

Les équivalents PNG des modèles, SVG des exemples et modèles story sont dans les mêmes dossiers, avec les suffixes `-feed` et `-story`.

La v02 fournit **28 compositions de base et 12 explorations**, soit 40 compositions disponibles chacune en SVG et en PNG. Les six pistes photo/blason de la planche d’explorations existent aussi en story dans `explorations/`.

**4:5 : 1 080 × 1 350 px. Story : 1 080 × 1 920 px.** Les versions story recomposent les zones d’image et de texte pour garder les informations principales dans la zone centrale. Ces tailles sont nos conventions de production, à prévisualiser dans le canal de diffusion.

## Ce qui change dans chaque rubrique

- **Résultats** : de un à quatre matchs, avec l’équipe domicile sur la première ligne, l’équipe extérieure sur la seconde, puis les scores dans le même ordre. Au-delà de quatre, utiliser une seconde diapositive. UEB peut figurer sur l’une ou l’autre ligne.
- **Programme** : équipe UEB, adversaire, jour, heure, salle et mention explicite domicile / extérieur. Le lecteur comprend où il doit se rendre.
- **Partenaire** : remplacer la zone centrale par le logo officiel ou le nom exact du partenaire, puis décrire son soutien en une phrase concrète. « Atelier Nord » est un nom de démonstration ; il n’a pas de logo réel dans ce kit.
- **Player of the week** : portrait, nom, équipe, numéro et trois repères vérifiés. La version claire donne davantage de place à une photo lumineuse ; une variante sombre permet de comparer les rendus. Les repères peuvent valoriser un engagement ou un rôle, sans inventer des statistiques.
- **Annonce officielle** : sujet, date ou référence, court texte et signataire. Le communiqué complet et ses modalités accompagnent le visuel lorsqu’ils sont nécessaires.
- **Communication** : changement ou information, date, groupe concerné, lieu ou action utile. Éviter de transformer une information pratique en slogan.
- **Score final** : deux identités, deux scores et une compétition. L’ordre est toujours domicile puis extérieur ; si UEB joue à l’extérieur, déplacer ensemble son nom et son score. Les logos adverses restent facultatifs lorsque les noms identifient clairement les deux clubs.

Un nom long se répartit sur les lignes prévues. Un texte trop long se raccourcit ou passe dans la légende. Le moteur limite les largeurs de champ et signale une réduction de police excessive.

## Fichiers de marque fournis

- [Blason officiel SVG](assets/ueb-logo.svg), copié sans modification depuis `ueb-brand/src/logos/uccle-europe.svg`.
- [Blason PNG transparent](assets/ueb-logo.png), pour les outils qui n’importent pas le SVG.
- Dérivés décoratifs de blason dans `assets/decorative/`, pour les fonds monochromes et les cadrages partiels autorisés dans v02. Le fichier officiel est conservé séparément et ne se modifie pas.
- [Kanit Bold](assets/fonts/Kanit-Bold.ttf), [Kanit ExtraBold](assets/fonts/Kanit-ExtraBold.ttf) et [DM Sans variable](assets/fonts/DM-Sans-Variable.ttf), avec leurs licences OFL dans le même dossier.
- [Charte complète](CHARTE.md), avec la palette publique 2026.
- [Brief à donner à ChatGPT](BRIEF-CHATGPT.md).

Les polices et le blason sont intégrés dans chaque SVG pour le rendu dans un navigateur. Installer aussi les fichiers TTF avant d’éditer dans un logiciel de création ; certains outils ignorent les polices intégrées ou convertissent le texte en tracés. Garder les fichiers sources du kit.

## Exemples et photos

**Tous les résultats, adversaires de démonstration, noms de joueur, statistiques, partenariats et annonces des exemples sont fictifs.** Une étiquette de travail les identifie comme exemples fictifs ; les modèles sont identifiés comme modèles à remplir. Cette étiquette sert à la revue et ne justifie pas de réintroduire les microtextes d’habillage supprimés dans v02.

La photo du score final provient de l’archive publique U16 champions de Belgique **2025** utilisée par le nouveau site. Elle est présentée avec cette légende et n’illustre pas une rencontre réelle à 78–64. Une autre photo d’archive du collectif 2025–2026 est fournie pour les essais de mise en page. Leur présence dans le kit ne remplace pas la vérification par le club des usages et crédits de chaque photo pour une publication.

Remplacer cette image d’archive par une photo pertinente avant de produire un score réel, ou utiliser une variante sans photo.

Le portrait lumineux utilisé pour l’exploration du « Player of the week » représente un adulte fictif généré pour tester la composition. Il ne représente aucun joueur réel du club. Le remplacer par le portrait autorisé du joueur concerné pour une publication réelle. Son [fichier de provenance et son prompt](assets/photos/PORTRAIT-ILLUSTRATIF.md) sont fournis. Aucun logo d’adversaire ou de sponsor n’est inventé.

## Transmettre à ChatGPT

Joindre **le brief ChatGPT, la charte, le PNG d’un exemple correspondant au sujet, le SVG du modèle et le blason**, puis les données et les photos du post réel. Un seul exemple de la bonne rubrique est plus utile pour une exécution qu’une consigne ouverte accompagnée de tous les styles.

Demander de remplir le modèle en conservant les coordonnées et les styles. Le PNG sert à contrôler le résultat ; le SVG sert à garder la composition. La génération d’une nouvelle image à partir d’un simple texte peut encore déplacer les blocs ou altérer le blason. Le moteur fourni ci-dessous permet de garder la grille sans dépendre de cette interprétation.

## Produire à partir des données

Cette voie technique est facultative. Le kit contient déjà tous les fichiers à ouvrir et à modifier.

1. Copier le JSON de la rubrique depuis `data/*-template.json` ou `data/*-example.json`.
2. Renseigner les champs, vérifier les données et remplacer `"demo": true` par `"demo": false`.
3. Renseigner `alt` avec le texte alternatif du post réel. Pour les images, fournir un chemin local vers le fichier ; les chemins relatifs partent du dossier `social-kit`.
4. Générer les deux SVG avec Python 3, sans module supplémentaire :

```sh
python3 scripts/generate.py --data mon-post.json --out production/mon-post
```

Le JSON contient les champs de la rubrique, pas des instructions de dessin. Les couleurs, les positions et les polices restent dans le moteur. Les champs entre crochets sont refusés en mode production. Le pied de démonstration est supprimé ; le champ optionnel `footer` permet un crédit ou une précision.

Les compositions photographiques utilisent `backgroundPhoto` pour leur image de fond et le « Player of the week » utilise `portrait`. La valeur `"variant": "light"` sélectionne la déclinaison claire du joueur ; `"variant": "dark"` sélectionne la sombre. Les exemples correspondants montrent les cadrages prévus. Une matière décorative de blason se reprend depuis le modèle choisi ; elle n’autorise pas à modifier le fichier du blason officiel.

Pour une sortie PNG reproductible et le contrôle des textes, installer Playwright dans un dossier de travail, puis lancer depuis `social-kit` :

```sh
npm install --no-save --prefix /tmp/ueb-social-render playwright
/tmp/ueb-social-render/node_modules/.bin/playwright install chromium
PLAYWRIGHT_MODULE=/tmp/ueb-social-render/node_modules/playwright/index.mjs \
  node scripts/render.mjs production/mon-post
```

Le moteur d’export charge les polices locales et produit les PNG. Il conserve dans les SVG les ajustements de largeur appliqués. Son rapport `render-check.json` signale les débordements, collisions de texte et diminutions de taille sous 80 % de la taille prévue. Corriger les contenus signalés et relancer avant diffusion. Contrôler aussi le rendu à l’œil.

Pour régénérer toute la bibliothèque après une modification de la grille, exécuter `python3 scripts/generate.py`, puis `node scripts/render.mjs` avec la même variable `PLAYWRIGHT_MODULE`.

## Vérification et statut

La planche est une **proposition 02** à examiner avec le club. Les sept rubriques possèdent des modèles et exemples en feed et story, complétés par des explorations de photo, de blason en fond et de joueur clair ou sombre. Le [rapport de rendu](previews/render-check.json) et le [manifeste](manifest.json) permettent de consulter les contrôles et d’identifier les fichiers livrés.

La [provenance des actifs](assets/PROVENANCE.md) décrit les sources des fichiers fournis. Le package technique `@ueb/brand` conserve sa version et ses exports : les présents fichiers servent à la communication du club.

Pour refaire l’archive de remise après une modification, exécuter `python3 scripts/package.py`. L’archive locale `ueb-social-kit-v02.zip` est créée à côté du dossier `social-kit` ; elle contient la charte, les exemples, les modèles, les explorations et tous leurs actifs. Les sources sont suivies dans Git ; cette archive dérivée est exclue du suivi.
