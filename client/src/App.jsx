import { useMemo, useState } from 'react';
import { Alert, Box, Snackbar } from '@mui/material';
import TopBar from './components/layout/TopBar.jsx';
import HeroSection from './components/layout/HeroSection.jsx';
import TaskStats from './components/layout/TaskStats.jsx';
import TodoWorkspace from './components/tasks/TodoWorkspace.jsx';
import { useTodos } from './hooks/useTodos.js';

function App() {
  const [filter, setFilter] = useState('all');
  const [notification, setNotification] = useState({ open: false, message: '', severity: 'success' });

  const {
    todos,
    isLoading,
    isError,
    error,
    refetch,
    createTodo,
    updateTodo,
    setTodoDone,
    deleteTodo,
    isCreating,
    isTodoBusy,
  } = useTodos();

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

  function showNotification(message, severity = 'success') {
    setNotification({ open: true, message, severity });
  }

  async function handleCreate(draft) {
    try {
      await createTodo(draft);
      showNotification('Task added to your list.');
    } catch (requestError) {
      showNotification(requestError.message, 'error');
      throw requestError;
    }
  }

  async function handleUpdate(id, changes) {
    try {
      await updateTodo({ id, changes });
      showNotification('Your changes have been saved.');
    } catch (requestError) {
      showNotification(requestError.message, 'error');
      throw requestError;
    }
  }

  async function handleToggle(todo) {
    try {
      await setTodoDone({ id: todo._id, done: !todo.done });
    } catch (requestError) {
      showNotification(requestError.message, 'error');
    }
  }

  async function handleDelete(todo) {
    try {
      await deleteTodo(todo._id);
      showNotification('Task deleted.');
    } catch (requestError) {
      showNotification(requestError.message, 'error');
    }
  }

  return (
    <Box component="main" className="page-shell">
      <TopBar />
      <HeroSection progress={stats.progress} />
      <TaskStats stats={stats} />

      <TodoWorkspace
        stats={stats}
        filter={filter}
        onFilterChange={setFilter}
        todos={visibleTodos}
        isLoading={isLoading}
        error={isError ? error : null}
        onRetry={refetch}
        onCreate={handleCreate}
        isCreating={isCreating}
        onToggle={handleToggle}
        onUpdate={handleUpdate}
        onDelete={handleDelete}
        isTodoBusy={isTodoBusy}
      />

      <Box component="footer" className="page-footer">
        <span>DAYMARK <span className="brand-dot">·</span> KEEP YOUR DAY IN VIEW</span>
        <span>Made for a more focused day</span>
      </Box>

      <Snackbar
        open={notification.open}
        autoHideDuration={3500}
        onClose={() => setNotification((current) => ({ ...current, open: false }))}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setNotification((current) => ({ ...current, open: false }))}
          severity={notification.severity}
          variant="filled"
          sx={{ width: '100%' }}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default App;
