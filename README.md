# Nexus Games — BÊTA

> **Nexus Games est actuellement en version bêta.** Certaines fonctionnalités sont expérimentales et peuvent évoluer.

Plateforme de découverte et de jeux indépendants — prototype Next.js.

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
