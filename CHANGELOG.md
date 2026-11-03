# Nexus Games — Changelog

## 2.0.0 — The Next Level
- Nouvelle interface d'accueil inspirée des hubs Xbox et Steam.
- Accès direct depuis l'accueil aux deux jeux jouables : Nexus City et Neon Dodge.
- Nouveau hub de navigation vers Creator Studio, la galerie communautaire et le Player Club.
- Catalogue clarifié : deux jeux jouables, les autres fiches restent en préparation.
- Thème visuel bleu graphite avec accent vert, cartes et contrôles rafraîchis.
- Mise à jour des métadonnées et de la version du projet.
- Conservation des clés de stockage local et des données existantes.

### Fonctionnalités conservées
- Nexus City : métiers, véhicules, missions, météo, cycle jour/nuit, carburant et progression locale.
- Neon Dodge : jeu arcade, commandes clavier et tactiles, score et record local.
- Favoris, pseudo joueur, XP, défis, badges et niveaux.
- Creator Studio : éditeur 2D, test, brouillons, import et export.
- Galerie locale : import/export, réactions et commentaires locaux.
- Export de sauvegarde joueur.

### Limites connues
Les données restent locales au navigateur. Les comptes en ligne, sauvegardes cloud, synchronisation multi-appareils, classement mondial et galerie publique partagée ne sont pas activés. Le catalogue n'active aucun paiement.

## 1.0.0
Première version majeure préparant le catalogue, les fonctionnalités joueur locales, Creator Studio, la galerie locale et Nexus City.


## 2.1.0 — Nexus Save Center
- Ajout d'un centre de sauvegarde dans le profil joueur.
- Export JSON des données locales Nexus Games : favoris, pseudo, Nexus City, record Neon Dodge, Creator Studio et galerie communautaire.
- Import contrôlé : format/version, liste blanche des clés, types de données et tailles vérifiés avant restauration.
- Les données existantes restent dans les mêmes clés de stockage ; les deux jeux et leurs routes sont conservés.
- L'import remplace les clés présentes dans le fichier importé ; les autres données locales restent inchangées.


## 2.2.0 — Nexus Creator Evolution
- Ajout d'un nouvel éditeur 2D avec grille 12 × 8 et palette de construction.
- Deux modes de test : plateforme avec objectif et évitement avec collecte de pièces.
- Contrôles clavier (flèches, ZQSD/WASD) et commandes tactiles.
- Bibliothèque locale de projets, sauvegarde, import et export JSON validés.
- Interface Creator Evolution disponible en français et en anglais.
- Les données du Creator Studio historique et les jeux Nexus City / Neon Dodge ne sont pas modifiés.
- Les créations restent locales ; la publication publique nécessite un backend.


## 2.3.0 — Nexus Player Identity
- Carte de joueur personnalisable avec pseudo, statut et cinq couleurs d'accent.
- Aperçu du profil affichant le niveau, les XP et les badges débloqués.
- Historique local des jeux récemment lancés (Nexus City et Neon Dodge).
- Les nouvelles préférences du profil et l'historique sont inclus dans Nexus Save Center avec validation à l'import.
- Les données restent locales au navigateur ; aucune identité publique ou synchronisation en ligne n'est annoncée.


## 2.4.0 — Creator Studio Pro
- Palette enrichie : ressort, eau, gemme et checkpoint.
- Outil de remplissage rapide des cases vides.
- Annulation de la dernière modification dans l'éditeur.
- Nouveaux éléments pris en charge par la validation des projets et les fichiers JSON.
- Nexus City, Neon Dodge et les sauvegardes joueur restent conservés.


## 2.5.0 — Online Foundation
- Ajout de la page Nexus Network et de son contrôle de disponibilité API.
- Ajout de `GET /api/health` et des contrats versionnés pour les futurs profils et sauvegardes.
- Export local de données allowlistées au format JSON versionné.
- Documentation des prérequis de sécurité et des futures étapes backend.
- Les comptes, sauvegardes cloud, galerie publique et classements mondiaux ne sont pas activés.


## 2.6.0 — Multiplayer & Community Foundation
- Ajout de /multiplayer pour présenter les futures expériences de salons, coopération et compétition.
- Ajout de /community-share pour créer et échanger des fiches de créations JSON versionnées.
- Validation stricte du format et limite de 500 Ko à l'import/export ; les données importées ne sont jamais exécutées.
- Partage local par fichier uniquement, sans publication ni transfert serveur.
- Aucun service de multijoueur réseau, compte, chat ou matchmaking n'est activé.


## 2.7.0 — Creator Marketplace
- Ajout de /marketplace pour parcourir les créations locales.
- Recherche, filtres par genre, fiches détaillées et favoris persistants.
- Connexion au stockage de la galerie locale existante, sans migration destructive.
- Aucun achat, paiement, hébergement public ou transfert serveur n'est activé.


## 2.8.0 — Game Studio
- Ajout de /game-studio avec quatre modèles de conception de jeux.
- Réglages personnalisables : nom, description, difficulté et thème visuel.
- Aperçu de concept et objectifs de conception selon le modèle.
- Bibliothèque locale avec ouverture, suppression et export JSON.
- Import JSON versionné validé, limité à 200 Ko.
- Aucun jeu compilé automatiquement ni publication en ligne n'est annoncé.


## 2.9.0 — Nexus Game Engine
- Ajout de `/game-engine`, un éditeur de scènes 2D sur grille 10 × 8.
- Placement et inspection des objets : joueur, plateforme, pièce, obstacle et arrivée.
- Mode test avec déplacements par clavier et commandes tactiles, collecte et objectif.
- Bibliothèque locale de scènes et échanges JSON versionnés, validés et limités à 200 Ko.
- Stockage isolé dans `nexus-engine-scenes-v1` ; aucune modification des anciennes sauvegardes.
- Moteur expérimental : pas de compilation autonome, de physique avancée ni de publication en ligne.
