# Documentation des pages client `/profil`, `/user-profile`, `/coupons`

## 1. Page `/profil`

### Chemin du composant
- `src/app/(customer-view)/profil/page.tsx`

### Objectif
- Afficher et gérer les paramètres du compte utilisateur.
- Présenter les informations personnelles du client : prénom, nom, nom d'utilisateur, âge, email, téléphone.
- Permettre la déconnexion.
- Inclure deux modals de fonctionnalités bloquées : modification du profil et changement de mot de passe.
- Rediriger vers `/login` si l'utilisateur n'est pas authentifié.

### Sources de données
- `useBusStation()` depuis `src/context/Provider.tsx`
- `userData` provient du contexte global et est initialisé via la récupération du profil connecté.

### Endpoints utilisés
- `GET /utilisateur/profil`
  - Appelé via `src/lib/services/businessActor-service.ts#getConnectedUser`
  - Chargé par `src/context/Provider.tsx#getCurrentUser`
  - Retourne les données utilisateur dans `userData`.

### Endpoints mentionnés mais non fonctionnels
- `PATCH /utilisateur/{userId}`
  - Mentionné dans le modal `EditProfileModal`
  - Actuellement bloqué, non implémenté dans la page.

- `POST /utilisateur/change-password`
  - Mentionné dans le modal `ChangePasswordModal`
  - Actuellement bloqué, non implémenté dans la page.

### Comportement
- Affiche un spinner de chargement si `isLoading` ou `!userData`.
- Si l'utilisateur n'est pas authentifié, `router.push('/login')`.
- Boutons :
  - `Modifier le Profil` ouvre un modal inactif.
  - `Changer le mot de passe` ouvre un modal inactif.
  - `Déconnexion` appelle `logout()` du contexte.

---

## 2. Page `/user-profile`

### Chemin du composant
- `src/app/(customer-view)/user-profile/user-profile/page.tsx`

### Objectif
- Afficher un tableau de bord personnel avec résumé du profil et historique.
- Montrer des statistiques dérivées de l'historique : voyages réussis, annulations, réservations totales, destinations uniques.
- Afficher un lien vers `/profil` pour modification du profil.
- Fournir un aperçu rapide des dernières réservations et annulations.

### Sources de données
- `useBusStation()` depuis `src/context/Provider.tsx`
  - `userData` contient le profil connecté.
- `useHistorique()` depuis `src/lib/hooks/useHistorique.ts`
  - Charge l'historique des réservations de l'utilisateur.

### Endpoints utilisés
- `GET /utilisateur/profil`
  - Indirectement utilisé par `useBusStation` pour alimenter `userData`.

- `GET /historique/reservation/{userId}`
  - Appelé par `src/lib/hooks/useHistorique.ts#getHistoriqueByUser`
  - Retourne les historiques de réservation du client.

- `GET /reservation/{idReservation}`
  - Appelé dans `src/lib/hooks/useHistorique.ts` pour enrichir chaque historique.
  - Utilisé pour récupérer des détails du voyage associé à l'historique.

### Comportement
- Si `isLoading` est vrai, affiche un loader global avec `Header` et `Footer`.
- Affiche le profil utilisateur avec initiales, nom, rôle et un bouton vers `/profil`.
- Calcule les statistiques sur les historiques.
- Montre des sections pour :
  - Historique des réservations.
  - Confirmations.
  - Annulations.

### Remarques
- Le composant n'appelle pas directement d'API, il dépend des hooks partagés.
- Les informations utilisateur proviennent du contexte utilisateur chargé ailleurs.

---

## 3. Page `/coupons`

### Chemin du composant
- `src/app/(customer-view)/coupons/page.tsx`

### Objectif
- Afficher les coupons de remboursement de l'utilisateur.
- Filtrer les coupons par statut : tous, valides, expirés.
- Basculer entre une vue grille et une vue liste.
- Générer et télécharger une version PDF d'un coupon valide.

### Sources de données
- `useCoupons(activeTab)` depuis `src/lib/hooks/useCoupons.ts`
  - `filteredCoupons` contient les coupons filtrés côté client.
  - `isLoading` et `error` gèrent l'état de chargement et les erreurs.
- `useBusStation()` pour récupérer `userData.userId`.

### Endpoints utilisés
- `GET /coupon/user/{userId}`
  - Appelé par `src/lib/hooks/useCoupons.ts#getCouponsByUser`
  - Récupère la liste des coupons associés à l'utilisateur.

### Comportement
- Pendant le chargement, affiche `Loader`.
- En cas d'erreur, affiche une alerte d'erreur.
- Permet de filtrer les coupons par statut dans le frontend.
- Affiche un nombre total de coupons, le statut, le montant, l'agence, la destination et les dates de validité.
- Pour un coupon valide, propose un bouton de téléchargement PDF.
- Le téléchargement PDF est généré côté client via `html2pdf` et ne fait pas appel à un endpoint backend supplémentaire.

### Notes complémentaires
- Le QR code affiché pour chaque coupon est généré via le service externe :
  - `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=...`
- Le filtrage `VALIDE` / `EXPIRE` est effectué localement dans le hook, sans requête API différente.

---

## 4. Synthèse des endpoints clés

- `GET /utilisateur/profil`
  - Profil connecté de l'utilisateur.
  - Chargement initial du contexte `useBusStation`.

- `GET /historique/reservation/{userId}`
  - Historique de réservation du client.
  - Utilisé par `/user-profile`.

- `GET /reservation/{idReservation}`
  - Détails d'une réservation pour enrichir l'historique.
  - Utilisé par `/user-profile`.

- `GET /coupon/user/{userId}`
  - Liste des coupons du client.
  - Utilisé par `/coupons`.

### Endpoints mentionnés mais pas encore implémentés
- `PATCH /utilisateur/{userId}`
- `POST /utilisateur/change-password`

---

## 5. Fichiers principaux à consulter

- `src/app/(customer-view)/profil/page.tsx`
- `src/app/(customer-view)/user-profile/user-profile/page.tsx`
- `src/app/(customer-view)/coupons/page.tsx`
- `src/lib/hooks/useCoupons.ts`
- `src/lib/hooks/useHistorique.ts`
- `src/context/Provider.tsx`
- `src/lib/services/businessActor-service.ts`
