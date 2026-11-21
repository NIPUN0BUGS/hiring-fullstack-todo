import { z } from 'zod';

// Client-side validation improves feedback; the API independently validates every request.
export const todoDraftSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, 'A task title is required.')
    .max(100, 'Title must be 100 characters or fewer.'),
  description: z
    .string()
    .trim()
    .max(500, 'Description must be 500 characters or fewer.'),
});

export function validateTodoDraft(value) {
  const result = todoDraftSchema.safeParse(value);
  if (!result.success) {
    return {
      success: false,
      message: result.error.issues[0]?.message || 'Please check the task details.',
    };
  }
  return { success: true, data: result.data };
}
