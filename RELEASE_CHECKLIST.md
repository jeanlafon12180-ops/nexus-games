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
