# UEB — Kit de templates sociaux, proposition 01

Sept rendez-vous éditoriaux, une même famille graphique. Cette première proposition traduit la charte publique 2026 en compositions réutilisables, avec leurs exemples et leurs fichiers sources. Elle est à examiner visuellement avec le club avant d’en faire la série de référence.

**Commencer par la [planche d’ensemble](previews/planche-feed.png)**, puis ouvrir les exemples à taille réelle. Le [catalogue local](previews/index.html) s’ouvre dans un navigateur, sans serveur ni connexion.

Les déclinaisons verticales sont réunies dans la [planche story](previews/planche-stories.png).

## Direction graphique

La cohérence vient d’éléments fixes : un en-tête avec le blason, une grille de 72 px de marge, deux familles typographiques, des filets fins et un pied de page commun. Les titres sont grands ; les informations sont rangées ; les couleurs ont des rôles stables.

Le bilan est blanc, le programme bleu ciel, les distinctions et annonces bleu nuit. L’or ponctue l’identité et le numéro du joueur. Les photos restent des photos : elles ne sont ni détourées automatiquement ni entourées d’effets. Une mise en page peut fonctionner sans image.

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

**4:5 : 1 080 × 1 350 px. Story : 1 080 × 1 920 px.** Les versions story disposent d’un en-tête et d’un pied de page déplacés pour garder les informations principales dans la zone centrale. Ces tailles sont nos conventions de production, à prévisualiser dans le canal de diffusion.

## Ce qui change dans chaque rubrique

- **Résultats** : de un à quatre matchs, avec l’équipe domicile sur la première ligne, l’équipe extérieure sur la seconde, puis les scores dans le même ordre. Au-delà de quatre, utiliser une seconde diapositive. UEB peut figurer sur l’une ou l’autre ligne.
- **Programme** : équipe UEB, adversaire, jour, heure, salle et mention explicite domicile / extérieur. Le lecteur comprend où il doit se rendre.
- **Partenaire** : remplacer la zone centrale par le logo officiel ou le nom exact du partenaire, puis décrire son soutien en une phrase concrète. « Atelier Nord » est un nom de démonstration ; il n’a pas de logo réel dans ce kit.
- **Player of the week** : nom, équipe, numéro et trois repères vérifiés. Le modèle fonctionne sans portrait ; un portrait fourni peut remplacer la zone du numéro. Les repères peuvent valoriser un engagement ou un rôle, sans inventer des statistiques.
- **Annonce officielle** : sujet, date ou référence, court texte et signataire. Le communiqué complet et ses modalités accompagnent le visuel lorsqu’ils sont nécessaires.
- **Communication** : changement ou information, date, groupe concerné, lieu ou action utile. Éviter de transformer une information pratique en slogan.
- **Score final** : deux identités, deux scores et une compétition. L’ordre est toujours domicile puis extérieur ; si UEB joue à l’extérieur, déplacer ensemble son nom et son score. Les logos adverses ne sont pas nécessaires à la lisibilité de cette première version.

Un nom long se répartit sur les lignes prévues. Un texte trop long se raccourcit ou passe dans la légende. Le moteur limite les largeurs de champ et signale une réduction de police excessive.

## Fichiers de marque fournis

- [Blason officiel SVG](assets/ueb-logo.svg), copié sans modification depuis `ueb-brand/src/logos/uccle-europe.svg`.
- [Blason PNG transparent](assets/ueb-logo.png), pour les outils qui n’importent pas le SVG.
- [Kanit Bold](assets/fonts/Kanit-Bold.ttf), [Kanit ExtraBold](assets/fonts/Kanit-ExtraBold.ttf) et [DM Sans variable](assets/fonts/DM-Sans-Variable.ttf), avec leurs licences OFL dans le même dossier.
- [Charte complète](CHARTE.md), avec la palette publique 2026.
- [Brief à donner à ChatGPT](BRIEF-CHATGPT.md).

Les polices et le blason sont intégrés dans chaque SVG pour le rendu dans un navigateur. Installer aussi les fichiers TTF avant d’éditer dans un logiciel de création ; certains outils ignorent les polices intégrées ou convertissent le texte en tracés. Garder les fichiers sources du kit.

## Exemples et photos

**Tous les résultats, adversaires de démonstration, noms de joueur, statistiques, partenariats et annonces des exemples sont fictifs.** La mention « EXEMPLE FICTIF · ÉTUDE GRAPHIQUE » est intégrée au pied de chaque exemple. Les modèles portent « MODÈLE À REMPLIR ».

La photo du score final provient de l’archive publique U16 champions de Belgique **2025** utilisée par le nouveau site. Elle est présentée avec cette légende et n’illustre pas une rencontre réelle à 78–64. Une autre photo d’archive du collectif 2025–2026 est fournie pour les essais de mise en page. Leur présence dans le kit ne remplace pas la vérification par le club des usages et crédits de chaque photo pour une publication.

Remplacer cette image d’archive par une photo pertinente avant de produire un score réel, ou utiliser la variante sans photo du modèle. Aucun portrait de joueur ni logo d’adversaire ou de sponsor n’a été inventé.

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

La planche est une **proposition 01**, pas une nouvelle charte officiellement validée. Les 28 compositions sont exportées et leurs limites de texte sont contrôlées ; les exemples demeurent des études. Le [rapport de rendu](previews/render-check.json) et le [manifeste](manifest.json) identifient les fichiers livrés.

La [provenance des actifs](assets/PROVENANCE.md) décrit les sources des fichiers fournis. Le package technique `@ueb/brand` conserve sa version et ses exports : les présents fichiers servent à la communication du club.

Pour refaire l’archive de remise après une modification, exécuter `python3 scripts/package.py`. L’archive locale `ueb-social-kit-v01.zip` est créée à côté du dossier `social-kit` ; elle contient la charte, les exemples, les modèles et tous leurs actifs. Les sources sont suivies dans Git ; cette archive dérivée est exclue du suivi.
