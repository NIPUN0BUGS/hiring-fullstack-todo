import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  ArrowDownWideNarrow,
  Check,
  CheckCheck,
  CheckCircle2,
  Circle,
  ClipboardList,
  Clock3,
  Edit3,
  ListTodo,
  LoaderCircle,
  Plus,
  RotateCcw,
  Sparkles,
  Trash2,
  X,
} from 'lucide-react';
import { todosApi } from './api.js';

const FILTERS = [
  { id: 'all', label: 'All tasks' },
  { id: 'active', label: 'In progress' },
  { id: 'completed', label: 'Completed' },
];

function formatDate(value) {
  if (!value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  return new Intl.DateTimeFormat(undefined, {
    month: 'short',
    day: 'numeric',
  }).format(date);
}

function App() {
  const [todos, setTodos] = useState([]);
  const [filter, setFilter] = useState('all');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [busyId, setBusyId] = useState(null);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');

  const loadTodos = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const data = await todosApi.getAll();
      setTodos(Array.isArray(data) ? data : []);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadTodos();
  }, [loadTodos]);

  const stats = useMemo(() => {
    const completed = todos.filter((todo) => todo.done).length;
    const total = todos.length;
    return {
      total,
      completed,
      remaining: total - completed,
      progress: total ? Math.round((completed / total) * 100) : 0,
    };
  }, [todos]);

  const visibleTodos = useMemo(() => {
    if (filter === 'active') return todos.filter((todo) => !todo.done);
    if (filter === 'completed') return todos.filter((todo) => todo.done);
    return todos;
  }, [todos, filter]);

  async function handleCreate(event) {
    event.preventDefault();
    const cleanTitle = title.trim();
    if (!cleanTitle) {
      setError('Please enter a task title.');
      return;
    }

    setCreating(true);
    setError('');
    setNotice('');
    try {
      const created = await todosApi.create({
        title: cleanTitle,
        description: description.trim(),
      });
      setTodos((current) => [created, ...current]);
      setTitle('');
      setDescription('');
      setNotice('Task added to your list.');
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setCreating(false);
    }
  }

  function beginEdit(todo) {
    setEditingId(todo._id);
    setEditTitle(todo.title);
    setEditDescription(todo.description || '');
    setError('');
    setNotice('');
  }

  function cancelEdit() {
    setEditingId(null);
    setEditTitle('');
    setEditDescription('');
  }

  async function saveEdit(id) {
    const cleanTitle = editTitle.trim();
    if (!cleanTitle) {
      setError('A task title cannot be empty.');
      return;
    }

    setBusyId(id);
    setError('');
    try {
      const updated = await todosApi.update(id, {
        title: cleanTitle,
        description: editDescription.trim(),
      });
      setTodos((current) => current.map((todo) => (todo._id === id ? updated : todo)));
      cancelEdit();
      setNotice('Your changes have been saved.');
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setBusyId(null);
    }
  }

  async function toggleDone(todo) {
    setBusyId(todo._id);
    setError('');
    setNotice('');

    // Optimistic update keeps the UI responsive; restore the previous state on failure.
    setTodos((current) => current.map((item) => (
      item._id === todo._id ? { ...item, done: !todo.done } : item
    )));

    try {
      const updated = await todosApi.setDone(todo._id, !todo.done);
      setTodos((current) => current.map((item) => (item._id === todo._id ? updated : item)));
    } catch (requestError) {
      setTodos((current) => current.map((item) => (
        item._id === todo._id ? { ...item, done: todo.done } : item
      )));
      setError(requestError.message);
    } finally {
      setBusyId(null);
    }
  }

  async function deleteTodo(todo) {
    const previousTodos = todos;
    setBusyId(todo._id);
    setError('');
    setNotice('');
    setTodos((current) => current.filter((item) => item._id !== todo._id));

    try {
      await todosApi.remove(todo._id);
      if (editingId === todo._id) cancelEdit();
      setNotice('Task deleted.');
    } catch (requestError) {
      setTodos(previousTodos);
      setError(requestError.message);
    } finally {
      setBusyId(null);
    }
  }

  return (
    <main className="page-shell">
      <header className="topbar">
        <a className="brand" href="#top" aria-label="Daymark home">
          <span className="brand-mark"><CheckCheck size={19} strokeWidth={2.5} /></span>
          <span>daymark<span className="brand-dot">.</span></span>
        </a>
        <div className="topbar-note"><span className="status-dot" /> Your personal task space</div>
      </header>

      <section className="hero" id="top">
        <div className="hero-copy">
          <div className="eyebrow"><Sparkles size={14} /> A LITTLE MORE FOCUS</div>
          <h1>Make room for<br /><span>what matters.</span></h1>
          <p>One clear list. A calmer mind. Keep moving, one task at a time.</p>
        </div>
        <div className="hero-progress" aria-label={`${stats.progress}% of tasks completed`}>
          <div className="progress-orbit">
            <svg viewBox="0 0 120 120" role="img" aria-label={`${stats.progress} percent complete`}>
              <circle className="progress-track" cx="60" cy="60" r="49" />
              <circle
                className="progress-value"
                cx="60" cy="60" r="49"
                strokeDasharray={`${(stats.progress / 100) * 307.9} 307.9`}
              />
            </svg>
            <div className="progress-center">
              <strong>{stats.progress}%</strong>
              <span>completed</span>
            </div>
          </div>
          <span className="progress-caption">Every step counts</span>
        </div>
        <div className="hero-decoration hero-decoration-one" />
        <div className="hero-decoration hero-decoration-two" />
      </section>

      <section className="stats-grid" aria-label="Task summary">
        <article className="stat-card">
          <span className="stat-icon stat-icon-blue"><ListTodo size={18} /></span>
          <div><span className="stat-label">Total tasks</span><strong>{stats.total}</strong></div>
        </article>
        <article className="stat-card">
          <span className="stat-icon stat-icon-amber"><Clock3 size={18} /></span>
          <div><span className="stat-label">To do</span><strong>{stats.remaining}</strong></div>
        </article>
        <article className="stat-card">
          <span className="stat-icon stat-icon-green"><CheckCircle2 size={18} /></span>
          <div><span className="stat-label">Completed</span><strong>{stats.completed}</strong></div>
        </article>
      </section>

      <section className="workspace">
        <div className="section-heading">
          <div>
            <span className="section-kicker">YOUR WORKSPACE</span>
            <h2>Today's focus</h2>
          </div>
          <span className="task-count"><ClipboardList size={15} /> {stats.total} {stats.total === 1 ? 'task' : 'tasks'}</span>
        </div>

        <form className="composer" onSubmit={handleCreate}>
          <div className="composer-icon"><Plus size={19} /></div>
          <div className="composer-fields">
            <label className="sr-only" htmlFor="new-title">Task title</label>
            <input
              id="new-title"
              className="title-input"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder="What needs your attention?"
              maxLength={100}
              required
            />
            <label className="sr-only" htmlFor="new-description">Description (optional)</label>
            <input
              id="new-description"
              className="description-input"
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              placeholder="Add a little detail (optional)"
              maxLength={500}
            />
          </div>
          <button className="add-button" type="submit" disabled={creating || !title.trim()}>
            {creating ? <LoaderCircle className="spin" size={17} /> : <Plus size={17} />}
            <span>{creating ? 'Adding' : 'Add task'}</span>
          </button>
        </form>

        {(error || notice) && (
          <div className={`feedback ${error ? 'feedback-error' : 'feedback-success'}`} role="status">
            <span>{error || notice}</span>
            {error && <button type="button" className="feedback-action" onClick={loadTodos} aria-label="Reload tasks"><RotateCcw size={15} /> Retry</button>}
            <button type="button" className="feedback-close" onClick={() => { setError(''); setNotice(''); }} aria-label="Dismiss message"><X size={15} /></button>
          </div>
        )}

        <div className="list-toolbar">
          <div className="filter-tabs" role="tablist" aria-label="Filter tasks">
            {FILTERS.map((item) => (
              <button
                key={item.id}
                type="button"
                role="tab"
                aria-selected={filter === item.id}
                className={`filter-tab ${filter === item.id ? 'filter-tab-active' : ''}`}
                onClick={() => setFilter(item.id)}
              >
                {item.label}
                <span className="filter-number">
                  {item.id === 'all' ? stats.total : item.id === 'active' ? stats.remaining : stats.completed}
                </span>
              </button>
            ))}
          </div>
          <span className="sort-label"><ArrowDownWideNarrow size={14} /> Newest first</span>
        </div>

        <div className="task-list" aria-live="polite">
          {loading ? (
            <div className="state-panel">
              <LoaderCircle className="spin state-spinner" size={25} />
              <strong>Getting your tasks</strong>
              <span>Just a moment…</span>
            </div>
          ) : visibleTodos.length === 0 ? (
            <div className="state-panel empty-state">
              <div className="empty-icon"><Check size={25} /></div>
              <strong>{filter === 'completed' ? 'Nothing completed just yet' : filter === 'active' ? 'You’re all caught up' : 'A fresh start'}</strong>
              <span>{filter === 'completed' ? 'Completed tasks will show up here.' : filter === 'active' ? 'There are no open tasks on your list.' : 'Add your first task above and make today count.'}</span>
            </div>
          ) : (
            visibleTodos.map((todo) => {
              const isEditing = editingId === todo._id;
              const isBusy = busyId === todo._id;
              return (
                <article className={`task-row ${todo.done ? 'task-row-done' : ''}`} key={todo._id}>
                  {isEditing ? (
                    <div className="edit-form">
                      <div className="edit-fields">
                        <label className="sr-only" htmlFor={`edit-title-${todo._id}`}>Edit task title</label>
                        <input
                          id={`edit-title-${todo._id}`}
                          className="edit-title"
                          value={editTitle}
                          onChange={(event) => setEditTitle(event.target.value)}
                          maxLength={100}
                          autoFocus
                        />
                        <label className="sr-only" htmlFor={`edit-description-${todo._id}`}>Edit task description</label>
                        <input
                          id={`edit-description-${todo._id}`}
                          className="edit-description"
                          value={editDescription}
                          onChange={(event) => setEditDescription(event.target.value)}
                          placeholder="Add a description (optional)"
                          maxLength={500}
                        />
                      </div>
                      <div className="edit-actions">
                        <button type="button" className="icon-button" onClick={cancelEdit} aria-label="Cancel edit"><X size={16} /></button>
                        <button type="button" className="save-button" onClick={() => saveEdit(todo._id)} disabled={isBusy}>
                          {isBusy ? <LoaderCircle className="spin" size={15} /> : <Check size={15} />} Save
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <button
                        type="button"
                        className={`complete-button ${todo.done ? 'complete-button-checked' : ''}`}
                        onClick={() => toggleDone(todo)}
                        disabled={isBusy}
                        aria-label={todo.done ? `Mark ${todo.title} as not done` : `Mark ${todo.title} as done`}
                        aria-pressed={todo.done}
                      >
                        {isBusy ? <LoaderCircle className="spin" size={16} /> : todo.done ? <Check size={15} /> : <Circle size={20} />}
                      </button>
                      <div className="task-content">
                        <h3>{todo.title}</h3>
                        {todo.description && <p>{todo.description}</p>}
                        <span className="task-date">{todo.done ? 'Completed' : 'Added'} {formatDate(todo.updatedAt || todo.createdAt)}</span>
                      </div>
                      <div className="task-actions">
                        <button type="button" className="icon-button edit-action" onClick={() => beginEdit(todo)} aria-label={`Edit ${todo.title}`} disabled={isBusy}>
                          <Edit3 size={16} />
                        </button>
                        <button type="button" className="icon-button delete-action" onClick={() => deleteTodo(todo)} aria-label={`Delete ${todo.title}`} disabled={isBusy}>
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </>
                  )}
                </article>
              );
            })
          )}
        </div>

        <footer className="list-footer">
          <span><span className="footer-check"><Check size={11} /></span> Small steps add up.</span>
          <span>{stats.remaining} {stats.remaining === 1 ? 'task' : 'tasks'} left to do</span>
        </footer>
      </section>

      <footer className="page-footer">
        <span>DAYMARK <span className="brand-dot">·</span> KEEP YOUR DAY IN VIEW</span>
        <span>Made for a more focused day</span>
      </footer>
    </main>
  );
}

export default App;
