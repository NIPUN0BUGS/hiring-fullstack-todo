import { Box, CircularProgress, Stack, Typography } from '@mui/material';
import { Check } from 'lucide-react';
import TaskItem from './TaskItem.jsx';

const emptyMessages = {
  all: { title: 'A fresh start', description: 'Add your first task above and make today count.' },
  active: { title: 'You’re all caught up', description: 'There are no open tasks on your list.' },
  completed: { title: 'Nothing completed just yet', description: 'Completed tasks will show up here.' },
};

export default function TaskList({
  todos,
  filter,
  isLoading,
  onToggle,
  onUpdate,
  onDelete,
  isTodoBusy,
}) {
  if (isLoading) {
    return (
      <Stack className="state-panel" alignItems="center" justifyContent="center" spacing={1}>
        <CircularProgress size={25} />
        <Typography component="strong">Getting your tasks</Typography>
        <Typography component="span">Just a moment…</Typography>
      </Stack>
    );
  }

  if (todos.length === 0) {
    const message = emptyMessages[filter];

    return (
      <Stack className="state-panel empty-state" alignItems="center" justifyContent="center" spacing={1}>
        <Box className="empty-icon"><Check size={25} /></Box>
        <Typography component="strong">{message.title}</Typography>
        <Typography component="span">{message.description}</Typography>
      </Stack>
    );
  }

  return (
    <Box className="task-list" aria-live="polite">
      {todos.map((todo) => (
        <TaskItem
          key={todo._id}
          todo={todo}
          isBusy={isTodoBusy(todo._id)}
          onToggle={onToggle}
          onUpdate={onUpdate}
          onDelete={onDelete}
        />
      ))}
    </Box>
  );
}
