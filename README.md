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
- Tirage de cartes aléatoire géré côté serveur via Prisma.
- Architecture multi-pages avec navigation fluide et esthétique sombre premium.

## Mise en cache

### Mise en cache du proxy d'images

Le point de terminaison `/api/proxy` implémente une directive `Cache-Control: "public, max-age=86400, s-maxage=86400"`.
Les images sont mises en cache par le navigateur et les CDN pendant 24 heures.
Cette approche réduit la latence lors de la navigation dans la galerie et limite les requêtes répétées vers les serveurs externes.

### Persistance de la collection en local

La collection personnelle de l'utilisateur est gérée via `localStorage`. Les données des cartes tirées sont stockées directement dans le navigateur sous la clé `wrestler_collection`.
Cela permet un accès instantané à la collection sans nécessiter d'appels API supplémentaires pour le prototype actuel.

### Optimisation des requêtes API

L'utilisation de la pagination côté serveur (`skip` et `take` dans Prisma) fait que seules les données nécessaires sont transférées, ce qui gère mieux la mémoire pour les grands jeux de données.

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
