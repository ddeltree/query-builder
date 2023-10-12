# Query Builder

A function to implement the ease of use I wish URLSearchParams had.

## How to use this function in your project

It's as simple as **copying `makeQuery.ts`** to your project, importing and using it.
**No dependencies** other than TypeScript itself.

## Quickstart

Supposing the output is meaningful, then the following code solves the problem using the all the flexibility the makeQuery's signature has to offer:

```ts
import makeQuery from './makeQuery';

const initialQuery = [
  'framework=Next.js',
  'framework=SvelteKit',
  'language=JavaScript',
  'language=TypeScript',
  'language=CSharp',
  'tool=git',
].join('&');

const newQuery = makeQuery(initialQuery, {
  add: {
    library: 'Selenium',
    language: ['Python', 'Java'],
  },
  rem: {
    framework: '*', // removes all `framework` entries
    tool: 'git',
    language: ['TypeScript', 'JavaScript'],
  },
});

console.log(newQuery);
// -> language=CSharp&language=Python&language=Java&library=Selenium
```
