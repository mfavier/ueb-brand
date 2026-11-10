# UEB — Installer l’Atelier communication

Le kit est la source du plugin **UEB — Atelier communication**, identifié par `ueb-social-studio`, version `0.1.1`. Il regroupe la skill, les règles générales, les compositions de départ, les exemples, les fichiers de marque et le moteur SVG.

La base graphique est suffisante pour commencer. Pour chaque publication réelle, il reste à fournir les faits et les actifs du sujet : équipes, score, date, salle, portrait, contribution ou logo du partenaire selon la demande. Les exemples fictifs ne sont pas une source de données réelles.

Les règles générales permettent d’adapter la composition à un nouveau sujet. Les sept templates ne définissent pas une liste fermée de publications. Le plugin ne contient pas de connecteur de diffusion et les outils d’export dépendent de la session : un PNG indisponible doit être annoncé comme tel.

## Ajouter le plugin dans ChatGPT

Dans la fenêtre **Nouveau plugin** :

1. Cliquer sur **Choisir un fichier**.
2. Sélectionner **`ueb-social-studio-plugin-0.1.1.zip`**.
3. Cliquer sur **Ajouter**, puis suivre les indications affichées.

**Garder le ZIP fermé : ne pas le décompresser pour cet ajout.** Cette archive contient un seul plugin, avec `plugin.json` directement à sa racine et les dossiers `skills/`, `assets/`, `scripts/` ainsi que les documents à côté. Elle n’inclut pas le catalogue de marketplace.

La version `0.1.0` remise précédemment était organisée comme une marketplace : le plugin était imbriqué dans un dossier accompagné du catalogue et d’autres fichiers. Cette organisation était inadaptée à l’import direct qui a retourné « Expected a single plugin archive ». La version `0.1.1` corrige l’organisation du ZIP. La documentation officielle demande une racine de plugin unique, située à la racine du ZIP ou dans un seul dossier de premier niveau, sans fichiers frères dans ce second cas. [Référence OpenAI des erreurs d’archive](https://developers.openai.com/plugins/deploy/submission-errors).

## Alternative avec Plugin Creator

Si la création passe par une conversation avec **Plugin Creator**, le sélectionner avec `@`, joindre **la même archive `ueb-social-studio-plugin-0.1.1.zip`**, puis transmettre ce brief. [Guide officiel OpenAI](https://learn.chatgpt.com/docs/build-plugins).

```text
Crée un plugin privé « UEB — Atelier communication » avec l’archive jointe.
Le ZIP contient plugin.json directement à sa racine. La skill est dans
skills/ueb-social-posts/SKILL.md, à partir de cette même racine.

Conserve les règles générales, la charte, les références et les actifs de marque.
Le plugin doit choisir ou adapter une composition selon la demande, demander
seulement les informations réellement manquantes et vérifier la lisibilité.
Les sept modèles sont des points de départ ; les exemples et le portrait
illustratif sont fictifs. Conserve leur provenance.

Ne connecte aucun service externe et ne publie aucun post. Prépare les fichiers,
le texte et le texte alternatif, puis fais-moi tester les scénarios de recette.
```

L’archive sert à importer la source. Sa présence en pièce jointe, comme les contrôles locaux du ZIP, ne prouve pas que l’ajout côté ChatGPT a réussi.

## Installer la source locale dans l’application de bureau

Le dépôt fournit `.agents/plugins/marketplace.json`, qui référence `./social-kit`. Enregistrer la **racine de `ueb-brand`** comme source locale si elle n’est pas déjà découverte :

```sh
codex plugin marketplace add /chemin/vers/ueb-brand
```

Redémarrer ou actualiser l’application, ouvrir le répertoire des plugins, choisir la source **Uccle Europe — Communication**, puis installer **UEB — Atelier communication**. Le catalogue prépare la découverte ; il ne constitue pas une installation automatique. [Format et installation locale documentés par OpenAI](https://developers.openai.com/plugins/build/plugins).

Sur une autre machine, utiliser **`ueb-social-studio-marketplace-0.1.1.zip`** pour cette installation locale. Décompresser cette archive, puis enregistrer le dossier qui contient à la fois `.agents/` et `social-kit/`. Ce format conserve son catalogue et sa source locale, sans chemin propre à l’ordinateur de préparation. Ne pas écraser une marketplace personnelle existante.

| Archive | Destination |
|---|---|
| `ueb-social-studio-plugin-0.1.1.zip` | Bouton **Choisir un fichier** dans ChatGPT, ou pièce jointe pour Plugin Creator. |
| `ueb-social-studio-marketplace-0.1.1.zip` | Décompression puis enregistrement comme marketplace locale pour la CLI et l’application de bureau. |

Le paquet de marketplace se fabrique avec `python3 scripts/package_plugin.py --layout marketplace` depuis `social-kit`. Le ZIP destiné à l’import direct est produit par défaut, sans cette option. Ne pas envoyer l’archive marketplace dans la fenêtre d’ajout direct d’un plugin.

L’archive d’installation contient une sélection compacte des ressources utiles à la skill. La bibliothèque complète de revue reste dans le dépôt et dans l’archive intégrale du kit. Les commandes de production de la skill utilisent cette sélection ; régénérer toutes les planches depuis le dépôt complet.

## Premier test

Après installation, sélectionner le plugin dans une nouvelle conversation et fournir un vrai brief, par exemple un score final avec équipes domicile et extérieure, leurs scores, catégorie, compétition, date et photo autorisée. Demander le visuel, la source éditable, la légende et le texte alternatif.

Tester ensuite la [recette](TESTS-ACCEPTATION.md), notamment UEB à l’extérieur, huit rencontres, un joueur sans portrait et une annonce de bénévolat. Les [règles générales](REGLES-CREATION.md) définissent le résultat attendu au-delà des modèles.

## Statut

Les fichiers du plugin et les scripts se vérifient localement. L’installation et l’exécution dans une nouvelle conversation du compte cible restent à réaliser pour confirmer la sélection de la skill, l’accès aux ressources et les moyens d’export effectifs. Le dossier préparé n’atteste aucune installation dans le compte ni publication dans le répertoire public.
