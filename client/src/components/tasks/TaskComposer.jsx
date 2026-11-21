import { useState } from 'react';
import { Box, Button, Paper, Stack, TextField } from '@mui/material';
import { LoaderCircle, Plus } from 'lucide-react';
import { todoDraftSchema } from '../../validation.js';

const emptyDraft = { title: '', description: '' };

export default function TaskComposer({ onCreate, isCreating }) {
  const [draft, setDraft] = useState(emptyDraft);
  const [fieldErrors, setFieldErrors] = useState({});

  function updateField(field, value) {
    setDraft((current) => ({ ...current, [field]: value }));
    setFieldErrors((current) => ({ ...current, [field]: '' }));
  }

  async function handleSubmit(event) {
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
      await onCreate(result.data);
      setDraft(emptyDraft);
      setFieldErrors({});
    } catch {
      // The page shows the API error in its global notification.
    }
  }

  return (
    <Paper component="form" elevation={0} className="composer" onSubmit={handleSubmit} noValidate>
      <Box className="composer-icon"><Plus size={19} /></Box>
      <Stack className="composer-fields" spacing={0.7}>
        <TextField
          value={draft.title}
          onChange={(event) => updateField('title', event.target.value)}
          placeholder="What needs your attention?"
          aria-label="Task title"
          variant="standard"
          fullWidth
          required
          error={Boolean(fieldErrors.title)}
          helperText={fieldErrors.title}
          slotProps={{
            htmlInput: { maxLength: 100 },
            input: { disableUnderline: true, sx: { fontSize: 14, fontWeight: 700 } },
            formHelperText: { sx: { mt: 0, fontSize: 10 } },
          }}
        />
        <TextField
          value={draft.description}
          onChange={(event) => updateField('description', event.target.value)}
          placeholder="Add a little detail (optional)"
          aria-label="Task description (optional)"
          variant="standard"
          fullWidth
          error={Boolean(fieldErrors.description)}
          helperText={fieldErrors.description}
          slotProps={{
            htmlInput: { maxLength: 500 },
            input: { disableUnderline: true, sx: { fontSize: 11 } },
            formHelperText: { sx: { mt: 0, fontSize: 10 } },
          }}
        />
      </Stack>
      <Button
        className="add-button"
        type="submit"
        variant="contained"
        startIcon={isCreating ? <LoaderCircle className="spin" size={16} /> : <Plus size={16} />}
        disabled={isCreating || !draft.title.trim()}
      >
        {isCreating ? 'Adding' : 'Add task'}
      </Button>
    </Paper>
  );
}
