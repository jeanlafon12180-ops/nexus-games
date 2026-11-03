# Nexus Games 2.0

**Version majeure 2.0.0 — interface joueur Xbox / Steam inspirée.**

Nexus Games rassemble un catalogue de jeux, deux jeux originaux jouables, une bibliothèque locale, le Nexus Player Club, Creator Studio et une galerie locale de créations.

## Les deux jeux jouables
- **Nexus City** : simulation en monde ouvert avec métiers, véhicules, missions, météo, cycle jour/nuit, carburant et progression locale.
- **Neon Dodge** : jeu d'arcade avec commandes clavier/tactiles, score et record local.

Les autres entrées du catalogue sont des fiches de jeux en préparation et ne sont pas annoncées comme jouables.

## Nouveautés 2.0.0
- Nouvelle expérience d'accueil inspirée des interfaces Xbox et Steam.
- Accès direct aux deux jeux depuis l'accueil avec des cartes « Reprendre ta partie ».
- Hub central vers Nexus Creator Studio, la galerie communautaire et le Nexus Player Club.
- Catalogue clarifié : deux jeux jouables et les futurs jeux clairement identifiés.
- Thème visuel rafraîchi, navigation plus lisible et mise en page responsive.
- Conservation des clés de stockage local existantes afin de préserver les favoris, profils, créations, commentaires et progressions sur le même navigateur.

## Fonctionnalités existantes conservées
- Recherche, filtres, tri et favoris dans le catalogue.
- Profils joueurs locaux, défis, XP, badges et niveaux.
- Creator Studio : création de niveaux 2D, test, brouillons, import et export.
- Galerie communautaire locale : créations importées/publiées localement, réactions et commentaires.
- Export JSON de sauvegarde joueur.

## Limites actuelles
Les profils, sauvegardes, réactions, commentaires et créations restent enregistrés dans le navigateur de l'appareil. Les comptes en ligne, la synchronisation cloud, le classement mondial et une galerie publique partagée nécessitent encore un backend sécurisé. Aucun paiement ni achat réel n'est activé dans le catalogue.

## Développement
```bash
npm install
npm run dev
npm test
npm run build
``

## Stack
Next.js 15 · React 19 · TypeScript · CSS
