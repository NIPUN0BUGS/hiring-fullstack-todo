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

## Validation and security

Zod is used at the API boundary. The server validates every create, update, completion, and ID input independently of the browser. Schemas trim strings, enforce the 100-character title and 500-character description limits, require boolean completion values, and reject unknown keys (`.strict()`). This prevents mass assignment of fields such as `_id`, `done`, timestamps, and MongoDB metadata through the title/description endpoints. Mongoose schema validation remains enabled as a second layer.

The API also applies:

- Helmet security headers and disables the `X-Powered-By` header.
- An explicit CORS origin allowlist. In production, set `CLIENT_ORIGIN` to the exact frontend origin(s), comma-separated.
- A rate limit of 120 requests per IP per 15 minutes on `/api`.
- A 10 KB JSON request-body limit and structured handling for malformed/oversized JSON.
- Strict 24-character hexadecimal validation for MongoDB ObjectId route parameters.
- Safe production error messages that do not expose stack traces or internal exception details.

The React client also uses Zod for immediate form feedback, but client-side checks are not a security boundary; server validation is authoritative. CORS controls which browser origins can read API responses, but it is not authentication and does not prevent direct non-browser requests.

Invalid input returns HTTP 400, disallowed browser origins return HTTP 403, oversized request bodies return HTTP 413, rate-limited clients return HTTP 429, unknown task IDs return HTTP 404, and unexpected errors return HTTP 500 with a safe production message.

## Tests

```bash
npm test --prefix server
```

The included Node.js tests cover Zod request validation, strict unknown-key rejection, completion values, and ObjectId format validation. API integration tests require a running MongoDB instance.

## Assumptions and limitations

- There is no authentication or per-user task ownership in this assignment. Do not expose this demo as a multi-user production task service without adding authentication and authorization.
- The in-memory rate limiter is suitable for a single API instance; use a shared store (for example Redis) when running multiple instances.
- MongoDB must be available before the API starts. The application deliberately does not silently fall back to in-memory storage.
