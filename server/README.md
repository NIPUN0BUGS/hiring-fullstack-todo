# Daymark — Backend

Express REST API with MongoDB persistence using Mongoose.

## Requirements

- Node.js 20.19+ or 22.12+
- MongoDB Community Server running locally, or a MongoDB Atlas cluster

## Setup

From the project root:

```bash
npm --prefix server install
```

Copy the environment template and configure the connection string (PowerShell: `Copy-Item server/.env.example server/.env`; macOS/Linux: `cp server/.env.example server/.env`):

```bash
cp server/.env.example server/.env
```

Example local configuration:

```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://127.0.0.1:27017/daymark_todos
CLIENT_ORIGIN=http://localhost:5173
```

For MongoDB Atlas, replace `MONGODB_URI` with the connection string from your Atlas cluster. URL-encode any special characters in the database username or password. Do not commit `.env`.

Start the API:

```bash
npm --prefix server run dev
```

The API starts at <http://localhost:5000>. Health check: <http://localhost:5000/api/health>.

## REST API

All successful responses use `{ "success": true, "data": ... }`. Errors use `{ "success": false, "message": "...", "errors": ... }` where field details are relevant.

| Method | Endpoint | Description | Request body |
| --- | --- | --- | --- |
| GET | `/api/todos` | Return all tasks, newest first | — |
| POST | `/api/todos` | Create a task | `{ "title": "...", "description": "..." }` |
| PUT | `/api/todos/:id` | Update title and/or description | `{ "title": "..." }`, `{ "description": "..." }`, or both |
| PATCH | `/api/todos/:id/done` | Toggle completion, or set it explicitly | `{ "done": true }` or no body to toggle |
| DELETE | `/api/todos/:id` | Delete a task | — |

### Data model

```json
{
  "_id": "MongoDB ObjectId",
  "title": "string",
  "description": "string (optional; stored as an empty string when omitted)",
  "done": false,
  "createdAt": "timestamp",
  "updatedAt": "timestamp"
}
```

Mongoose timestamps provide `createdAt` and `updatedAt`. MongoDB generates `_id`.

## Validation and error handling

- Title is required, trimmed, and limited to 100 characters.
- Description is optional, trimmed, and limited to 500 characters.
- Invalid MongoDB IDs return HTTP 400.
- Unknown task IDs return HTTP 404.
- Invalid JSON returns HTTP 400.
- Unexpected errors return HTTP 500 with a safe production message.

## Tests

```bash
npm test --prefix server
```

The included Node.js tests cover request validation. API integration tests require a running MongoDB instance and are not included in this starter submission.

## Assumptions and limitations

- There is no authentication or per-user task ownership in this assignment.
- MongoDB must be available before the API starts. The application deliberately does not silently fall back to in-memory storage.
