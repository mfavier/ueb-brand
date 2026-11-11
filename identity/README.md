# Identités graphiques UEB

Le registre [registry.json](registry.json) est le point d’entrée commun. Une
identité est référencée par **id + version**, jamais par une date implicite ou
par « latest ». Le champ `active` sert uniquement à préparer un nouveau brief.
Un document existant conserve sa propre référence.

| Identité | Version | Périmètre |
|---|---|---|
| `ueb-public-2026` | `1.0.0` | Communication issue du site 2026 : nouveaux PDF et palette des posts. |
| `ueb-apps-legacy` | `0.4.0` | Instantané des tokens de `@ueb/brand v0.4.0`, pas un moteur de documents historique. |

Les manifests verrouillent les tokens, règles et actifs par SHA256. Le registre
verrouille à son tour les manifests. Les fichiers d’une release présente sur
`main` deviennent immuables ; le garde-fou CI refuse modification, suppression
ou ajout dans cette release. Une correction demande une nouvelle version.

## Bascule graphique

1. Ajouter un dossier de release complet avec ses actifs et sa provenance.
2. Préparer les adapters/consommateurs et les exemples, puis vérifier leurs rendus.
3. Faire relire la différence visuelle et fusionner après CI verte.
4. Modifier `active` quand la nouvelle identité est celle des nouveaux documents.
5. Migrer un ancien brief uniquement sur demande explicite : conserver l’original
   et produire un nouvel export avec une nouvelle référence et sa provenance.

Pour une identité : MAJOR = changement graphique du rendu existant ; MINOR =
ajout compatible sans changer le rendu existant ; PATCH = correction de
métadonnées/règles sans effet visuel. Un nouveau système peut aussi avoir un
nouvel id. Ces versions sont indépendantes des versions du paquet npm, des
modèles, du moteur PDF et du plugin. Les règles SemVer du paquet applicatif
restent celles de son README.

Le [tableau des consommateurs](consumers.json) documente les références actuelles.
Les posts et applications gardent leurs propres cycles de migration. Un contrôle
compare la palette sociale à son profil déclaré sans modifier le moteur existant.

## Actifs de la première release

Les logos et polices proviennent de `social-kit/assets/` au commit
`4db9c35be93bfc8e6beea7f409af729e9697b33a`. Le SVG officiel est identique à
`src/logos/uccle-europe.svg`. Le PNG transparent de 886×1000 conserve ce dessin.
Les deux graisses Kanit sont les TTF statiques officiels. Les licences OFL sont
conservées. DM Sans est instanciée depuis la variable fournie, avec fonttools
4.61.1, axes `opsz=14`, `wght=400/700`. Les noms internes des instances deviennent
`DM Sans UEB Regular/Bold` pour distinguer les fichiers PDF ; les tracés restent
ceux de DM Sans. La variable source est archivée dans la release. La commande
`python scripts/prepare_identity_fonts.py --check` contrôle cette dérivation
sans modifier la release.

Aucun chiffre métier, tarif ou contact courant n’est une donnée de charte.

La CI verrouille aussi les recettes déjà publiées et exige une nouvelle version
de moteur/plugin lorsque leur contenu livré change. Le tag applicatif `v0.4.0`
n’est pas réutilisé comme tag de ce kit ; aucune nouvelle release de package
applicatif n’est créée par cette préparation.
