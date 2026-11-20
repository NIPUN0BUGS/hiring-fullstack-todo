const TITLE_MAX_LENGTH = 100;
const DESCRIPTION_MAX_LENGTH = 500;

export function validateTodoInput(input, { partial = false } = {}) {
  const errors = {};

  if (!input || typeof input !== 'object' || Array.isArray(input)) {
    return { valid: false, errors: { body: 'Request body must be a JSON object.' } };
  }

  if (partial && !Object.hasOwn(input, 'title') && !Object.hasOwn(input, 'description')) {
    errors.body = 'Provide a title or description to update.';
  }

  if (!partial || Object.hasOwn(input, 'title')) {
    if (typeof input.title !== 'string' || !input.title.trim()) {
      errors.title = 'A task title is required.';
    } else if (input.title.trim().length > TITLE_MAX_LENGTH) {
      errors.title = `Title must be ${TITLE_MAX_LENGTH} characters or fewer.`;
    }
  }

  if (Object.hasOwn(input, 'description')) {
    if (typeof input.description !== 'string') {
      errors.description = 'Description must be a string.';
    } else if (input.description.trim().length > DESCRIPTION_MAX_LENGTH) {
      errors.description = `Description must be ${DESCRIPTION_MAX_LENGTH} characters or fewer.`;
    }
  }

  return { valid: Object.keys(errors).length === 0, errors };
}
