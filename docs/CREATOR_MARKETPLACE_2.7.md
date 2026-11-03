# Nexus Games 2.7.0 — Creator Marketplace

## Fonctionnalités
- Page /marketplace avec catalogue de créations issues de la galerie locale Nexus Games.
- Recherche plein texte, filtres par catégorie, favoris persistants dans le navigateur.
- Fiches détaillées avec description, genre et date.
- Navigation vers Creator Studio, galerie locale et import de fiches.

## Limites
Le catalogue ne présente que les créations disponibles localement sur l'appareil. Aucun hébergement public, compte, achat, paiement ou publication distante n'est activé. Les favoris utilisent une nouvelle clé localStorage dédiée et ne modifient pas les sauvegardes historiques.

## Validation à effectuer
Tester le chargement avec galerie vide et remplie, recherche, filtres, favoris, affichage mobile, puis npm test et npm run build.
