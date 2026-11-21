import test from 'node:test';
import assert from 'node:assert/strict';
import {
  createTodoSchema,
  todoIdSchema,
  updateDoneSchema,
  updateTodoSchema,
  validateTodoInput,
} from '../src/utils/validateTodo.js';

test('accepts and normalizes a valid title and optional description', () => {
  const result = validateTodoInput({ title: '  Buy groceries  ', description: ' Milk and bread ' });
  assert.equal(result.valid, true);
  assert.deepEqual(result.data, { title: 'Buy groceries', description: 'Milk and bread' });
});

test('rejects a missing or whitespace-only title', () => {
  assert.equal(validateTodoInput({ title: '   ' }).valid, false);
  assert.equal(validateTodoInput({}).valid, false);
  assert.equal(validateTodoInput(undefined).valid, false);
});

test('rejects a title over 100 characters', () => {
  assert.equal(validateTodoInput({ title: 'a'.repeat(101) }).valid, false);
});

test('rejects a description over 500 characters', () => {
  assert.equal(validateTodoInput({ title: 'Valid title', description: 'a'.repeat(501) }).valid, false);
});

test('requires a title when creating a task', () => {
  assert.equal(createTodoSchema.safeParse({ description: 'Updated detail' }).success, false);
});

test('accepts updating only the title or only the description', () => {
  assert.equal(updateTodoSchema.safeParse({ title: 'New title' }).success, true);
  assert.equal(updateTodoSchema.safeParse({ description: 'New detail' }).success, true);
});

test('rejects an empty partial update', () => {
  assert.equal(updateTodoSchema.safeParse({}).success, false);
});

test('rejects unknown properties to prevent mass assignment', () => {
  const payload = { title: 'Valid title', done: true, __v: 9 };
  assert.equal(createTodoSchema.safeParse(payload).success, false);
  assert.equal(updateTodoSchema.safeParse({ title: 'Valid title', done: true }).success, false);
});

test('validates completion updates as booleans and rejects extra properties', () => {
  assert.equal(updateDoneSchema.safeParse({ done: true }).success, true);
  assert.equal(updateDoneSchema.safeParse({ done: 'true' }).success, false);
  assert.equal(updateDoneSchema.safeParse({ done: true, title: 'Injected' }).success, false);
  assert.equal(updateDoneSchema.safeParse({}).success, true);
});

test('validates MongoDB ObjectId route parameters strictly', () => {
  assert.equal(todoIdSchema.safeParse('507f1f77bcf86cd799439011').success, true);
  assert.equal(todoIdSchema.safeParse('not-an-id').success, false);
  assert.equal(todoIdSchema.safeParse('123').success, false);
});
