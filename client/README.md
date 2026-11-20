# Daymark — Frontend

React 18 + Vite interface for the Daymark TODO app.

## Requirements

- Node.js 20.19+ or 22.12+
- The Express API running on `http://localhost:5000`

## Setup

From the project root:

```bash
npm install
npm --prefix client install
```

Run the client:

```bash
npm --prefix client run dev
```

Open <http://localhost:5173>.

Vite proxies `/api` requests to `http://localhost:5000`. To use a different API URL, create `client/.env` and set:

```env
VITE_API_URL=http://localhost:5000
```

If you change the proxy target rather than using `VITE_API_URL`, set `VITE_API_PROXY_TARGET` in the shell before starting Vite.

## Features

- View all TODO items and filter by all, in-progress, or completed.
- Create tasks with a required title and optional description.
- Edit a task's title and description.
- Mark tasks as done or not done.
- Delete tasks.
- Loading, empty, success, and error states.
- Responsive layout and reduced-motion support.

## Assumptions and limitations

- No user accounts or authentication are included because they are outside the assignment scope.
- Task ordering is newest first.
- Titles are limited to 100 characters and descriptions to 500 characters. The API enforces the same limits.
- Data is stored by the backend in MongoDB; the browser does not use local storage as a substitute for persistence.
