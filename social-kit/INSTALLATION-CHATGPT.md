# UEB — Installer l’Atelier communication

Le kit est maintenant la source du plugin **UEB — Atelier communication**, identifié par `ueb-social-studio`, version `0.1.0`. Il regroupe la skill, les règles générales, les compositions de départ, les exemples, les fichiers de marque et le moteur SVG.

La base graphique est suffisante pour commencer. Pour chaque publication réelle, il reste à fournir les faits et les actifs du sujet : équipes, score, date, salle, portrait, contribution ou logo du partenaire selon la demande. Les exemples fictifs ne sont pas une source de données réelles.

Les règles générales permettent d’adapter la composition à un nouveau sujet. Les sept templates ne définissent pas une liste fermée de publications. Le plugin ne contient pas de connecteur de diffusion et les outils d’export dépendent de la session : un PNG indisponible doit être annoncé comme tel.

## Créer le plugin dans ChatGPT

Lorsque la création de plugins est disponible dans l’espace de travail, sélectionner **Plugin Creator** avec `@` dans Chat ou Work, joindre l’archive `ueb-social-studio-plugin-0.1.0.zip`, puis transmettre ce brief. Suivre ensuite le flux de création proposé et tester dans une nouvelle conversation. [Guide officiel OpenAI](https://learn.chatgpt.com/docs/build-plugins).

```text
Crée un plugin privé « UEB — Atelier communication » avec l’archive jointe.
Le plugin source est dans social-kit/plugin.json et sa skill dans
social-kit/skills/ueb-social-posts/SKILL.md.

Conserve les règles générales, la charte, les références et les actifs de marque.
Le plugin doit choisir ou adapter une composition selon la demande, demander
seulement les informations réellement manquantes et vérifier la lisibilité.
Les sept modèles sont des points de départ ; les exemples et le portrait
illustratif sont fictifs. Conserve leur provenance.

Ne connecte aucun service externe et ne publie aucun post. Prépare les fichiers,
le texte et le texte alternatif, puis fais-moi tester les scénarios de recette.
```

L’archive sert à importer la source. Sa simple présence en pièce jointe ne prouve pas que le plugin est créé ou installé.

## Installer la source locale dans l’application de bureau

Le dépôt fournit `.agents/plugins/marketplace.json`, qui référence `./social-kit`. Enregistrer la **racine de `ueb-brand`** comme source locale si elle n’est pas déjà découverte :

```sh
codex plugin marketplace add /chemin/vers/ueb-brand
```

Redémarrer ou actualiser l’application, ouvrir le répertoire des plugins, choisir la source **Uccle Europe — Communication**, puis installer **UEB — Atelier communication**. Le catalogue prépare la découverte ; il ne constitue pas une installation automatique. [Format et installation locale documentés par OpenAI](https://developers.openai.com/plugins/build/plugins).

Sur une autre machine, décompresser l’archive et enregistrer sa racine de la même façon. Elle contient son propre catalogue et le dossier `social-kit`, sans chemin propre à l’ordinateur de préparation. Ne pas écraser une marketplace personnelle existante.

L’archive d’installation contient une sélection compacte des ressources utiles à la skill. La bibliothèque complète de revue reste dans le dépôt et dans l’archive intégrale du kit. Les commandes de production de la skill utilisent cette sélection ; régénérer toutes les planches depuis le dépôt complet.

## Premier test

Après installation, sélectionner le plugin dans une nouvelle conversation et fournir un vrai brief, par exemple un score final avec équipes domicile et extérieure, leurs scores, catégorie, compétition, date et photo autorisée. Demander le visuel, la source éditable, la légende et le texte alternatif.

Tester ensuite la [recette](TESTS-ACCEPTATION.md), notamment UEB à l’extérieur, huit rencontres, un joueur sans portrait et une annonce de bénévolat. Les [règles générales](REGLES-CREATION.md) définissent le résultat attendu au-delà des modèles.

## Statut

Les fichiers du plugin et les scripts se vérifient localement. L’installation et l’exécution dans une nouvelle conversation du compte cible restent à réaliser pour confirmer la sélection de la skill, l’accès aux ressources et les moyens d’export effectifs. Le dossier préparé n’atteste aucune installation dans le compte ni publication dans le répertoire public.
