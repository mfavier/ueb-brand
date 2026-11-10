# Provenance des actifs — Kit social UEB

Préparation : 10 novembre 2026 · Proposition sociale v02. Les exemples sont des études graphiques fictives. Le blason identifiant vient du fichier officiel ; les fonds décoratifs en sont des dérivés séparés. Un portrait illustratif généré représente un adulte fictif pour tester le « Player of the week » ; il n’atteste aucun joueur réel du club.

| Fichier du kit | Source | Usage |
|---|---|---|
| `ueb-logo.svg` | `ueb-brand/src/logos/uccle-europe.svg` | Copie exacte du fichier officiel. |
| `ueb-logo.png` | Rendu du SVG ci-dessus, 886 × 1 000 px | Export transparent ; dessin et proportions conservés. |
| `photos/u16-champions-2025.jpg` | `ueb-public/public/redesign-2026/hero-u16-2025.jpg` | Photo d’archive publique du club, U16 champions de Belgique en 2025. Exemple de score fictif légendé comme tel. |
| `photos/collectif-2025-2026.jpg` | `ueb-public/public/redesign-2026/collectif-2025-2026.jpg` | Photo d’archive du collectif, saison 2025–2026 ; fournie comme actif d’essai. |
| `photos/portrait-illustratif-adulte.png` | Outil intégré imagegen ; [prompt et contexte](photos/PORTRAIT-ILLUSTRATIF.md) | Portrait fictif d’un adulte, fourni pour les exemples Player of the week. |
| `fonts/Kanit-Bold.ttf` | [Google Fonts, Kanit Bold](https://github.com/google/fonts/blob/main/ofl/kanit/Kanit-Bold.ttf) | Kanit 700, licence OFL jointe. |
| `fonts/Kanit-ExtraBold.ttf` | [Google Fonts, Kanit ExtraBold](https://github.com/google/fonts/blob/main/ofl/kanit/Kanit-ExtraBold.ttf) | Kanit 800, licence OFL jointe. |
| `fonts/DM-Sans-Variable.ttf` | [Google Fonts, DM Sans variable](https://github.com/google/fonts/tree/main/ofl/dmsans) | DM Sans, licence OFL jointe. |

Les licences de polices proviennent des copies déjà conservées dans `ueb-manager/public/fonts/`. La provenance initiale des photos est recensée dans `ueb-public/public/redesign-2026/provenance.json`. Leurs crédits et usages pour une diffusion réelle sont à confirmer avec le club.

Les variantes de `decorative/` partent des tracés du blason officiel pour produire des matières de fond monochromes, éventuellement cadrées dans la composition. Ce traitement a été expressément demandé dans le retour utilisateur sur v01. Il ne modifie ni `ueb-logo.svg` ni `ueb-brand/src/logos/uccle-europe.svg` et ne fournit pas un nouveau blason identifiant.

Le portrait d’illustration de v02 est produit avec le mode intégré `imagegen` : adulte fictif en tenue de basket blanche sans marque, lumière naturelle claire, fond de salle de sport. Le fichier et son prompt accompagnent l’actif généré. Les textes, le numéro et le blason sont ajoutés séparément dans le template. Remplacer ce portrait par une photo autorisée avant une distinction réelle.

Les exemples « Atelier Nord », « Alex Martin » et les rencontres avec « RBC Rivage », « BC Horizon », « Atlas Basket » ou « Union Basket » sont des contenus de démonstration. Ils n’attestent aucune personne, relation de partenariat, rencontre ou statistique réelle.
