# Moteur navigateur de l’Atelier UEB

La source canonique est `social-kit/browser/poster-engine.js`, accompagnée de ses
types publics dans `poster-engine.d.ts`. Elle dérive du moteur du Site
**UEB — Atelier communication**, projet `appgprj_6af32c2dc8488191b9c172af413ad388`,
version publiée 1, commit `40fea1f9abb58e11f6847679981b00ed509af01f`.
Le Site était lui-même une adaptation du kit UEB Social Studio 0.1.1.

Le moteur produit les SVG autonomes et PNG dans le navigateur. Il ne lit aucune
base de données, n’appelle aucun modèle et ne publie sur aucun réseau social.
Les données du Manager sont préparées et vérifiées par l’application appelante.
Les images distantes doivent être incorporées en data URI avant composition.
Les polices et marques officielles restent celles du kit ; leurs licences et
provenances sont conservées avec les actifs.

## Synchronisation vers Manager

Depuis ce dépôt :

```sh
python3 social-kit/scripts/sync_browser.py
python3 social-kit/scripts/sync_browser.py --check
```

Le script copie le moteur et ses types dans `src/vendor/ueb-social/`, puis les
blasons et polices dans `public/social-posts/assets/`. Il ne copie ni les photos
de démonstration, ni les exemples fictifs, ni le plugin. Le build Manager reste
autonome : aucune résolution vers le dépôt voisin n’est nécessaire.

## Contrat

`initEngine({assetBaseUrl:'/social-posts/'})` charge les actifs locaux. Après
initialisation, `paginatePosterData(template, data, format)` conserve tous les
matchs ou paragraphes et retourne des pages indépendantes. `buildPoster` retourne
le SVG et les avertissements ; l’interface doit bloquer tous les exports tant
qu’un avertissement subsiste. `posterToPng` vérifie également ces avertissements.
Les deux formats sont `feed` (1080×1350) et `story` (1080×1920).

Les coordonnées du décor utilisent le repère feed 1080×1350. Les stories ajoutent
200 px à son ordonnée. Les fonds décoratifs peuvent changer de position, taille
proportionnelle, opacité et teinte autorisée ; le blason identifiant, les marques
partenaires et adverses ne sont jamais déformés ou recolorés. Les sponsors ont
une zone propre, recomposée sans réduire les informations utiles sous 40 px.

Les tests `test-engine.mjs` utilisent un navigateur Chromium et le package
Playwright déjà disponible, sans dépendance de production supplémentaire.

## Choix visuels et fonds

`visual.source` choisit `auto`, `photo`, `logo` ou `none`. Le mode automatique
retient une photographie disponible, puis le logo si aucune photo n’est disponible.
Une demande explicite de photo manquante bloque l’export. `visual.mode` vaut
`background-monochrome` ou `foreground-color` ; absent, il est adapté au sujet.
Les logos partenaires restent en couleur par défaut ; le traitement monochrome
est un décor de composition et ne modifie jamais leur fichier officiel.

`surface` propose uniquement `white`, `paper`, `sky`, `blue`, `night` et `gold`,
avec les valeurs exactes de la palette publique et des textes contrastés.
Les documents sans `visual` conservent leur lecture historique. Le monochrome
est un filtre SVG conservé dans le PNG ; les tests vérifient ses pixels ainsi
que la conservation des couleurs au premier plan. Les exports restent autonomes.
