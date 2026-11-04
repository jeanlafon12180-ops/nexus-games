# Nexus Games — architecture PC + navigateur

> Statut : architecture cible, pas encore un jeu Unity compilé ni une version jouable.
> Décision : un projet Unity 6 partagé, avec des profils de compilation Windows et Web.

## 1. Objectif produit

Nexus Games conserve son hub Next.js, mais les jeux 3D ne sont plus dessinés par le hub. Chaque jeu possède un runtime indépendant, construit depuis un projet moteur commun et distribué sur plusieurs plateformes.

- **Windows** : build natif installable, qualité graphique élevée et accès aux ressources locales autorisées.
- **Navigateur desktop** : build Unity Web (WebAssembly/WebGL), intégré dans une page du hub.
- **Identité visuelle** : mêmes personnages, environnements, règles et commandes de base ; qualité graphique et distance d'affichage ajustées selon la plateforme.
- **Mobile web** : non prioritaire pour le premier jeu 3D ; ne pas promettre la compatibilité avant des tests réels.

## 2. Stack retenue

| Domaine | Technologie / rôle |
|---|---|
| Hub, catalogue, pages, compte | Next.js + React + TypeScript (existant) |
| Moteur 3D | Unity 6, projet C# partagé |
| Rendu | Universal Render Pipeline (URP), avec profils qualité par plateforme |
| Build PC | Windows x86-64 |
| Build navigateur | Unity Web, WebAssembly + WebGL |
| Distribution web | Hub Next.js/Vercel pour les pages et les fichiers statiques du build, après validation des en-têtes MIME/compression |
| Données joueur | API sécurisée à définir ; ne pas considérer localStorage comme une sauvegarde cloud |
| Multijoueur | Serveur faisant autorité ; transport WebSocket compatible navigateur pour les clients Web |
| Assets | Fichiers source versionnés ; Git LFS à configurer pour les gros fichiers binaires |

## 3. Structure cible du dépôt

```text
nexus-games/
├── src/                         # Hub Next.js existant
│   ├── app/
│   │   └── games/[slug]/         # Page d'accueil/lecteur du jeu
│   └── components/game-player/   # Intégration du build Web
├── public/
│   └── games/                    # Builds Web exportés (pas les sources Unity)
├── game-unity/                   # Projet Unity (à créer avec Unity Hub)
│   ├── Assets/
│   │   ├── GameCore/              # Gameplay partagé
│   │   ├── Characters/
│   │   ├── Environments/
│   │   ├── UI/
│   │   └── Platform/
│   ├── Packages/
│   └── ProjectSettings/
├── docs/
│   └── architecture/
│       └── dual-platform.md
└── CHANGELOG.md
```

Les dossiers générés par Unity (Library, Temp, Obj, Builds locaux) ne doivent pas être commités. Les gros modèles, textures et sons doivent utiliser Git LFS ou un stockage d'assets adapté.

## 4. Séparation des responsabilités

### Runtime Unity
- Contrôles et caméra à la troisième personne.
- Animation, physique, collisions et interactions.
- Monde, éclairage, matériaux, audio et interface en jeu.
- Systèmes de jeu indépendants du hub web.
- Adaptateurs de plateforme pour clavier/manette, sauvegarde et réseau.

### Hub Next.js
- Catalogue, pages de présentation, comptes et bibliothèque.
- Lancement du build Web dans un lecteur isolé et responsive.
- Détection de la disponibilité du build et messages d'erreur lisibles.
- Liens de téléchargement des builds PC signés, une fois leur distribution configurée.
- Aucun rendu 3D de gameplay dans React.

### Services en ligne
- Authentification et autorisations vérifiées côté serveur.
- Sauvegardes avec validation et limites de taille.
- Matchmaking et salons uniquement lorsqu'un serveur de jeu existe.
- État de partie validé côté serveur ; le client ne décide pas seul des résultats.
- Le client navigateur utilise un transport compatible Web (WebSocket/relay), pas des sockets TCP/UDP natifs.

## 5. Profils de performance

| Paramètre | Windows | Navigateur |
|---|---|---|
| Qualité | Élevée / réglable | Moyenne / réglable |
| Textures | Résolution selon GPU | Packs compressés plus légers |
| Ombres | Distance et qualité élevées | Distance réduite |
| Décor | Densité complète selon matériel | LOD et distance d'affichage agressifs |
| Téléchargement | Installateur / fichiers du jeu | Chargement initial compact + contenu différé |
| Sauvegarde | API commune, cache local optionnel | API commune, cache navigateur optionnel |

La parité recherchée concerne le gameplay et le contenu, pas une promesse de performances ou de qualité identiques. Unity Web impose des contraintes de mémoire, de threading, de graphismes et de réseau ; le build navigateur doit être profilé séparément.

## 6. Pipeline de livraison

1. Développer et tester le jeu dans Unity Editor.
2. Lancer les tests gameplay et performances dans l'éditeur.
3. Construire Windows x86-64.
4. Construire Unity Web avec le profil Web dédié.
5. Vérifier le chargement, les fichiers .wasm/.data, les en-têtes MIME, la compression et les erreurs console.
6. Déployer le build Web dans le dossier public versionné et publier le hub.
7. Tester sur au moins un PC modeste et un PC plus puissant, ainsi que sur Chrome et Firefox desktop.
8. Ne promouvoir une version qu'après validation des deux plateformes.

## 7. Limites et décisions non prises

- Le prototype WebGL artisanal de `/battle-royale` reste une démo provisoire ; il ne devient pas automatiquement un projet Unity.
- Aucun serveur multijoueur, matchmaking, compte cloud ni système anti-triche n'est actuellement livré.
- Aucun installateur Windows Unity n'est encore produit.
- Les services réseau et le stockage définitifs seront choisis avant l'activation des comptes et du multijoueur.
- Un jeu de qualité commerciale demande des modèles, animations, sons, niveaux, tests et optimisation ; le choix du moteur ne les génère pas automatiquement.

## 8. Jalons

- **A — Fondation** : créer le projet Unity URP, configurer Windows + Web et valider une scène de test.
- **B — Vertical slice** : un personnage animé, caméra, terrain détaillé, bâtiment, éclairage, audio et boucle de jeu jouable.
- **C — Intégration** : page du hub qui charge le build Web ; distribution du build Windows.
- **D — Services** : identité joueur et sauvegardes sécurisées.
- **E — Multijoueur** : serveur autoritaire, salons, synchronisation et tests de charge.

## 9. Critères d'acceptation du premier prototype

- Le même projet Unity produit un build Windows et un build Web.
- Les deux builds démarrent, affichent la scène et acceptent les contrôles.
- La version Web est accessible depuis le hub sur Chrome et Firefox desktop.
- Les erreurs de chargement sont visibles et compréhensibles.
- Les performances sont mesurées et les profils graphiques sont distincts.
- La documentation indique clairement les fonctionnalités non disponibles.

## Références techniques

- Unity Web — présentation : https://docs.unity.com/en-us/engine/6000.0/manual/platform-specific/webgl/intro
- Unity Web — limitations techniques : https://docs.unity.com/en-us/engine/6000.6/manual/platform-specific/webgl/intro/technical-overview
- Unity — optimisation d'un build Web : https://unity.com/how-to/profile-optimize-web-build
