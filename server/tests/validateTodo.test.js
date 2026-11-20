import test from 'node:test';
import assert from 'node:assert/strict';
import { validateTodoInput } from '../src/utils/validateTodo.js';

test('accepts a valid title and optional description', () => {
  assert.deepEqual(validateTodoInput({ title: '  Buy groceries  ', description: ' Milk and bread ' }), {
    valid: true,
    errors: {},
  });
});

test('rejects a missing or whitespace-only title', () => {
  assert.equal(validateTodoInput({ title: '   ' }).valid, false);
  assert.equal(validateTodoInput({}).valid, false);
});

test('rejects a title over 100 characters', () => {
  assert.equal(validateTodoInput({ title: 'a'.repeat(101) }).valid, false);
});

test('rejects a description over 500 characters', () => {
  assert.equal(validateTodoInput({ title: 'Valid title', description: 'a'.repeat(501) }).valid, false);
});

test('requires a title in full updates', () => {
  assert.equal(validateTodoInput({ description: 'Updated detail' }).valid, false);
});

test('accepts updating only the title or only the description', () => {
  assert.equal(validateTodoInput({ title: 'New title' }, { partial: true }).valid, true);
  assert.equal(validateTodoInput({ description: 'New detail' }, { partial: true }).valid, true);
});

test('rejects an empty partial update', () => {
  assert.equal(validateTodoInput({}, { partial: true }).valid, false);
});
