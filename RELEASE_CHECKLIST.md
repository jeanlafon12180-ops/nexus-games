# Nexus Games 2.1.0 — Checklist de pré-lancement

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
