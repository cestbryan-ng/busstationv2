# Architecture du Projet : Agence de Voyage

Ce document décrit l'architecture frontend de l'application, basée sur Next.js avec l'App Router.

## Vue d'ensemble des technologies

- **Next.js (App Router)** : Framework React pour le rendu côté serveur (SSR) et la génération de sites statiques (SSG). La structure `src/app` est au cœur de cette nouvelle approche.
- **TypeScript** : Pour un code typé, plus sûr et facile à maintenir.
- **Tailwind CSS** : Framework CSS "utility-first" pour un design rapide et cohérent.
- **ESLint** : Pour l'analyse statique du code et le respect des conventions.

## Structure des dossiers principaux

- **`src/app`**: Contient toutes les routes, les layouts et les pages de l'application. C'est le centre du **App Router** de Next.js.
- **`src/components`**: Répertoire pour les composants React. Ils sont organisés par fonctionnalité ou par page.
- **`src/ui`**: Contient les composants d'interface utilisateur de base (primitives), réutilisables à travers toute l'application (boutons, champs de saisie, etc.).
- **`src/lib`**: Héberge la logique métier, les services, les hooks personnalisés et les définitions de types.
- **`src/context`**: Pour la gestion de l'état global via les Contextes React (thème, langue, etc.).
- **`src/translations`**: Fichiers de traduction pour l'internationalisation (i18n).
- **`public`**: Contient les ressources statiques (images, polices, etc.).

## Pipeline d'affichage d'une page

Le pipeline décrit le processus complet, de la requête de l'utilisateur à l'affichage de la page dans le navigateur. Prenons comme exemple l'accès à la page `/dashboard` pour une agence.

### 1. Requête et Middleware

- Un utilisateur accède à l'URL `/dashboard`.
- Le premier fichier à s'exécuter est `src/app/middleware.ts`.
- **Rôle** : Ce middleware intercepte la requête avant qu'elle n'atteigne la page. Il est principalement utilisé pour la **gestion de l'authentification et des autorisations**. Il vérifie si l'utilisateur est connecté et s'il a les droits nécessaires (par exemple, le rôle "agency"). S'il ne remplit pas les conditions, il est redirigé (par exemple, vers `/login`).

### 2. Routage et Imbrication des Layouts

- Next.js fait correspondre l'URL `/dashboard` au chemin de fichier `src/app/(agency-views)/dashboard/page.tsx`.
- Le dossier `(agency-views)` est un **Route Group**. Il permet de structurer les fichiers et de partager un layout commun pour un ensemble de routes sans affecter l'URL.
- Next.js assemble l'interface en imbriquant les layouts dans l'ordre suivant :
  1.  **`src/app/layout.tsx` (Root Layout)** : Le composant racine qui enveloppe toute l'application. Il définit les balises `<html>` et `<body>`. C'est ici que les `Providers` globaux (venant de `src/context/Provider.tsx`) sont initialisés pour rendre disponibles des contextes comme le thème (sombre/clair) ou la langue.
  2.  **`src/app/(agency-views)/layout.tsx` (Nested Layout)** : Ce layout s'applique à toutes les pages du groupe `(agency-views)`. Il définit la structure visuelle commune à cette section, comme une barre de navigation latérale (`DashboardSidebar`) et un en-tête (`DashboardHeader`).

### 3. Rendu de la page et récupération des données

- Le composant de la page, `src/app/(agency-views)/dashboard/page.tsx`, est rendu à l'intérieur des layouts.
- **Logique de la page** :
  - La page utilise des **hooks personnalisés** depuis `src/lib/hooks/` pour encapsuler la logique métier et l'accès aux données. Par exemple, un hook `useDashboardOverview()` serait appelé pour obtenir les données du tableau de bord.
  - Ce hook appelle ensuite une fonction d'un **service** situé dans `src/lib/services/`.
  - Le service est responsable de la communication avec l'API backend. Il effectue l'appel HTTP (ex: `GET /api/dashboard/stats`) pour récupérer les données.
  - Pour assurer la cohérence et la sécurité du code, toutes les données manipulées (reçues de l'API ou envoyées) sont typées à l'aide d'interfaces définies dans `src/lib/types/`.

### 4. Affichage avec les composants

- Une fois les données récupérées, la page les transmet à des composants pour les afficher.
- **`src/components`** : La page utilise des composants plus complexes et spécifiques à une fonctionnalité, comme `StatCard.tsx` ou `RecentActivity.tsx` venant de `src/components/dashboard/`.
- **`src/ui`** : Ces composants de haut niveau sont eux-mêmes assemblés à partir de briques de base (primitives) provenant de `src/ui/`, comme `Card.tsx`, `Button.tsx`, ou `Spinner.tsx`.

### 5. États intermédiaires : Chargement et Erreurs

- **Chargement** : Pendant que les données sont en cours de récupération côté serveur, Next.js peut afficher instantanément une interface de secours grâce au fichier spécial `loading.tsx`. Cela améliore l'expérience utilisateur en évitant une page blanche.
- **Erreurs** :
  - Si une page n'est pas trouvée (erreur 404), Next.js rend le contenu de `src/app/not-found.tsx`.
  - Pour d'autres types d'erreurs (par exemple, une erreur de serveur lors de la récupération des données), on peut utiliser les composants dédiés dans `src/components/error-handler/`.

## Schéma récapitulatif du flux

`Requête utilisateur` → `Middleware` (Auth) → `Layout Racine` (Providers) → `Layout de section` (UI commune) → `Page` (Logique) → `Hook` (Gestion de l'état) → `Service` (Appel API) → `Composants` (Affichage) → `HTML final`
