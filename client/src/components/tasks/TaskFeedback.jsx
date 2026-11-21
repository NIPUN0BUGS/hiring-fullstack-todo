import { Alert, Button, Stack } from '@mui/material';
import { RotateCcw } from 'lucide-react';

export default function TaskFeedback({ error, onRetry }) {
  if (!error) return null;

  return (
    <Alert
      severity="error"
      className="query-error"
      action={(
        <Button color="inherit" size="small" onClick={() => onRetry()} startIcon={<RotateCcw size={14} />}>
          Retry
        </Button>
      )}
    >
      <Stack spacing={0.25}>
        <strong>Could not load your tasks.</strong>
        <span>{error.message || 'Please check your connection and try again.'}</span>
      </Stack>
    </Alert>
  );
}
