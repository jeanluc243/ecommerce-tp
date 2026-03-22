# ecommerce-tp

Projet Vite + React pour le front et Express + Prisma pour l'API.

## Lancer en local

Frontend :

```bash
npm run dev
```

Backend :

```bash
npm run server
```

En local, Vite proxy automatiquement `/api` vers `http://localhost:3001`.

Le frontend utilise `VITE_API_URL` si elle est définie. Sinon, il appelle `/api`.

## Deployer sur Vercel

Le projet est configuré pour un seul deploy Vercel avec :

- le frontend servi depuis `dist`
- l'API Express exposée via `api/index.js`
- le même domaine pour le front et le back via `/api/*`
- une seule variable critique côté serveur : `DATABASE_URL`

### Étapes

1. Pousser le projet sur GitHub.
2. Importer le repo dans Vercel.
3. Dans `Settings > Environment Variables`, ajouter `DATABASE_URL`.
4. Ne pas renseigner `VITE_API_URL` en production si tu veux garder les appels en relatif sur `/api`.
5. Déployer.
6. Appliquer les migrations Prisma sur la base PostgreSQL avant le premier usage réel.

### Important pour `.env`

- Le fichier `.env` local ne part pas automatiquement sur Vercel.
- Sur Vercel, il faut recopier les variables dans l'interface du projet.
- Ne commit pas `.env` dans le repo.

### Variables d'environnement

- `DATABASE_URL` : URL PostgreSQL utilisée par Prisma
- `VITE_API_URL` : optionnelle. En production sur Vercel, laisse-la vide pour utiliser `/api`.

### Prisma

Avant le premier vrai usage, applique tes migrations sur ta base PostgreSQL :

```bash
npx prisma migrate deploy
```

Tu peux le faire depuis ton poste avec la même `DATABASE_URL`, ou via un job CI/CD.

Exemple depuis ton poste :

```bash
DATABASE_URL="..." npx prisma migrate deploy
```

## Important

Vercel ne fournit pas un serveur Node unique toujours actif. Ici, tu obtiens un seul projet et un seul domaine, mais le backend tourne en fonction serverless. Si tu veux un vrai serveur Node unique, regarde plutôt Railway, Render ou Fly.io.
