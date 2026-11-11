# UEB · Kit documents · 0.1.0

Moteur A4 à partir d’un brief JSON : présentation du club (4 pages de départ),
dossier sponsoring (6), proposition de partenariat (5). Les textes longs peuvent
créer des pages supplémentaires ; la taille du texte n’est pas réduite pour les
faire entrer. Les trois exemples sont des **modèles de travail**, avec des offres
indicatives sans prix, chiffres inventés ou contact réel.

## Produire un document

Avec Node 22+, le moteur autonome est déjà construit ; aucune installation npm
n’est nécessaire pour cette commande :

```sh
node document-kit/scripts/render.mjs --input examples/documents/sponsoring-demo.json --output /tmp/dossier.pdf
```

Trois fichiers sont produits : PDF, `.source.json` éditable et `.provenance.json`.
Les métadonnées PDF contiennent identité, modèle et moteur. La provenance
verrouille leurs versions, les empreintes de la source, du PDF, des photos, du
moteur embarqué et du lockfile de dépendances.

Le [schéma](schemas/document.schema.json) refuse les versions inconnues,
les champs inattendus et une séquence de pages incompatible avec le modèle.
Les photos doivent être des PNG/JPEG locaux sous le dossier du brief, avec leur
SHA256 et leur légende. Les liens sont HTTPS. Aucun téléchargement d’image ou
appel de modèle n’est réalisé par le moteur. Le texte reste sélectionnable et
les polices utilisées sont embarquées ; il ne s’agit pas d’un PDF/A certifié.

Un `status: ready` requiert `demo: false`, `reviewed: true`, aucun manque,
une source autre qu’un exemple et aucun placeholder connu. Ces drapeaux
attestent la revue déclarée par le rédacteur ; ils ne prouvent pas les faits.
Le plugin demande une validation humaine des chiffres, contacts et engagements.

## Versionner une fabrication

Le brief porte trois références obligatoires, par exemple :

```json
{
  "identity": { "id": "ueb-public-2026", "version": "1.0.0" },
  "template": { "id": "sponsorship-dossier", "version": "1.0.0" },
  "renderer": { "id": "ueb-documents", "version": "0.1.0" }
}
```

Une référence n’est jamais remplacée par `active` lors de la réouverture. Les
fichiers du dossier d’identité sont vérifiés avant composition. Conserver les
sorties avec la source Git/paquet utilisé ; la provenance de paquet donne cette
révision. L’historique Git permet de retrouver l’ancienne implémentation du moteur.
Les changements de gabarit qui modifient le rendu demandent une nouvelle version
de gabarit et du moteur. Les archives distribuées restent autonomes et versionnées.

## Vérifier et développer

```sh
npm ci --prefix document-kit
npm test --prefix document-kit
python3 -m pip install -r document-kit/test/requirements-qa.txt
python3 document-kit/scripts/verify_pdf.py examples/documents/sponsoring-demo.pdf examples/documents/sponsoring-demo.json
```

Les tests vérifient références, contrôles de relecture, empreintes, chemins et
exécution sans `node_modules`. La recette PDF vérifie A4, texte conservé,
accents, polices utilisées embarquées, débordements, pagination et mentions de
modèle. Inspecter également les pages rendues : ce contrôle ne juge pas la
qualité éditoriale ni ne remplace une revue visuelle.

Le moteur autonome inclut les dépendances du lockfile, avec notices. La règle
PDFKit du build résout ses métriques standard au moment de la compilation.
Les layouts sont séparés des accès fichier pour leur réutilisation future.

## Intégration Manager ultérieure

Réutiliser le contrat JSON, les blocs de mise en page, les profils et les tests.
L’adapter d’exécution PDF (navigateur ou service), les droits, les faits du club,
les brouillons partagés et leur stockage seront traités dans Manager. Ce kit ne
lit aucune base, ne change aucun droit et n’installe aucun service de publication.

Les photos sont recopiées sous `nom-du-document.assets/`, avec des noms fondés
sur leur SHA256. La source exportée pointe vers ce dossier pour rester portable.
Conserver et livrer ce dossier avec le JSON et la provenance, idéalement dans
une archive de livraison avec le PDF. L’original du brief n’est pas réécrit.
