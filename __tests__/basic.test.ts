import { expect, test } from 'vitest';
import makeQuery from '../makeQuery';

test('add entries', () => {
  const newQuery = makeQuery('', {
    add: {
      number: '42',
      strings: ['hello', 'world'],
    },
  });
  expect(newQuery).toBe('number=42&strings=hello&strings=world');
});

test('remove specific entries (undo add entries)', () => {
  const initialQuery = 'number=42&strings=hello&strings=world';
  const newQuery = makeQuery(initialQuery, {
    rem: {
      number: '42',
      strings: ['hello', 'world'],
    },
  });
  expect(newQuery).toBe('');
});
