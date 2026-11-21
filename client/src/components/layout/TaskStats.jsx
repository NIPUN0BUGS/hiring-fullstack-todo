import { Box, Paper, Stack, Typography } from '@mui/material';
import { CheckCircle2, Clock3, ListTodo } from 'lucide-react';

const statDefinitions = [
  { key: 'total', label: 'Total tasks', Icon: ListTodo, color: 'blue' },
  { key: 'remaining', label: 'To do', Icon: Clock3, color: 'amber' },
  { key: 'completed', label: 'Completed', Icon: CheckCircle2, color: 'green' },
];

export default function TaskStats({ stats }) {
  return (
    <Box component="section" className="stats-grid" aria-label="Task summary">
      {statDefinitions.map(({ key, label, Icon, color }) => (
        <Paper key={key} elevation={0} className="stat-card">
          <Box className={`stat-icon stat-icon-${color}`}><Icon size={18} /></Box>
          <Stack spacing={0.25}>
            <Typography component="span" className="stat-label">{label}</Typography>
            <Typography component="strong" className="stat-value">{stats[key]}</Typography>
          </Stack>
        </Paper>
      ))}
    </Box>
  );
}
