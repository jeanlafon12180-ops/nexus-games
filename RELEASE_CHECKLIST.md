# Nexus Games 1.0.0 — Checklist de pré-lancement

**État : code source 1.0.0 préparé ; validation CI et déploiement de production encore requis.**

## Tests fonctionnels
- [ ] Accueil : recherche, filtres, tri et favoris
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
- [ ] Vérifier les anciennes sauvegardes et les fichiers importés

## Déploiement
- [ ] Déploiement Vercel en état READY
- [ ] Vérifier la page d'accueil et les routes /creator, /community et /account
- [ ] Tester le domaine de production
- [ ] Publier les notes de version 1.0.0

**Règle :** ne pas annoncer le lancement public tant que les tests et le déploiement ne sont pas validés.
