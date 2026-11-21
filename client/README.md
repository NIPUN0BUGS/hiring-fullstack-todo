# Daymark — Frontend

React 18 + Vite frontend for the Daymark TODO app. The UI uses Material UI (MUI), server state is managed by TanStack Query, and form input is validated with Zod.

## Requirements

- Node.js 20.19+ or 22.12+
- The Express API running on `http://localhost:5000`

## Setup

From the project root:

```bash
npm install
npm --prefix server install
npm --prefix client install
```

Start the full application:

```bash
npm run dev
```

Open <http://localhost:5173>.

Vite proxies `/api` requests to `http://localhost:5000`. To use a different API URL, create `client/.env` and set:

```env
VITE_API_URL=http://localhost:5000
```

## Frontend structure

```text
client/src/
├── app/
│   ├── queryClient.js       # TanStack Query cache and default behavior
│   └── theme.js             # Material UI theme
├── components/
│   ├── layout/
│   │   ├── HeroSection.jsx  # Intro banner and completion progress
│   │   ├── TaskStats.jsx    # Total, remaining and completed counts
│   │   └── TopBar.jsx       # Brand and header
│   └── tasks/
│       ├── TaskComposer.jsx # Create task form + Zod validation
│       ├── TaskFeedback.jsx # API load error and retry action
│       ├── TaskFilters.jsx  # All / active / completed filters
│       ├── TaskItem.jsx     # Display, edit, complete and delete one task
│       ├── TaskList.jsx     # Loading, empty and populated list states
│       └── TodoWorkspace.jsx# Composes the task management area
├── hooks/
│   └── useTodos.js          # TanStack Query read and mutation operations
├── utils/
│   └── formatDate.js        # Date display helper
├── App.jsx                  # Page composition and local UI state
├── api.js                   # HTTP requests to the Express API
├── main.jsx                 # React, MUI and Query providers
├── styles.css               # Responsive page/layout styling
└── validation.js            # Shared client-side Zod schema
```

## Responsibilities

- **Material UI:** buttons, inputs, tabs, alerts, checkboxes, progress indicators, tooltips, layout primitives and theme. The project pins MUI 9.5 with React 18.3.1.
- **React 18 compatibility:** `react-is` is pinned and overridden to `18.3.1`, following MUI's installation guidance for React 18 projects.
- **TanStack Query:** fetching, caching, loading/error states, mutation lifecycle, cache invalidation and optimistic completion/deletion updates with rollback.
- **Zod:** validates task titles (required, up to 100 characters) and descriptions (optional, up to 500 characters) before sending data to the API. The backend validates requests independently.
- **App.jsx:** connects the feature components and keeps only page-level filter and notification state.

### How a task request flows through the app

1. `TaskComposer` or `TaskItem` collects form values and validates them with the shared Zod schema.
2. The component calls a callback passed down from `App.jsx`.
3. `App.jsx` calls the matching action from `useTodos`.
4. `useTodos` runs the TanStack Query mutation, which calls the matching function in `api.js`.
5. After the server responds, TanStack Query updates or invalidates the `['todos']` cache so the UI stays in sync.
6. Completion and deletion use optimistic cache updates; the previous list is restored if the request fails.

This keeps UI components focused on rendering and user interaction while the hook owns server communication and cache behavior.

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
