# Nexus Games 2.2.0 — Checklist de pré-lancement

**État : code source 2.1.0 préparé ; validation CI et déploiement de production encore requis.**

## Tests fonctionnels
- [ ] Accueil : hub 2.0, accès aux deux jeux, recherche, filtres, tri et favoris
- [ ] Profils : création, sélection, suppression et persistance après rechargement
- [ ] Creator Studio : création, test, sauvegarde, publication locale, import et export
- [ ] Galerie : affichage, import, export, réactions et commentaires locaux
- [ ] Nexus City : déplacements, véhicules, missions, sauvegarde et ravitaillement
- [ ] Succès : défis, XP, badges et niveaux
- [ ] Sauvegarde : export JSON et vérification du fichier généré

## Tests techniques
- [ ] `npm ci`
- [ ] `npm test`
- [ ] `npm run build`
- [ ] Vérifier les erreurs TypeScript et console navigateur
- [ ] Tester sur mobile et ordinateur
- [ ] Exporter puis réimporter une sauvegarde 2.1 sur un navigateur de test\n- [ ] Vérifier qu'un fichier JSON invalide ou trop volumineux est refusé\n- [ ] Vérifier que les sauvegardes Nexus City, records Neon Dodge, favoris et créations sont restaurés

## Déploiement
- [ ] Déploiement Vercel en état READY
- [ ] Vérifier la page d'accueil, les routes /creator, /community, /games/nexus-city et /games/neon-dodge
- [ ] Tester le domaine de production
- [ ] Publier les notes de version 2.1.0

**Règle :** ne pas annoncer le lancement public tant que les tests et le déploiement ne sont pas validés.


## Contrôles 2.2.0
- [ ] Vérifier l'accès à /creator/evolution depuis un navigateur mobile et ordinateur
- [ ] Tester les modes plateforme et évitement
- [ ] Vérifier les commandes clavier et tactiles
- [ ] Enregistrer, recharger, exporter puis importer un projet 2.2
- [ ] Vérifier le basculement français / anglais
- [ ] Confirmer que Nexus City, Neon Dodge et les clés localStorage historiques fonctionnent toujours


## Contrôles 2.3.0
- [ ] Modifier le pseudo et le statut puis recharger la page
- [ ] Tester les cinq couleurs de profil
- [ ] Vérifier l'aperçu du niveau, des XP et des badges
- [ ] Lancer Nexus City et Neon Dodge puis vérifier l'historique récent
- [ ] Exporter puis importer une sauvegarde avec les nouvelles clés
- [ ] Vérifier qu'un accent ou un historique invalide est refusé
- [ ] Confirmer que Nexus City, Neon Dodge et Creator Evolution restent accessibles


## Contrôles 2.4.0
- [ ] Vérifier l'affichage de la palette enrichie sur mobile et ordinateur
- [ ] Placer les quatre nouveaux éléments et vérifier leur rendu
- [ ] Tester le remplissage des cases vides et l'annulation
- [ ] Exporter puis importer un projet contenant les nouveaux éléments
- [ ] Vérifier l'ouverture des anciens projets 2.2/2.3
- [ ] Tester les modes plateforme et évitement
- [ ] Confirmer que Nexus City, Neon Dodge et les sauvegardes joueur restent accessibles


## Contrôles 2.5.0
- [ ] Vérifier l'accès à /online sur mobile et ordinateur
- [ ] Vérifier que /api/health renvoie le statut foundation-ready et les capacités désactivées
- [ ] Vérifier l'export JSON local et son contenu allowlisté
- [ ] Confirmer qu'aucune donnée n'est envoyée à un serveur par l'export
- [ ] Vérifier que la page affiche clairement l'absence de comptes et de synchronisation cloud
- [ ] Vérifier que Nexus City, Neon Dodge, Creator Studio et les sauvegardes locales restent accessibles
- [ ] Exécuter npm test et npm run build
- [ ] Vérifier le déploiement Vercel


## Contrôles 2.6.0
- [ ] Vérifier /multiplayer sur mobile et ordinateur et confirmer les statuts non activés
- [ ] Créer une fiche JSON depuis /community-share
- [ ] Vérifier le refus d'un JSON invalide et d'un fichier supérieur à 500 Ko
- [ ] Importer une fiche valide et vérifier que son contenu est affiché comme données, jamais exécuté
- [ ] Vérifier que l'export reste local et qu'aucune requête d'envoi de fichier n'est effectuée
- [ ] Confirmer que Nexus City, Neon Dodge, Creator Studio et les sauvegardes locales restent accessibles
- [ ] Exécuter npm test et npm run build
- [ ] Vérifier le déploiement Vercel


## Contrôles 2.7.0
- [ ] Vérifier /marketplace avec une galerie vide puis remplie
- [ ] Tester recherche, filtres par genre et fiches détaillées
- [ ] Ajouter/retirer des favoris puis recharger la page
- [ ] Confirmer que les favoris utilisent une clé locale distincte et que les anciennes sauvegardes restent intactes
- [ ] Vérifier les liens Creator Studio, galerie et Marketplace sur mobile et ordinateur
- [ ] Confirmer qu'aucun achat, paiement ou transfert de création vers un serveur n'est proposé
- [ ] Exécuter npm test et npm run build
- [ ] Vérifier le déploiement Vercel


## Contrôles 2.8.0
- [ ] Vérifier /game-studio sur mobile et ordinateur
- [ ] Tester les quatre modèles et les réglages de personnalisation
- [ ] Vérifier que l'aperçu et les objectifs suivent le modèle sélectionné
- [ ] Enregistrer, recharger, ouvrir, supprimer et exporter un projet
- [ ] Importer un JSON valide et vérifier le refus d'un fichier invalide ou supérieur à 200 Ko
- [ ] Confirmer que les projets utilisent une clé localStorage distincte
- [ ] Vérifier l'accès depuis le hub et préserver les jeux et sauvegardes existants
- [ ] Exécuter npm test et npm run build
- [ ] Vérifier le déploiement Vercel
