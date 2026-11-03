# Nexus Games 2.6.0

**Version majeure 2.2.0 — interface joueur Xbox / Steam inspirée.**

Nexus Games rassemble un catalogue de jeux, deux jeux originaux jouables, une bibliothèque locale, le Nexus Player Club, Creator Studio et une galerie locale de créations.

## Les deux jeux jouables
- **Nexus City** : simulation en monde ouvert avec métiers, véhicules, missions, météo, cycle jour/nuit, carburant et progression locale.
- **Neon Dodge** : jeu d'arcade avec commandes clavier/tactiles, score et record local.

Les autres entrées du catalogue sont des fiches de jeux en préparation et ne sont pas annoncées comme jouables.

## Nouveautés 2.1.0
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

## Nouveautés 2.6.0 — Multiplayer & Community Foundation
- Nouvelle page /multiplayer pour présenter les futures expériences de salons, coopération et compétition.
- Page /community-share pour créer, exporter, importer et vérifier des fiches de créations JSON versionnées.
- Validation du format, des champs et d'une limite de 500 Ko ; le contenu importé n'est jamais exécuté.
- Les échanges restent locaux par fichier : aucun hébergement public ni transfert automatique.
- Aucun compte, salon réseau, matchmaking, chat ou multijoueur en ligne n'est activé.

## Développement
```bash
npm install
npm run dev
npm test
npm run build
``

## Stack
Next.js 15 · React 19 · TypeScript · CSS


## Nouveautés 2.1.0 — Nexus Save Center
- Centre de sauvegarde intégré au profil joueur.
- Export JSON des favoris, du pseudo, de la sauvegarde Nexus City, du record Neon Dodge, des créations et de la galerie locale.
- Import de sauvegarde sur un autre appareil avec contrôle du format, des clés autorisées, des types et des tailles avant écriture.
- Les clés de stockage des versions précédentes sont conservées ; aucune migration destructive n'est effectuée.
- L'import remplace uniquement les données locales présentes dans le fichier de sauvegarde. Exporter une sauvegarde avant tout import est recommandé.

## Nouveautés 2.2.0 — Nexus Creator Evolution
- Nouvel atelier 2D indépendant avec grille 12 × 8 et palette (joueur, sol, pièce, obstacle, arrivée).
- Modes de jeu plateforme et évitement, aperçu jouable et commandes clavier/tactiles.
- Bibliothèque locale de projets avec import/export JSON et validation des fichiers.
- Interface française et anglaise.
- Les deux jeux originaux et les anciennes données du Creator Studio restent inchangés.


## Nouveautés 2.3.0 — Nexus Player Identity
- Carte de joueur personnalisable : pseudo, statut et cinq couleurs.
- Aperçu du niveau, des XP et des badges dans le profil.
- Historique local des derniers jeux lancés.
- Export/import de sauvegarde étendu aux nouvelles préférences du profil et à l'historique.
- Fonctionnalités locales uniquement, sans compte serveur.


## Nouveautés 2.4.0 — Creator Studio Pro
- Palette enrichie avec ressort, eau, gemme et checkpoint.
- Outils de remplissage des cases vides et d'annulation de la dernière modification.
- Nouveaux éléments intégrés à la validation et à l'export/import des projets.
- Les anciennes créations restent compatibles ; les projets sont toujours stockés localement.


## Nouveautés 2.5.0 — Online Foundation
- Nouvelle page Nexus Network accessible depuis le hub.
- Point de contrôle API `GET /api/health` sans cache.
- Contrats TypeScript versionnés pour les profils et enveloppes de sauvegarde.
- Export local JSON versionné depuis la page Network, sans transfert réseau.
- Comptes, synchronisation cloud, galerie publique et classements mondiaux explicitement non activés.
- Documentation des prérequis de sécurité avant toute mise en service d'un backend.
