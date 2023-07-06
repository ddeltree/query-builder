import { useSearchParams } from 'next/navigation';

export default function useQueryBuilder() {
  const query = useSearchParams();
  /** adds or removes the specified params and returns the current route with the resultant query */
  const makeQuery = queryBuilderFrom(new URLSearchParams(query.toString()));
  return makeQuery;
}

function queryBuilderFrom(query: Readonly<URLSearchParams>) {
  function makeQuery({
    add: toAdd = {},
    rem: toRem = {},
  }: {
    add?: Record<string, string[] | string>;
    rem?: Record<string, string[] | string | '*'>;
  }) {
    toAdd ??= {};
    toRem ??= {};
    const newQuery = new URLSearchParams(query.toString());
    const keySet = new Set([
      ...Array.from(new Set(query.keys())),
      ...Array.from(new Set(Object.keys(toAdd))),
    ]);
    keySet.forEach((key) => {
      const values = query.getAll(key);
      let addValues: string[] = [];
      if (key in toAdd)
        addValues =
          typeof toAdd[key] === 'object'
            ? (toAdd[key] as string[])
            : [toAdd[key] as string];
      let valueSet = new Set(values);

      if (Object.hasOwn(toRem, key)) {
        let rm = toRem[key];
        if (rm === '*') valueSet.clear();
        else {
          if (typeof rm === 'string') rm = [rm];
          rm.forEach((v) => valueSet.delete(v));
        }
      }
      valueSet = new Set([
        ...Array.from(valueSet),
        ...Array.from(new Set(addValues)),
      ]);

      newQuery.delete(key);
      valueSet.forEach((q) => {
        newQuery.append(key, q);
      });
    });
    const route = `${window.location.pathname}?${newQuery.toString()}`;
    return route;
  }
  return makeQuery;
}
