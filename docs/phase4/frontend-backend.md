# Phase 4 — Connexion du frontend au backend

## Objectif
Remplacer les données mock (Login, Register, Dashboard) par de vrais appels au backend FastAPI, avec authentification JWT.

## Fichier central : services/api.js

Toutes les requêtes HTTP passent par ce fichier, pas directement dans les composants. Avantage : un seul endroit à modifier si l'adresse du backend change (par exemple au déploiement).

### registerUser / loginUser

- Utilisent `fetch`, la fonction native du navigateur pour faire des requêtes HTTP.
- `async/await` : `fetch` ne répond pas instantanément, donc on attend la réponse sans bloquer le reste de l'app.
- `response.ok` : contrairement à ce qu'on pourrait croire, `fetch` ne lève pas d'erreur sur un code 400/401. Il faut vérifier `response.ok` soi-même et lever une erreur manuellement.
- `loginUser` envoie un `name: ""` vide, parce que la route `/auth/login` réutilise (temporairement) le schéma `UserCreate`, qui exige ce champ même si le login n'en a pas besoin.s