/** Adds or/and-then removes the specified params and returns the current route with the resultant query */
export function makeQuery(
  currQuery: string,
  {
    add: toAdd = {},
    rem: toRem = {},
  }: {
    add?: Record<string, string[] | string>;
    rem?: Record<string, string[] | (string & {}) | '*'>;
  },
) {
  toAdd ??= {};
  toRem ??= {};
  const newQuery = new URLSearchParams(currQuery);
  const keySet = new Set([
    ...Array.from(new Set(newQuery.keys())),
    ...Array.from(new Set(Object.keys(toAdd))),
  ]);
  keySet.forEach((key) => {
    const values = newQuery.getAll(key);
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
