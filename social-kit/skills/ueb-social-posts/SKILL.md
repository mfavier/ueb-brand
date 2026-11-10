---
name: ueb-social-posts
description: Créer ou adapter les visuels et textes Uccle Europe Basketball pour Instagram, WhatsApp et la communication du club, avec les actifs officiels et une identité cohérente. Utiliser pour les matchs, programmes, joueurs, partenaires, annonces et nouveaux sujets UEB.
---

# UEB — Atelier communication

Produire une communication reconnaissable, lisible sur téléphone et fidèle aux données du club. Les sept modèles sont des compositions de départ, pas les seules formes autorisées.

## Ressources à charger

Le dossier du plugin est deux niveaux au-dessus de ce fichier. Les chemins des actifs et scripts sont relatifs à cette racine ; ils restent à l’intérieur du plugin.

- Lire les [règles générales](../../REGLES-CREATION.md) pour la création ou la révision visuelle. Elles séparent les invariants des choix de composition.
- Lire le [contrat de travail](references/production.md) pour identifier les informations requises, préparer les données et choisir un moyen de fabrication disponible.
- Consulter la [charte détaillée](../../CHARTE.md) si un point de marque, de contraste ou de canal doit être précisé.
- Ouvrir le PNG de référence de la rubrique choisie, dans `examples/<rubrique>-feed.png`. Pour comparer photo et blason ou clair et sombre, ouvrir seulement les variantes pertinentes décrites dans `data/explorations.json`, dans `explorations/*-feed.png`.
- Les actifs officiels et leur provenance sont dans `assets/`. Les exemples sont fictifs et ne fournissent aucune donnée réelle de publication.

Ne pas charger les quarante compositions pour une demande simple.

## Comprendre le résultat attendu

Déduire de la demande le sujet, le public, le canal, la langue et les fichiers souhaités. Pour une publication visuelle sans autre précision, partir du français et du format feed 1 080 × 1 350 px ; annoncer cette hypothèse brièvement. Produire une story seulement si elle est demandée ou utile au brief accepté. Pour un simple message WhatsApp, rédiger le message sans imposer une image.

Demander uniquement les informations qui changent les faits ou rendent impossible le livrable demandé. Avancer sur les éléments indépendants. Une préférence esthétique absente peut être résolue avec les règles du club ; un score, un nom, une date ou un prix absent ne s’invente pas.

Choisir une famille :

| Besoin | Point de départ |
|---|---|
| Résultats de plusieurs matchs | `01-resultats` |
| Programme de rencontres | `02-programme` |
| Présentation de partenaire | `03-partenaire` |
| Joueur ou distinction individuelle | `04-player-of-the-week` |
| Annonce institutionnelle validée | `05-annonce-officielle` |
| Information pratique, activité ou vie du club | `06-communication` |
| Score final d’un match | `07-score-final` |
| Autre sujet ou composition nouvelle | Adapter une des quatre familles des règles générales ; expliciter l’adaptation. |

Les titres génériques des templates peuvent être remplacés par le vrai sujet dans une nouvelle composition. Ne pas imposer « Bon à savoir », trois statistiques, un slogan ou un appel à l’action à chaque publication.

## Préparer les contenus

Séparer données fournies, informations vérifiées et manques. Le moteur SVG reprend la forme des JSON dans `data/*-template.json` ; ces fichiers contiennent des champs à compléter. Préparer un JSON distinct pour chaque page. Le schéma [post.schema.json](../../schemas/post.schema.json) décrit les entrées des sept compositions existantes.

Pour les listes, conserver l’ordre fourni, regrouper si utile et répartir sur plusieurs pages avant de diminuer les informations. Les templates courants acceptent quatre matchs par page ; huit matchs deviennent deux pages de quatre. Une autre grille est possible si le sujet appelle une création adaptée et que la lecture reste nette.

Pour un score, conserver l’association domicile–score / extérieur–score dans le visuel, la légende et le texte alternatif. Un score final doit être connu. Pour un joueur réel, utiliser son portrait fourni ou une variante sans portrait ; ne pas reprendre le portrait illustratif du kit. Un partenaire sans logo peut être présenté avec son nom exact, sans inventer de marque.

`demo: false` indique une intention de production, pas une preuve de vérification. Relire les données avant de l’utiliser. Ne pas copier les noms, chiffres, dates, annonces ou contacts des exemples comme des informations réelles.

## Construire le visuel

Appliquer les règles générales : palette publique, Kanit / DM Sans, identité simple, lecture à 360 px, photo naturelle ou blason décoratif choisi selon le sujet. Le Player clair est le point de départ pour une mise en avant photographique sur Instagram ; garder un contraste sombre si le brief le demande.

Importer le blason officiel intact lorsqu’il sert d’identifiant. Pour une matière de fond, utiliser les dérivés décoratifs fournis ; ne pas reconstituer un logo depuis un fragment. Conserver les polices et le logo comme actifs distincts d’une image générée.

Quand le sujet correspond à une composition existante et qu’une exécution de fichiers est disponible, remplir le moteur `scripts/generate.py` avec les données confirmées. Pour une nouvelle composition, créer une source éditable qui applique les mêmes principes, sans forcer le JSON d’une rubrique inadéquate.

La génération d’image peut servir à une illustration demandée ou à une recherche visuelle, avec les outils disponibles. Elle ne remplace pas un vrai joueur, un vrai événement ou un logo officiel. Si elle compose directement un post, vérifier particulièrement les mots, les chiffres et les marques ; ne pas qualifier un rendu approximatif de reproduction exacte du template.

## Vérifier et remettre

Contrôler les faits, la correspondance des scores, les accents, les dimensions, le contraste, les cadrages et la lecture à 360 px. Pour une série, vérifier aussi l’ordre, la continuité et l’absence de match perdu ou dupliqué. Les contrôles techniques ne remplacent pas cette revue.

Remettre les fichiers effectivement créés, le texte adapté au canal, le texte alternatif et les éventuels crédits. Donner les hypothèses et manques qui affectent la diffusion. Si aucun moyen d’export PNG fidèle n’est disponible, livrer le SVG ou les données exploitables et dire précisément que le PNG n’a pas été produit.

La préparation du post ne constitue pas une publication sur Instagram ou un envoi WhatsApp. Une demande explicite de publication doit être traitée avec un outil approprié disponible et le compte concerné ; ce plugin ne fournit pas lui-même de connecteur de diffusion.
