# Daymark — Full-stack TODO App

A full-stack task manager built for the hiring assignment using **React + Vite**, **Material UI**, **TanStack Query**, **Zod**, **Node.js + Express**, and **MongoDB + Mongoose**.

## What's included

- View all tasks.
- Create tasks with a title and optional description.
- Edit task titles and descriptions.
- Mark tasks as done / not done.
- Delete tasks.
- Filter all, in-progress, and completed tasks.
- MongoDB persistence, server-side Zod request validation, client-side form validation, loading and error handling.
- Security headers, strict CORS allowlisting, API rate limiting, request-size limits, and mass-assignment protection.
- Responsive interface with accessible labels and reduced-motion support.

## Project structure

```text
hiring-fullstack-todo/
├── client/                 # React + Vite + MUI frontend
│   ├── src/
│   │   ├── app/             # MUI theme and TanStack Query client
│   │   ├── components/      # Small layout and task components
│   │   ├── hooks/           # TanStack Query hooks
│   │   ├── utils/           # UI helpers
│   │   ├── api.js           # HTTP client
│   │   ├── App.jsx          # Page composition
│   │   ├── main.jsx         # Application providers
│   │   ├── styles.css
│   │   └── validation.js    # Client-side Zod schemas
│   └── README.md
├── server/                 # Express + Mongoose backend
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── utils/
│   │   ├── app.js
│   │   └── server.js
│   ├── tests/
│   └── README.md
├── .gitignore
├── package.json
└── README.md
```

## Prerequisites

- Node.js 20.19+ or 22.12+
- npm
- MongoDB Community Server, or a MongoDB Atlas database

## Quick start

1. Install root and app dependencies:

   ```bash
   npm run install:all
   ```

2. Configure the backend environment:

   ```bash
   cp server/.env.example server/.env
   ```

   Set `MONGODB_URI` to your local MongoDB URL or MongoDB Atlas connection string. On Windows PowerShell, use `Copy-Item server/.env.example server/.env` instead of `cp`.

3. Start MongoDB (for a local installation), then run both applications:

   ```bash
   npm run dev
   ```

4. Open the frontend at <http://localhost:5173>. The API runs at <http://localhost:5000>.

Run the frontend production build with `npm run build` and backend validation tests with `npm test`.

For separate setup details, API documentation, database notes, assumptions, and limitations, see [`client/README.md`](client/README.md) and [`server/README.md`](server/README.md).

## Security and validation

The API is the source of truth for validation. Zod schemas enforce allowed fields, trim and constrain user input, validate completion booleans and MongoDB IDs, and reject unexpected properties. The server also uses Helmet, a production CORS allowlist (`CLIENT_ORIGIN`), a 120-requests-per-15-minute API rate limit, and a 10 KB JSON body limit. The client uses Zod for responsive form feedback, but client checks are not a replacement for server validation. See [`server/README.md`](server/README.md) for configuration and limitations.

## API overview

| Method | Endpoint | Description |
| --- | --- | --- |
| GET | `/api/todos` | Get all TODO items |
| POST | `/api/todos` | Create a TODO item |
| PUT | `/api/todos/:id` | Update title and/or description |
| PATCH | `/api/todos/:id/done` | Toggle / set done status |
| DELETE | `/api/todos/:id` | Delete a TODO item |

## Git and submission workflow

This project is organized with the assignment's requested branch flow:

- `main` contains the initial repository README.
- `develop` contains the full TODO application and its documentation.

To publish this prepared repository to your GitHub account:

1. Create a **public, empty** repository named `hiring-fullstack-todo` at <https://github.com/new>. Do not initialize it with a README, `.gitignore`, or license because this local repository already has Git history.
2. From the extracted project folder, connect the new remote and push both branches:

   ```bash
   git remote add origin https://github.com/NIPUN0BUGS/hiring-fullstack-todo.git
   git push -u origin main
   git push -u origin develop
   ```

3. On GitHub, open a pull request with **base: `main`** and **compare: `develop`**.
4. In the PR description, include:
   - A summary of the features implemented.
   - The rationale for the stack and architecture decisions.
   - A short demo video of the working platform.
   - A five-minute code walkthrough explaining the frontend, API, database model, and request flow.
5. Complete the submission form provided in the recruitment email.

Do not commit secrets, `.env` files, database credentials, or private connection strings. The brief warns that extensive AI-generated code may disqualify submissions; review and understand every file, adapt the implementation yourself, and make sure you can explain and take responsibility for the final code before submitting.

## Implementation decisions

- MongoDB + Mongoose was selected because it is explicitly encouraged in the brief and maps cleanly to the requested document model.
- The API is split into routes, controllers, model, Zod validation schemas, and error middleware to keep each responsibility focused.
- Security controls are applied at the Express boundary; user-provided keys are allowlisted through strict Zod schemas before reaching Mongoose.
- The completion endpoint accepts `{ "done": boolean }` for predictable client updates, but it also toggles when called without a body, matching the assignment wording.
- The frontend uses Material UI for reusable accessible controls and a consistent theme.
- TanStack Query handles server-state fetching, caching, loading/error states, cache invalidation, and optimistic completion/deletion updates with rollback.
- App.jsx composes focused components; task forms validate with Zod before making API calls.
- No login, user roles, or deployment configuration was added because those are not requested by the brief.
