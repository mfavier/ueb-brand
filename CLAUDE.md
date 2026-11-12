# @ueb/brand

Shared brand identity for the UEB apps (tokens, typography, crest): see `README.md`.

## Invariants
- Jamais de `git add` sur un dossier, avec `.`, `-A` ou `git commit -a` : les fichiers sont nommés un par un, et le diff indexé (`git diff --cached`) est relu avant chaque commit. Origine : un `git add e2e` a emporté quatre specs jetables (ueb-evolution#148).
