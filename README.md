# Frangipane - Wrestler TCG

**Frangipane** est une application web fullstack de collection de cartes de catch permettant aux passionnés de constituer leur roster idéal à travers un système de tirage aléatoire et une base de données exhaustive.

## Contraintes du Projet

- [x] **Layouts imbriqués :** Organisation structurelle différenciant les zones publiques (Accueil, Vault) et privées (Ma Collection, Profil) via des layouts segmentés (ex: `/app/collection/layout.tsx`).
- [x] **Data fetching serveur :** Rendu hybride avec récupération des données athlètes via Prisma directement dans les Server Components pour des performances optimales et un SEO natif.
- [x] **Server Action :** Utilisation d'actions serveur pour la gestion dynamique de la collection (ajout de cartes, mise à jour des favoris) sans rechargement de page.
- [x] **Route Handler :** Implémentation d'une API interne `/api/proxy` pour optimiser le chargement des images externes et `/api/cards` pour la recherche avancée.
- [x] **Auth next-auth :** Système d'authentification sécurisé permettant une expérience personnalisée et la persistence de la collection par utilisateur en base de données.
- [x] **Optimisations mesurables :** Utilisation de polices variables (Geist), optimisation des images via `next/image` et le proxy, et implémentation du streaming (Suspense) pour les listes de cartes.

## MVP (Minimum Viable Product)

- **Authentification :** Connexion/Inscription via NextAuth pour sécuriser l'accès à la collection.
- **The Vault :** Galerie complète des 2000+ catcheurs avec filtres (rareté, poids, promotion) et pagination.
- **Pack Opening :** Tirage aléatoire de 10 cartes géré côté serveur avec probabilités basées sur la rareté.
- **My Collection :** Interface de gestion des cartes possédées par l'utilisateur.
- **Image Proxy :** Système de bypass CORS et mise en cache des portraits d'athlètes.

## Backlog Initial

1. **US1 (P0) :** me connecter pour sauvegarder ma collection de manière permanente.
2. **US2 (P0) :** parcourir l'intégralité des cartes disponibles pour connaître ma progression.
3. **US3 (P0) :** ouvrir un paquet de cartes pour obtenir de nouveaux catcheurs.
4. **US4 (P0) :** consulter ma collection personnelle pour voir mes cartes les plus rares.
5. **US5 (P1) :** filtrer les catcheurs par rareté pour trouver les "Legendary" plus facilement.
6. **US6 (P1) :** ajouter une carte à mes favoris via une action rapide sur la carte.
7. **US7 (P1) :** que les images chargent instantanément grâce à un système de cache efficace.
8. **US8 (P2) :** voir des statistiques détaillées sur mon deck (poids moyen, répartition des alignements).
9. **US9 (P2) :** une interface fluide et animée lors du tirage des cartes pour plus de plaisir.
10. **US10 (P3) :** pouvoir simuler un match entre deux cartes de ma collection.

## Répartition de l'équipe

- **Eliot Louys :** Responsable Backend & Auth (NextAuth integration, Route Handlers, Logique de tirage aléatoire).
- **Samuel Léobon :** Responsable Frontend & Data (Design System, Prisma, Schema, Server Components, Animations).
