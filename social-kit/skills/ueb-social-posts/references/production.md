# Contrat de travail et fabrication

Tous les chemins ci-dessous partent de la racine du plugin, le dossier qui contient `plugin.json`. Les ressources visuelles, les informations réelles du brief et les capacités de l’environnement ont des rôles distincts.

## Champs par composition existante

| Rubrique | Données nécessaires pour le visuel |
|---|---|
| `01-resultats` | `edition` ; de 1 à 4 `matches` avec `category`, `home`, `away`, `score`. Les noms et le score suivent le même ordre domicile–extérieur. |
| `02-programme` | `edition` ; de 1 à 4 `matches` avec `day`, `category` (équipe UEB), `opponent`, `venue`, `side`, `time`. |
| `03-partenaire` | `name` sur 1–2 lignes, `contribution` courte sur 1–2 lignes, `season`. `logo` est facultatif ; une absence n’autorise pas à en inventer un. |
| `04-player-of-the-week` | `edition`, `category`, `name` sur 1–2 lignes, `number`, exactement trois `stats` avec `value` et `label`. `portrait` facultatif, `variant` claire ou sombre. Si la demande n’a pas de numéro ou trois repères vérifiés, adapter la composition plutôt que compléter artificiellement ces champs. |
| `05-annonce-officielle` | `edition`, `subject` sur 1–2 lignes, `body` sur 1–3 lignes, `signature`. Conserver le texte approuvé ; proposer un extrait si le texte complet doit accompagner le visuel. |
| `06-communication` | `edition`, `subject` sur 1–2 lignes, `when`, `details` sur 1–2 lignes, `note`. Une précision réellement inutile peut être une chaîne vide ; ne pas fabriquer de détail pour remplir une zone. |
| `07-score-final` | `edition`, noms `home` et `away` sur 1–2 lignes chacun, `homeScore` et `awayScore` connus. `closing` (1–2 lignes) sert à la variante sans photo ; `backgroundPhoto` ou `photo` est facultatif. |

Ajouter `template`, `demo` (booléen) et `alt` au JSON. Les chemins d’images relatifs partent de la racine du plugin ; un chemin absolu vers une pièce jointe matérialisée est également utilisable. Le moteur importe PNG, JPEG et SVG. Si l’image est en WEBP, HEIC ou dans un format non géré, employer un convertisseur disponible en préservant l’original ou demander une version compatible ; ne pas renommer simplement son extension.

Le brief peut contenir moins de détails que ces modèles. Faire la différence entre un fait manquant qui empêche une publication et un champ propre à une mise en page. Pour ce dernier, choisir ou adapter une composition qui n’en dépend pas.

Le moteur n’affiche pas automatiquement un champ ajouté au JSON : `logo` est prévu pour la fiche partenaire, par exemple. Si le brief demande deux blasons dans le score ou une autre zone absente du modèle, adapter la source graphique ; ne pas supposer qu’un champ supplémentaire sera dessiné.

## Actifs

- `assets/ueb-logo.svg` et `assets/ueb-logo.png` : identité officielle, immuable.
- `assets/decorative/ueb-crest-*.svg` : matières de fond cadrables et monochromes.
- `assets/fonts/` : Kanit 700 / 800, DM Sans et leurs licences.
- `assets/photos/` : ressources d’essai ; vérifier la provenance avant usage.
- `examples/` et `explorations/` : références graphiques fictives, jamais une base de données de joueurs ou de résultats.

Le portrait `portrait-illustratif-adulte.png` est fictif. Ne pas l’attribuer à un vrai joueur et ne pas l’employer pour une distinction réelle. Une archive collective de 2025 ne prouve pas qu’elle représente la rencontre à publier ; la légender ou la remplacer selon le contexte.

## Création avec les scripts

L’environnement peut exécuter le moteur si Python 3 et les ressources du plugin sont disponibles. Se placer à sa racine :

```sh
python3 scripts/generate.py --data /chemin/post.json --out /chemin/sortie/page-01
```

Cette commande crée les SVG feed et story de la rubrique. Ne remettre que les formats demandés. Pour plusieurs pages, appeler le moteur avec un JSON par page dans des dossiers distincts pour préserver les fichiers. Ne pas lancer une régénération globale de la bibliothèque pour un post utilisateur.

Pour produire les PNG, vérifier la présence d’un navigateur et de l’exporteur adaptés. Avec Playwright et Chromium déjà accessibles :

```sh
PLAYWRIGHT_MODULE=/chemin/vers/playwright/index.mjs \
  node scripts/render.mjs /chemin/sortie/page-01
```

Le moteur de rendu ajuste les largeurs de texte et écrit un rapport. Une collision, un débordement ou une réduction sous 80 % de la taille prévue doit être résolu avant de présenter le fichier comme prêt. Vérifier le visuel après export, y compris le détail des photos et des logos.

Les outils d’exécution et d’export dépendent de la session. Les scripts et le plugin ne les installent ni ne les activent automatiquement. Un autre outil graphique disponible peut produire l’export si les polices, les images et les dimensions sont conservées. Sans export fiable, fournir ce qui a réellement pu être fabriqué et expliquer le manque.

## Composition nouvelle ou format différent

Le schéma JSON et le moteur actuel décrivent sept mises en page, pas toute la communication du club. Pour une campagne de bénévolat, un carrousel pédagogique, un portrait sans statistiques ou un format paysage, partir des règles générales et de la famille la plus proche. Créer ou adapter une source éditable aux dimensions demandées ; ne pas ajouter `custom` au moteur en supposant qu’il le connaît.

Conserver le contenu utile et la hiérarchie, puis recomposer les zones. Une story ou un carré n’est pas un simple étirement du feed. Si seul un texte est demandé, rédiger ce texte.

## Remise

La remise décrit les formats et pages effectivement produits, puis fournit les liens de fichiers, la légende ou le message, le texte alternatif et les crédits nécessaires. Indiquer les manques ou limites qui changent l’usage du résultat. Une pièce jointe demandée mais non produite ne doit pas apparaître comme un lien fictif.
