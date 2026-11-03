# Nexus Games — BÊTA

## Version bêta 0.0.1.7 — Galerie communautaire locale
- Nouvelle page Galerie communautaire accessible depuis la navigation
- Les créations publiées depuis Creator Studio apparaissent dans la galerie du même navigateur
- Import de fichiers .nexusgame.json pour ajouter et découvrir des créations sur l'appareil
- Aperçu des niveaux, export et suppression des créations de la galerie
- Limite clairement indiquée : galerie locale, sans serveur public ni synchronisation entre joueurs

## Version bêta 0.0.1.6 — Partage de créations
- Export d'un jeu au format de fichier Nexus Games JSON
- Import d'un fichier de création et validation de sa structure avant chargement
- Partage possible entre joueurs en s'envoyant le fichier exporté
- Les créations restent stockées localement ; aucune galerie publique ni synchronisation en ligne n'est encore activée

 Nexus Games — BÊTA

## Version bêta 0.0.1.5 — Nexus Creator Studio
- Nouvel espace Creator Studio pour concevoir une petite scène de jeu 2D avec une grille et une palette d'objets
- Aperçu jouable avec déplacement du personnage au clavier et sur les commandes tactiles
- Brouillons et créations enregistrés localement dans le navigateur
- Publication locale dans « Mes créations » ; le partage public entre joueurs nécessite encore un backend et des comptes en ligne

# Nexus Games — BÊTA

## Version bêta 0.0.1.4
- Nexus City ajoute des activités de monde ouvert et des objets interactifs
- Un système de recherche à cinq étoiles réagit aux actions du joueur
- Le métier Police permet de saisir les objets signalés et de reprendre le service au commissariat
- Objets, crédits et niveau de recherche sont conservés localement sur l'appareil
- Nexus City reste un prototype 2D ; la 3D est une étape ultérieure

# Nexus Games — BÊTA

## Version bêta 0.0.1.3
- Niveaux de joueur calculés à partir des XP gagnés dans les Défis Nexus
- Quatre badges à débloquer selon les actions du joueur
- Tableau de progression personnel avec niveau et XP
- Progression conservée localement sur l'appareil ; aucun classement mondial ni compte en ligne

# Nexus Games — BÊTA

## Version bêta 0.0.1.2
- Cycle jour/nuit et météo évolutive dans Nexus City (ensoleillé, nuageux, pluie)
- Ajout des Défis Nexus sur la plateforme : profil, collection de favoris et découverte de Nexus City
- Points XP calculés automatiquement et progression locale sur l’appareil

> **Nexus Games est actuellement en version bêta.** Certaines fonctionnalités sont expérimentales et peuvent évoluer.

Plateforme de découverte et de jeux indépendants — prototype Next.js.

## Version bêta 0.0.1.1
- Missions avec parcours en deux étapes entre plusieurs lieux de la ville
- Progression automatique lorsqu’un joueur rejoint la zone demandée
- Mission en cours et étape actuelle conservées dans la sauvegarde locale
- Possibilité d’abandonner une mission et de la reprendre plus tard

## Version bêta 0.0.1.0
- Repères de destination visibles sur la carte et sélection de lieux à explorer
- Missions désormais liées à une zone : il faut rejoindre le lieu indiqué pour les valider
- Guide des cinq destinations : terminal, secours, commissariat, hangar et centre-ville

## Version bêta 0.0.0.9
- Sauvegarde locale du métier, véhicule, crédits, missions, niveau d'aéroport et position
- Interactions contextuelles avec le terminal, le centre de secours, le commissariat, le hangar et le centre-ville
- Les interactions des bâtiments sélectionnent le métier correspondant

## Version bêta 0.0.0.8
- Garage avec cinq choix : à pied, voiture, camion de pompier, voiture de police et avion
- Déplacement des véhicules avec une vitesse adaptée
- Commandes tactiles pour jouer sur mobile
- Correction de la syntaxe du catalogue qui bloquait le déploiement

## Version bêta 0.0.0.7
- Ajout de Nexus City, jeu de simulation intégré
- Quatre métiers, missions et récompenses virtuelles
- Carte 2D interactive avec déplacement clavier

## Version bêta 0.0.0.6
- Filtre dédié pour afficher uniquement les jeux favoris
- Compteur de favoris intégré au filtre
- Catalogue, favoris et pseudo restent utilisables sans compte en ligne

## Version bêta 0.0.0.5
- Page de préparation du compte joueur : inscription / connexion
- Maquette explicitement indiquée comme inactive, sans collecte d’identifiants
- Authentification en ligne à connecter à un fournisseur sécurisé avant activation

## Version bêta 0.0.0.4
- Profil joueur local avec pseudo personnalisable
- Favoris et pseudo conservés entre les visites sur le même navigateur et appareil
- Indication claire : pas encore de compte en ligne ni de synchronisation multi-appareils

## Version 0.0.0.3
- Catalogue de 9 jeux avec fiches détaillées
- Recherche par nom et description, filtres par catégorie
- Favoris locaux et bibliothèque personnelle
- Premier mini-jeu HTML5 original jouable : Neon Dodge
- Interface responsive ordinateur / mobile

## Lancer en local
```bash
npm install
npm run dev
``

## À savoir
Les autres jeux du catalogue sont des fiches de présentation et ne sont pas encore jouables. Neon Dodge est le premier jeu original intégré à la plateforme. Les prochains jeux seront développés ou ajoutés avec les autorisations nécessaires.

## Pile technique
Next.js · React · TypeScript · CSS
