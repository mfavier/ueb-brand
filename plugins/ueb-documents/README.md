# UEB — Documents · 0.1.0

Plugin privé de fabrication des PDF Uccle Europe. Le dépôt est sa source ; les
archives sont des distributions autonomes de cette source, avec références et
empreintes. Les instructions, gabarits, moteur, polices et exemples sont livrés
ensemble. Node 22+ est nécessaire pour fabriquer un PDF ; GitHub ne suffit pas
à exécuter le moteur. Aucun serveur ni clé API n’est ajouté.

Fabriquer depuis la racine du dépôt :

```sh
npm run build --prefix document-kit
python3 scripts/package_documents.py --output /tmp/ueb-documents-plugin-0.1.0.zip
```

Importer cette unique archive via « Nouveau plugin » ou Plugin Creator. Après
installation, choisir **UEB — Documents** dans une nouvelle conversation. Tester
un vrai brief, une information absente et un ancien brief avec version figée.
Le succès d’import ne prouve pas l’exécution dans une session ChatGPT Pro.

Pour vérifier la fraîcheur, connecter GitHub et autoriser `mfavier/ueb-brand`,
puis comparer le registre à la version embarquée. Une mise à jour du dépôt ne
modifie pas un ZIP déjà installé : installer la nouvelle release complète pour
changer de version. La synchronisation officielle de marketplace est une
fonction d’espace administré, à vérifier selon le compte :
https://learn.chatgpt.com/docs/enterprise/plugin-management.

Le dossier présent dans `plugins/` contient la source des instructions ; le
script assemble les ressources canoniques dans l’archive. Ne pas installer
ce dossier partiel directement comme source locale. L’installation du paquet
autonome dépend du client. Les documents ne sont jamais envoyés à un tiers
par le plugin. L’intégration à Manager est une étape ultérieure.
