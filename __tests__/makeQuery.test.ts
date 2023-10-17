import { expect, test } from 'vitest';
import makeQuery from '../makeQuery';

test('adding and removing nothing results in the initial query', () => {
  const initialQuery = 'a=1&b=2&c=3';
  const addRemArgs: AddRemArgs = [
    [undefined, undefined],
    [undefined, {}],
    [{}, undefined],
    [{}, {}],
  ];
  for (const [add, rem] of addRemArgs) {
    const newQuery = makeQuery(initialQuery, {
      add,
      rem,
    });
    expect(newQuery).toBe(initialQuery);
  }
});

test('adding and removing the same existing entry results in the initial query', () => {
  const initialQuery = 'a=1&b=2&prop=value';
  const newQuery = makeQuery(initialQuery, {
    add: { prop: 'value' },
    rem: { prop: 'value' },
  });
  expect(newQuery).toBe(initialQuery);
});

test('adding and removing the same inexistent entry differs from the initial query', () => {
  const initialQuery = 'a=1&b=2';
  const newQuery = makeQuery(initialQuery, {
    add: { prop: 'value' },
    rem: { prop: 'value' },
  });
  expect(newQuery).toBe(initialQuery + '&prop=value');
});

test('removing inexistent entry does nothing', () => {
  const initialQuery = 'a=1&b=2&c=3';
  const newQuery = makeQuery(initialQuery, {
    rem: { prop: 'value' },
  });
  expect(newQuery).toBe(initialQuery);
});

test('removing existent entry does not affect other entries', () => {
  const initialQuery = 'a=1&b=0&b=2&c=3';
  const newQuery = makeQuery(initialQuery, {
    rem: {
      b: '0',
    },
  });
  expect(newQuery).toBe('a=1&b=2&c=3');
});

test('removing duplicated entry removes it only once', () => {
  const initialQuery = 'a=1&b=2&b=2&c=3';
  const newQuery = makeQuery(initialQuery, {
    rem: {
      b: '2',
    },
  });
  expect(newQuery).toBe('a=1&b=2&c=3');
});

test('REMOVE_ALL (*) can remove both duplicated and unique entries', () => {
  const initialQuery = 'a=1&b=2&b=2&c=3';
  const newQuery = makeQuery(initialQuery, {
    rem: {
      b: '*',
      c: '*',
    },
  });
  expect(newQuery).toBe('a=1');
});

type AddRemArgs = (Record<string, string> | undefined)[][];
