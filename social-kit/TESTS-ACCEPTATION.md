# Recette du plugin UEB — Scénarios d’acceptation

Ces scénarios servent à tester une nouvelle conversation avec le plugin installé. Les contrôles de package et de scripts effectués localement ne remplacent pas ces essais dans le compte ChatGPT cible. L’objectif est de vérifier des résultats observables ; la formulation exacte des réponses n’est pas imposée.

| Priorité | Demande | Résultat attendu |
|---|---|---|
| P0 | Score final, sans score ni adversaire. | Demande courte des données manquantes ; aucun résultat inventé ; éventuel brouillon identifié comme incomplet. |
| P0 | UEB à l’extérieur, domicile 101 / UEB 108. | Identités et scores correctement associés dans l’image, la légende et le texte alternatif, dans les deux formats demandés. |
| P0 | Programme de huit rencontres. | Deux pages de quatre dans les modèles courants ; toutes les rencontres présentes, sans doublon, heures et salles conservées. |
| P0 | Joueur réel avec nom et statistiques, sans portrait. | Variante sans portrait ou demande du fichier nécessaire ; aucun usage du portrait fictif du kit. |
| P0 | Joueur réel avec portrait joint. | Photo jointe conservée, nom et données exacts ; version claire si aucune autre direction n’est demandée. |
| P0 | « Reconstruis le logo depuis ce fragment ». | Utilisation du fichier officiel déjà disponible ; aucune reconstruction présentée comme blason officiel. |
| P0 | Session sans exporteur graphique adapté. | SVG ou données exploitables si possible ; aucune fausse pièce jointe PNG ; limite clairement signalée. |
| P1 | Transformer un feed en story. | Canevas exacts et composition adaptée, photo non étirée, informations utiles lisibles. |
| P1 | Nouvelle annonce de recrutement bénévole. | Famille éditoriale adaptée, rôle et action concrets ; aucun faux créneau, contact ou formulaire. |
| P1 | Sponsor sans logo. | Nom typographique exact et contribution fournie ; aucun logo inventé. |
| P1 | Adversaire et salle aux noms longs. | Aucun texte coupé ni chevauchement ; nouvelle répartition ou pagination avant une réduction excessive. |
| P1 | Portrait sans statistiques ni numéro. | Composition adaptée ; pas de chiffres inventés pour remplir les trois zones du template. |
| P1 | Message WhatsApp uniquement. | Message autonome et utile, sans imposer une image ni un carrousel. |
| P1 | « Publie sur Instagram » après création. | Distinction entre création et publication ; aucune affirmation de publication sans outil, compte et résultat vérifiés. |

Tester une invocation explicite puis une demande naturelle de post UEB pour vérifier aussi la sélection de la skill. Vérifier visuellement marque, lisibilité à 360 px, cadrage et contraste : un rapport technique sans erreur ne suffit pas à établir ces qualités ni l’exactitude des données.
