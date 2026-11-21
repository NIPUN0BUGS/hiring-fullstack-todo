import { useState } from 'react';
import {
  Box,
  Button,
  Checkbox,
  IconButton,
  Paper,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import { Check, Edit3, LoaderCircle, Save, Trash2, X } from 'lucide-react';
import { todoDraftSchema } from '../../validation.js';
import { formatDate } from '../../utils/formatDate.js';

export default function TaskItem({ todo, isBusy, onToggle, onUpdate, onDelete }) {
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState({
    title: todo.title,
    description: todo.description || '',
  });
  const [fieldErrors, setFieldErrors] = useState({});

  function startEditing() {
    setDraft({ title: todo.title, description: todo.description || '' });
    setFieldErrors({});
    setIsEditing(true);
  }

  function updateField(field, value) {
    setDraft((current) => ({ ...current, [field]: value }));
    setFieldErrors((current) => ({ ...current, [field]: '' }));
  }

  async function saveChanges(event) {
    event.preventDefault();
    const result = todoDraftSchema.safeParse(draft);

    if (!result.success) {
      setFieldErrors({
        title: result.error.issues.find((issue) => issue.path[0] === 'title')?.message,
        description: result.error.issues.find((issue) => issue.path[0] === 'description')?.message,
      });
      return;
    }

    try {
      await onUpdate(todo._id, result.data);
      setIsEditing(false);
    } catch {
      // The page notification explains why the update failed.
    }
  }

  if (isEditing) {
    return (
      <Paper component="form" elevation={0} className="task-row edit-form" onSubmit={saveChanges}>
        <Stack className="edit-fields" spacing={1}>
          <TextField
            autoFocus
            size="small"
            label="Task title"
            value={draft.title}
            onChange={(event) => updateField('title', event.target.value)}
            error={Boolean(fieldErrors.title)}
            helperText={fieldErrors.title}
            inputProps={{ maxLength: 100 }}
            fullWidth
          />
          <TextField
            size="small"
            label="Description (optional)"
            value={draft.description}
            onChange={(event) => updateField('description', event.target.value)}
            error={Boolean(fieldErrors.description)}
            helperText={fieldErrors.description}
            inputProps={{ maxLength: 500 }}
            fullWidth
          />
        </Stack>
        <Stack direction="row" spacing={0.5} className="edit-actions">
          <Tooltip title="Cancel editing">
            <span>
              <IconButton aria-label="Cancel editing" onClick={() => setIsEditing(false)} disabled={isBusy}>
                <X size={17} />
              </IconButton>
            </span>
          </Tooltip>
          <Button type="submit" size="small" variant="contained" startIcon={isBusy ? <LoaderCircle className="spin" size={15} /> : <Save size={15} />} disabled={isBusy}>
            Save
          </Button>
        </Stack>
      </Paper>
    );
  }

  return (
    <Box component="article" className={`task-row ${todo.done ? 'task-row-done' : ''}`}>
      <Checkbox
        checked={todo.done}
        onChange={() => onToggle(todo)}
        disabled={isBusy}
        icon={<span className="todo-checkbox-empty" />}
        checkedIcon={<Check size={15} />}
        inputProps={{ 'aria-label': todo.done ? `Mark ${todo.title} as not done` : `Mark ${todo.title} as done` }}
        className="complete-checkbox"
      />

      <Box className="task-content">
        <Typography component="h3">{todo.title}</Typography>
        {todo.description && <Typography component="p">{todo.description}</Typography>}
        <Typography component="span" className="task-date">
          {todo.done ? 'Completed' : 'Added'} {formatDate(todo.updatedAt || todo.createdAt)}
        </Typography>
      </Box>

      <Stack direction="row" className="task-actions" spacing={0.25}>
        <Tooltip title="Edit task">
          <span>
            <IconButton className="edit-action" aria-label={`Edit ${todo.title}`} onClick={startEditing} disabled={isBusy} size="small">
              {isBusy ? <LoaderCircle className="spin" size={16} /> : <Edit3 size={16} />}
            </IconButton>
          </span>
        </Tooltip>
        <Tooltip title="Delete task">
          <span>
            <IconButton className="delete-action" aria-label={`Delete ${todo.title}`} onClick={() => onDelete(todo)} disabled={isBusy} size="small">
              <Trash2 size={16} />
            </IconButton>
          </span>
        </Tooltip>
      </Stack>
    </Box>
  );
}
