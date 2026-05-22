# Roster TCG Wrestler

Ce projet est une application web fullstack de collection, de gestion et de tirage de cartes à collectionner de catcheurs (TCG). Elle permet aux utilisateurs de naviguer dans une base de données exhaustive de catcheurs, d'ouvrir des paquets de cartes et de constituer leur propre collection en espérant obtenir les cartes les plus rares.

## Fonctionnalités Principales

### Galerie des cartes

Une vue d'ensemble de toutes les cartes de catcheurs disponibles dans la base de données (plus de 2000), avec filtrage, tri et pagination.

### Ouverture de paquets de cartes

Un système de tirage aléatoire géré côté serveur.

- Tirage de 10 cartes aléatoires par paquet.
- Algorithme de tirage de cartes équilibré.
- Sauvegarde des cartes tirées dans la collection locale de l'utilisateur (stockage côté serveur par compte plus tard).
- Différents types de paquets à ouvrir avec différentes cartes et probabilités.

### Collection personnelle

Un espace dédié pour consulter les cartes obtenues.

- Gestion via le stockage local (localStorage).
- Outils de recherche et de tri pour organiser sa collection privée.
- Plus tard : stockage côté serveur avec compte utilisateur.

### Détails techniques

- Proxy d'images intégré pour contourner les restrictions de partage de ressources (CORS) et assurer le chargement des portraits.
- Tri intelligent priorisant les entrées disposant de visuels.
- Tirage de cartes aléatoire pondéré selon la rareté des cartes.
- Données obtenues par scraping web de bases de données de catcheurs.

## Stack Technique

- Framework : Next.js
- Langage : TypeScript
- Base de données : SQLite
- ORM : Prisma
- Style : Tailwind CSS

## Installation et Lancement

1. Installation des dépendances :
   npm install

2. Initialisation de la base de données :
   npx prisma generate
   npx prisma db push

3. Lancement de l'environnement de développement :
   npm run dev

L'application sera accessible à l'adresse http://localhost:3000.

_Like si tu aimes John Cena, ignore pour te prendre un Burning Hammer_

![gif](https://media1.tenor.com/m/iawAFZdrA6sAAAAd/burning-hammer.gif)
