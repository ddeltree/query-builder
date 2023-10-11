/** Adds or/and-then removes the specified params and returns the current route with the resultant query */
export function makeQuery(
  currentQuery: string,
  { add: toAdd = {}, rem: toRem = {} }: ParamsOptions,
) {
  const currentSearchParams = new URLSearchParams(currentQuery);
  const resultantSearchParams = cloneSearchParams(currentSearchParams);
  const allKeyNames = [
    ...Array.from(currentSearchParams.keys()),
    ...Object.keys(toAdd),
  ];

  for (const key of allKeyNames) {
    const currentValues = currentSearchParams.getAll(key);
    let valuesToAdd: string[] = [];
    if (Object.hasOwn(toAdd, key)) {
      valuesToAdd =
        typeof toAdd[key] === 'object'
          ? (toAdd[key] as string[])
          : [toAdd[key] as string];
    }
    let updatedValues = [...currentValues];

    if (Object.hasOwn(toRem, key)) {
      let rm = toRem[key];
      if (rm === '*') updatedValues = [];
      else {
        if (typeof rm === 'string') rm = [rm];
        updatedValues = updatedValues.filter((v) => !rm.includes(v));
      }
    }
    updatedValues = [...updatedValues, ...valuesToAdd];

    resultantSearchParams.delete(key);
    updatedValues.forEach((q) => {
      resultantSearchParams.append(key, q);
    });
  }
  return resultantSearchParams.toString();
}

function cloneSearchParams(params: URLSearchParams) {
  return new URLSearchParams(params);
}

type ParamsOptions = {
  add?: Record<string, string[] | string>;
  rem?: Record<string, string[] | (string & {}) | '*'>;
};
