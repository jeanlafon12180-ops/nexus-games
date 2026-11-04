# Nexus Games — architecture PC + navigateur (stockage limité)

> Statut : architecture cible documentée ; aucun moteur 3D complet, build PC ou multijoueur n'est livré par ce document.
> Contrainte : moins de 5 Go libres sur le PC ; éviter toute installation locale lourde.

## 1. Décision technique

Adopter une architecture web-first : un runtime 3D Babylon.js partagé entre le navigateur et une application Windows Electron. Les dépendances et compilations sont exécutées par GitHub Actions ; le PC sert à éditer et tester la version Web sans conserver les dossiers de compilation.

- Navigateur : Babylon.js + WebGL 2, avec WebGPU si disponible.
- Windows : Electron embarque le même client web ; gameplay et règles restent partagés.
- Hub : Next.js existant pour catalogue, profils et lancement.
- CI : GitHub Actions pour tests, builds et installateur Windows.
- Assets : modèles glTF/GLB, textures PBR compressées, audio et niveaux séparés des builds.
- Clé USB : stockage/transport des assets et exports ; pas un disque de compilation idéal.

Ce choix limite les installations locales, mais ne rend pas automatiquement le jeu équivalent à Fortnite. Le réalisme dépend des modèles, animations, environnements, éclairage, audio, optimisation et du temps de production.

## 2. Stack

| Domaine | Technologie / rôle |
|---|---|
| Hub | Next.js + React + TypeScript |
| Runtime 3D | Babylon.js + TypeScript |
| Rendu | WebGL 2 ; WebGPU en amélioration progressive |
| Formats 3D | glTF / GLB ; textures PBR compressées |
| Navigateur | Client web servi par le hub |
| Windows | Electron, empaqueté par GitHub Actions |
| CI et builds | GitHub Actions, artefacts temporaires |
| Données joueur | API sécurisée à concevoir ; stockage local limité aux préférences/cache |
| Multijoueur futur | Serveur faisant autorité et transport WebSocket |
| Assets volumineux | Git LFS ou stockage séparé ; ne pas committer les builds |

## 3. Structure cible

```text
nexus-games/
├── src/                         # Hub Next.js
├── game/                        # Runtime Babylon partagé
│   ├── src/core/
│   ├── src/gameplay/
│   ├── src/rendering/
│   ├── src/platform/
│   └── public/assets/           # GLB, textures, audio
├── desktop/                     # Shell Electron
├── public/games/                # Build Web publié
├── .github/workflows/           # CI et build Windows distants
└── docs/architecture/
```

Ne pas committer les dossiers de build, caches ou dépendances générés. Garder les assets source séparés des bundles exportés. Configurer Git LFS seulement si nécessaire et surveiller les quotas.

## 4. Qualité visuelle visée

- Personnages et accessoires détaillés au format GLB, avec squelettes et animations.
- Matériaux PBR, éclairage cohérent et environnements avec direction artistique.
- Ombres, ciel, brouillard, post-traitement et audio selon les capacités.
- LOD, compression des textures, occlusion et chargement progressif.
- Réglages distincts : qualité élevée sur PC compatible, profil Web plus léger.
- Assets originaux ou sous licence adaptée ; ne pas copier les contenus de Fortnite.

## 5. Livraison sur les deux plateformes

### Navigateur
- Le hub ouvre une page qui charge le runtime Babylon.
- WebGL 2 sert de chemin de compatibilité ; charger les ressources progressivement.
- Afficher une erreur claire si WebGL, la mémoire ou le chargement des assets échoue.

### Windows
- Electron ouvre le même client et le même runtime Babylon.
- GitHub Actions construit l'installateur Windows à distance.
- Tester l'installateur sur un vrai PC Windows avant distribution.
- Ne pas promettre de performances supérieures : les deux plateformes partagent le moteur et les profils peuvent varier.

## 6. Développement sans stockage local

1. Modifier les fichiers via GitHub ou un éditeur web léger.
2. Exécuter tests et builds dans GitHub Actions.
3. Conserver les artefacts dans Actions ou les télécharger ponctuellement.
4. Tester la version navigateur depuis un déploiement de preview.
5. Copier sur la clé USB les assets source utiles et les exports à archiver.
6. Nettoyer les téléchargements locaux après validation ; les sources restent sur GitHub.

La clé USB est un espace de transport et d'archive, pas un substitut idéal au disque système pour compiler ou exécuter les outils.

## 7. Limites

- Aucun projet Babylon complet ni installateur Electron n'est encore livré.
- Le prototype battle royale actuel reste séparé ; il ne devient pas automatiquement un jeu réaliste.
- Le multijoueur, matchmaking, comptes cloud et sauvegardes serveur ne sont pas activés.
- Les builds Windows sur GitHub Actions doivent être testés sur un vrai PC Windows.
- Le navigateur et Electron restent limités par les capacités GPU/CPU de la machine.
- Le réalisme dépend des assets et de l'optimisation, pas seulement du moteur.

## 8. Jalons

- 7.0 — Fondation web 3D : ajouter Babylon.js, scène de test, caméra, terrain, éclairage et contrôles.
- 7.1 — Qualité visuelle : personnage original animé, environnement PBR, ombres et optimisation.
- 7.2 — Windows : shell Electron et workflow GitHub Actions pour un installateur de test.
- 7.3 — Intégration : runtime dans le hub et validation navigateur/Windows.
- 7.4 — Jeu vertical slice : boucle de jeu, interface, audio et sauvegarde locale.
- 7.5 — Online : serveur autoritaire, salons et synchronisation après validation solo.

## 9. Critères d'acceptation

- Runtime Babylon fonctionnel depuis le hub sur Chrome et Firefox desktop.
- Même runtime lancé dans l'application Windows Electron.
- Builds produits à distance par GitHub Actions.
- Scène avec modèle animé original, environnement PBR, ombres et commandes.
- Performances mesurées sur le PC cible ; limites documentées.
- Aucun gros outil de création 3D requis sur le PC avec moins de 5 Go libres.

## Références

- Babylon.js : https://doc.babylonjs.com/
- Electron : https://www.electronjs.org/docs/latest/
- GitHub Actions : https://docs.github.com/actions
- glTF : https://www.khronos.org/gltf/