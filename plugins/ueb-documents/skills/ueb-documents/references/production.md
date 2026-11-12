# Fabrication de documents UEB

Depuis la racine du plugin, vérifier `node --version`, puis copier l’un des
`examples/documents/*.json` dans le dossier de travail. Les photos sont sous ce
même dossier, avec chemins relatifs, SHA256 et légendes. Pour partir de l’exemple,
copier aussi son dossier `assets/`. Charger la charte indiquée par le manifest
`identity/releases/ueb-public-2026/1.0.0/manifest.json` et ses règles.

```sh
node document-kit/scripts/render.mjs --input /chemin/brief.json --output /chemin/dossier.pdf
```

Le schéma est dans `document-kit/schemas/document.schema.json`. Le moteur génère
`dossier.pdf`, `dossier.source.json` et `dossier.provenance.json`. Ne pas remplacer
une source de travail : utiliser un nom de sortie distinct. Les textes longs
s’écoulent sur des pages supplémentaires ; relire le résultat.

Si PyMuPDF est disponible :

```sh
python3 document-kit/scripts/verify_pdf.py /chemin/dossier.pdf /chemin/brief.json
```

Ouvrir aussi un rendu de chaque page. Cette recette vérifie les dimensions A4,
les textes, accents, fontes utilisées, chevauchements et références ; elle ne
valide pas les faits commerciaux. Les dépendances QA sont indiquées dans
`document-kit/test/requirements-qa.txt`. Ne pas modifier l’environnement global
pour les installer : utiliser un environnement temporaire si autorisé.

Versions embarquées : identité `ueb-public-2026@1.0.0`, modèles `1.0.0`, moteur
`ueb-documents@0.1.0`, plugin `0.1.0`. Ne pas confondre avec le paquet applicatif
`@ueb/brand@0.4.0` ni le plugin social `0.1.1`. L’instantané legacy n’est pas un
modèle d’anciens PDF. Le kit n’a pas de connexion MCP ni de mise à jour automatique.

Les photos sont recopiées sous `nom-du-document.assets/`, avec des noms fondés
sur leur SHA256. La source exportée pointe vers ce dossier pour rester portable.
Conserver et livrer ce dossier avec le JSON et la provenance, idéalement dans
une archive de livraison avec le PDF. L’original du brief n’est pas réécrit.
