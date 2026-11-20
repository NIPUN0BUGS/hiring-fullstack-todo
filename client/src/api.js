const API_BASE_URL = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '');

async function request(path, options = {}) {
  let response;

  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      ...options,
      headers: {
        ...(options.body ? { 'Content-Type': 'application/json' } : {}),
        ...options.headers,
      },
    });
  } catch {
    throw new Error('Could not connect to the server. Check that the backend is running.');
  }

  const payload = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(payload?.message || `Request failed (${response.status}). Please try again.`);
  }

  return payload?.data;
}

export const todosApi = {
  getAll: () => request('/api/todos'),
  create: (todo) => request('/api/todos', {
    method: 'POST',
    body: JSON.stringify(todo),
  }),
  update: (id, todo) => request(`/api/todos/${id}`, {
    method: 'PUT',
    body: JSON.stringify(todo),
  }),
  setDone: (id, done) => request(`/api/todos/${id}/done`, {
    method: 'PATCH',
    body: JSON.stringify({ done }),
  }),
  remove: (id) => request(`/api/todos/${id}`, { method: 'DELETE' }),
};
