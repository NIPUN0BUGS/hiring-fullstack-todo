import { z } from 'zod';

export const todoIdSchema = z
  .string()
  .regex(/^[0-9a-fA-F]{24}$/, 'The task ID is invalid.');

export const createTodoSchema = z
  .object({
    title: z
      .string({ required_error: 'A task title is required.', invalid_type_error: 'Title must be a string.' })
      .trim()
      .min(1, 'A task title is required.')
      .max(100, 'Title must be 100 characters or fewer.'),
    description: z
      .string({ invalid_type_error: 'Description must be a string.' })
      .trim()
      .max(500, 'Description must be 500 characters or fewer.')
      .optional()
      .default(''),
  })
  .strict();

export const updateTodoSchema = z
  .object({
    title: z
      .string({ invalid_type_error: 'Title must be a string.' })
      .trim()
      .min(1, 'A task title is required.')
      .max(100, 'Title must be 100 characters or fewer.')
      .optional(),
    description: z
      .string({ invalid_type_error: 'Description must be a string.' })
      .trim()
      .max(500, 'Description must be 500 characters or fewer.')
      .optional(),
  })
  .strict()
  .refine((value) => Object.keys(value).length > 0, {
    message: 'Provide a title or description to update.',
    path: ['body'],
  });

export const updateDoneSchema = z
  .object({
    // An empty object means "toggle"; an explicit boolean means "set to this value".
    done: z.boolean({ invalid_type_error: 'The done value must be true or false.' }).optional(),
  })
  .strict();

function formatZodErrors(error) {
  const errors = {};

  for (const issue of error.issues) {
    const field = issue.path[0] ? String(issue.path[0]) : 'body';
    if (!errors[field]) errors[field] = issue.message;
  }

  return errors;
}

export function validateTodoInput(input, { partial = false } = {}) {
  const schema = partial ? updateTodoSchema : createTodoSchema;
  const result = schema.safeParse(input);

  if (!result.success) {
    return { valid: false, errors: formatZodErrors(result.error) };
  }

  return { valid: true, errors: {}, data: result.data };
}
