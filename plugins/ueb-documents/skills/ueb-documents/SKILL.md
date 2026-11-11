---
name: ueb-documents
description: Créer ou réviser les documents PDF Uccle Europe Basketball, présentations du club, dossiers de sponsoring et propositions de partenariat, avec une identité graphique versionnée et des faits validés. Ne pas utiliser pour les posts sociaux.
---

# UEB · Documents

Produire un PDF lisible, une source éditable et une provenance reproductible.
Lire le [contrat de fabrication](references/production.md) et le
[registre d’identité embarqué](../../identity/registry.json). Les ressources
`identity/`, `document-kit/` et `examples/documents/` sont à la racine du plugin,
deux niveaux au-dessus de cette skill.

## Choisir la référence avant de composer

Si un brief existe, conserver son identité, son modèle et son moteur exacts.
Pour un nouveau brief, proposer le profil embarqué `ueb-public-2026@1.0.0`.
Annoncer la version utilisée. Ne pas mélanger un ancien PDF avec une palette
plus récente. Pour une bascule demandée, garder l’original et créer un nouveau
brief/export. Une version absente est un manque explicite, jamais un fallback.

Si GitHub est disponible et autorisé, lire `identity/registry.json` dans
`mfavier/ueb-brand` pour comparer la version active à celle du paquet. Cette
lecture ne met pas à jour les actifs ni le plugin. Si elles diffèrent, signaler
le décalage et obtenir le kit complet de la version choisie avant d’y passer.
Sans accès GitHub, utiliser la version embarquée en l’indiquant. Ne pas prétendre
avoir vérifié la dernière version en ligne. Ne pousser aucun fichier dans GitHub.

## Préparer le document

Identifier public, objectif, langue, document demandé et faits disponibles.
Distinguer faits fournis/vérifiés, propositions de rédaction et manques. Ne pas
inventer de chiffres, prix, coordonnées, résultats, audience, avantages fiscaux
ou contreparties. Les exemples sont des modèles, pas les informations du club.
Demander seulement les faits bloquants ; préparer un brouillon avec manques
signalés si les autres éléments permettent d’avancer.

Choisir `club-presentation`, `sponsorship-dossier` ou `partnership-proposal`,
version `1.0.0`. Lire l’exemple JSON et le PDF correspondant. Respecter sa suite
de pages et le schéma. Adapter les titres et les textes au sujet. La couverture
reste courte, idéalement deux lignes. Préférer plusieurs paragraphes clairs à
un bloc dense. Une extension changeant la structure demande une évolution du
modèle, pas un fichier de code improvisé qui s’annonce comme le moteur officiel.

Renseigner les sources datées, les manques, `demo`, `reviewed` et `status` avec
honnêteté. Conserver `draft` tant que faits et engagements ne sont pas relus.
Une photo conserve date/saison et crédit. La photo d’archive des exemples ne
représente pas une équipe actuelle ; son usage réel doit être validé.

## Fabriquer et vérifier

Utiliser le moteur et les polices fournis, avec Node 22+. Aucune installation
npm n’est requise par le moteur autonome. Ne pas réécrire la mise en page dans
une autre bibliothèque, ni convertir les pages en images pour simuler un PDF.
Si l’environnement ne peut pas exécuter Node ou écrire les fichiers, livrer le
brief et annoncer le PDF comme non fabriqué. Ne jamais prétendre avoir généré
ou contrôlé un fichier absent. Consulter les commandes du contrat de fabrication.

Après génération, contrôler la pagination, le texte, les accents, les polices,
les tableaux/blocs et le contexte des photos. Quand les outils PDF sont présents,
exécuter la recette et ouvrir les pages rendues. Corriger les débordements ou
le texte trop dense avant livraison. Une vérification indisponible est signalée.

Livrer le PDF, la source JSON et la provenance, en nommant la version de charte
et les points à valider. La provenance technique reste dans les métadonnées et
le fichier joint. Ne pas envoyer le document à un partenaire ou publier quoi
que ce soit sans demande explicite distincte.

Les photos sont recopiées sous `nom-du-document.assets/`, avec des noms fondés
sur leur SHA256. La source exportée pointe vers ce dossier pour rester portable.
Conserver et livrer ce dossier avec le JSON et la provenance, idéalement dans
une archive de livraison avec le PDF. L’original du brief n’est pas réécrit.
