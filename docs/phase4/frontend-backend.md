#Connexion du frontend au backend:

## Objectif
Remplacer les données mock par des vrais appels au back, avec authentification JWT.

## Fichier central : services/api.js

Toutes les requetes HTTP passent par ce fichier, pas directement dans les composants

## registerUser/loginUser

- Utilisent `fetch`, la fonction native du navigateur pour faire des requetes HTTp.
- 'async/await' : 'fetch' ne répond pas instantanément, donc on attend la réponse 
- reponse.ok: fetch ne leve pas une errur, donc il faut faire une erreur manuellement
- loginUser : envoie un name vide, parce que la route 'auth/login 