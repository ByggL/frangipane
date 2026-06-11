# Frangipane - Wrestler TCG

**Frangipane** est une application web fullstack de collection de cartes de catch permettant aux passionnés de constituer leur roster idéal à travers un système de tirage aléatoire et une base de données exhaustive.

## Installation

1. **Cloner le projet**

   ```bash
   git clone https://github.com/votre-repo/frangipane.git
   cd frangipane
   ```

2. **Installer les dépendances**

   ```bash
   npm install
   ```

3. **Configurer l'environnement**
   Créez un fichier `.env` à la racine :

   ```env
   DATABASE_URL="postgresql://user:password@localhost:5432/frangipane"
   AUTH_SECRET="votre_secret_next_auth"
   ```

4. **Initialiser la base de données**

   ```bash
   npx prisma migrate dev
   npx prisma db seed
   ```

5. **Lancer le serveur de développement**
   ```bash
   npm run dev
   ```

## Configuration

- **Next.js 15 :** Utilisation de l'App Router avec support des Promises pour `params` et `searchParams`.
- **Prisma :** ORM configuré avec PostgreSQL. Le schéma inclut les modèles `User`, `WrestlerCard` et `UserCard` (relation many-to-many pour la collection).
- **NextAuth.js :** Authentification basée sur des credentials avec gestion de session persistante.

## Architecture

L'application suit une architecture hybride optimisée pour Next.js :

- **Data Flow :**
  - Les données sont centralisées dans une base de données PostgreSQL gérée via **Prisma**.
  * **API Layer :** Les interactions avec la base de données sont encapsulées dans des **Route Handlers** (`/api/cards`, `/api/user/collection`). Cela permet une séparation nette entre la logique de données et l'interface.
  * **Client vs Server Components :**
    - **Pages :** Utilisent des Server Components pour le rendu initial et la gestion du SEO.
    - **Listes & Détails :** Utilisent des Client Components pour un fetching asynchrone via les API routes, permettant une interactivité fluide et des mises à jour d'état locales sans rechargement.

## Stratégie de Cache & Performance

- **Streaming & Suspense :** Implémentation de React Suspense avec des **Skeleton Loaders** personnalisés. Les parties statiques de la page (headers, filtres) s'affichent instantanément pendant que les données lourdes (grilles de cartes) sont fetchées en arrière-plan.
- **Image Proxy :** Un Route Handler `/api/proxy` sert d'intermédiaire pour les images externes, permettant de contourner les restrictions CORS et d'optimiser le chargement via `next/image`.
- **Next.js Data Cache :** Utilisation du cache natif de Next.js pour les requêtes API répétitives afin de minimiser la charge sur la base de données.

## Choix Techniques

- **Framework :** [Next.js 15](https://nextjs.org/) pour sa robustesse et ses fonctionnalités de rendu hybride.
- **Base de données :** PostgreSQL avec [Prisma](https://www.prisma.io/) pour un typage fort de bout en bout.
- **Styling :** Tailwind CSS complété par du CSS vanilla léger.
- **Authentification :** [NextAuth.js](https://next-auth.js.org/) pour une gestion simple et sécurisée des sessions.

---

## Contraintes du Projet (Validées)

- [x] **Layouts imbriqués :** Organisation structurelle différenciant les zones publiques et privées.
- [x] **Data fetching API :** Migration réussie vers un fetching côté client via API routes pour une meilleure réactivité.
- [x] **Server Action :** Gestion dynamique de la collection.
- [x] **Route Handler :** Proxy d'images et API de cartes.
- [x] **Auth next-auth :** Système sécurisé avec persistence de la collection.
- [x] **Optimisations :** Polices Geist, `next/image`, et streaming (Suspense).

## MVP (Minimum Viable Product)

- **Authentification :** Connexion/Inscription via NextAuth.
- **The Vault :** Galerie complète des 2000+ catcheurs avec filtres et pagination.
- **Pack Opening :** Tirage aléatoire de 10 cartes géré côté serveur.
- **My Collection :** Interface de gestion des cartes possédées.
- **Image Proxy :** Cache et bypass CORS.

## Répartition de l'équipe

- **Eliot Louys :** Responsable Backend & Auth.
- **Samuel Léobon :** Responsable Frontend & Data.
