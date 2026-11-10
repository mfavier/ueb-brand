# Brief d’exécution — Posts Uccle Europe Basketball

Joindre ce fichier avec `CHARTE.md`, le PNG de l’exemple de la rubrique, son modèle SVG, le blason officiel et les actifs du post réel. Remplir les informations ci-dessous. L’exemple montre une composition ; ses contenus fictifs ne doivent pas être repris comme des faits.

## Données du post à remplir

```text
RUBRIQUE : 01 Résultats / 02 Programme / 03 Partenaire / 04 Player of the week /
           05 Annonce officielle / 06 Communication / 07 Score final
MODÈLE FOURNI :
CANAL ET FORMAT : feed 1080 × 1350 / story 1080 × 1920
LANGUE :
OBJECTIF DU POST :
INFORMATIONS EXACTES :
  Équipe UEB et catégorie :
  Équipe domicile / équipe extérieure, si concerné :
  Score domicile / score extérieur, si concerné :
  Dates complètes, heures et lieu :
  Partenaire, joueur, poste, numéro ou statistiques, si concernés :
  Texte validé et signataire, pour une annonce officielle :
PHOTOS ET LOGOS FOURNIS / CRÉDITS :
ACTION ET LIEN PUBLIC VÉRIFIÉ :
DATE DE DIFFUSION :
```

## Instruction à exécuter

```text
Tu prépares un post Uccle Europe Basketball à partir des fichiers joints.
Le modèle SVG définit la composition ; le PNG montre le rendu attendu.
Applique aussi les règles de CHARTE.md.

Remplis le modèle existant. Conserve le canevas, les positions, les marges,
les filets, la hiérarchie, le placement du blason et les couleurs de la rubrique.
Conserve Kanit pour les titres et DM Sans pour les informations. Importe le
blason officiel fourni tel quel. Utilise uniquement les photos et logos joints.

Remplace les contenus fictifs par les données du brief. Pour les scores,
maintiens l’ordre domicile–extérieur : les noms et leurs scores vont ensemble.
Ne complète pas une information manquante par supposition. Signale les manques
et conserve une version de travail s’ils empêchent de produire le post final.

Rédige une légende courte, concrète et adaptée au canal, avec une action utile
si le sujet le demande. Un résultat peut se suffire à lui-même. N’ajoute pas
de formule emphatique, de promesse, de métaphore ou de slogan automatique.

La qualité recherchée vient des alignements, des espaces, de la typographie
et des informations. N’ajoute aucun halo, éclat, texture métallique, badge,
confetti, ombre sur les lettres, faux projecteur ou ballon décoratif.
Les photos conservent leur naturel. Le blason n’est jamais redessiné.

Si un texte dépasse sa zone, propose une formulation plus courte. Respecte
les limites du modèle et réserve le détail à la légende. Garde les accents.

Livre le fichier modifiable et un PNG à la taille exacte, ainsi que la légende
et le texte alternatif. Si ton environnement ne peut pas modifier le SVG ou
produire un fichier fiable avec les polices fournies, dis-le précisément et
fournis les données structurées à placer dans le modèle. Ne présente pas
une réinterprétation approximative comme l’exécution exacte du template.

Contrôle le résultat contre le PNG de référence avant de livrer. Retire la
mention de démonstration seulement après remplacement et vérification de
toutes les données fictives.
```

## Exemple de demande courte

```text
Exécute le modèle 07 Score final joint, version feed, en français.
Les données qui suivent sont celles du match à publier : [données vérifiées].
Garde la composition du PNG de référence et le blason joint. Fournis le SVG,
le PNG, une légende factuelle et le texte alternatif. Pour la photo, utilise
[nom du fichier fourni], avec le crédit [crédit validé].
```

Pour garantir la grille à chaque publication, on peut aussi demander uniquement le JSON correspondant au modèle, puis utiliser `scripts/generate.py`. Le moteur remplit alors une mise en page existante à partir de ces données.
