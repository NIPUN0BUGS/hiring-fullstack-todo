import { Box, Paper, Stack, Typography } from '@mui/material';
import { ClipboardList, Check } from 'lucide-react';
import TaskComposer from './TaskComposer.jsx';
import TaskFeedback from './TaskFeedback.jsx';
import TaskFilters from './TaskFilters.jsx';
import TaskList from './TaskList.jsx';

export default function TodoWorkspace({
  stats,
  filter,
  onFilterChange,
  todos,
  isLoading,
  error,
  onRetry,
  onCreate,
  isCreating,
  onToggle,
  onUpdate,
  onDelete,
  isTodoBusy,
}) {
  return (
    <Paper component="section" elevation={0} className="workspace">
      <Stack direction="row" alignItems="flex-end" justifyContent="space-between" className="section-heading">
        <Box>
          <Typography component="span" className="section-kicker">YOUR WORKSPACE</Typography>
          <Typography component="h2">Today’s focus</Typography>
        </Box>
        <Typography component="span" className="task-count">
          <ClipboardList size={15} /> {stats.total} {stats.total === 1 ? 'task' : 'tasks'}
        </Typography>
      </Stack>

      <TaskComposer onCreate={onCreate} isCreating={isCreating} />
      <TaskFeedback error={error} onRetry={onRetry} />
      <TaskFilters value={filter} onChange={onFilterChange} stats={stats} />

      <TaskList
        todos={todos}
        filter={filter}
        isLoading={isLoading}
        onToggle={onToggle}
        onUpdate={onUpdate}
        onDelete={onDelete}
        isTodoBusy={isTodoBusy}
      />

      <Box component="footer" className="list-footer">
        <Typography component="span"><span className="footer-check"><Check size={11} /></span> Small steps add up.</Typography>
        <Typography component="span">{stats.remaining} {stats.remaining === 1 ? 'task' : 'tasks'} left to do</Typography>
      </Box>
    </Paper>
  );
}
