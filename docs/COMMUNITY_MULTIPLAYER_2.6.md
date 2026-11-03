# Nexus Games 2.6.0 — Multiplayer & Community Foundation

## Livré
- Page /multiplayer présentant les futures expériences de salons privés, coopération et compétition.
- Page /community-share pour créer une fiche JSON de création portable.
- Format versionné `nexus-games-creation`, schéma 1.
- Contrôle de structure, champs, taille maximale de 500 Ko et import sans exécution du contenu.
- Export et import locaux uniquement.

## Non activé
Aucun compte, salon réseau, matchmaking, chat, serveur de jeu, publication publique, stockage distant ou classement mondial. Les statuts affichés sont des préparations, pas des services disponibles.

## Sécurité et compatibilité
Les données importées sont traitées comme du JSON non fiable. Le contenu n'est jamais exécuté. Les sauvegardes joueur historiques et les jeux existants ne sont pas modifiés. Les futures fonctions réseau devront être validées côté serveur et protégées par authentification et autorisations.
