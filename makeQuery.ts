/** Adds or/and-then removes the specified params and returns the current route with the resultant query */
export default function makeQuery(
  currentQuery: string,
  { add: paramsToAdd = {}, rem: paramsToRemove = {} }: ParamsOptions,
) {
  const currentSearchParams = new URLSearchParams(currentQuery);
  const result1 = from(currentSearchParams).remove(paramsToRemove);
  const result2 = from(result1).add(paramsToAdd);
  result2.sort();
  return result2.toString();
}

function from(previousSearchParams: URLSearchParams) {
  previousSearchParams = cloneSearchParams(previousSearchParams);
  const previousKeys = new Set(previousSearchParams.keys());
  const resultSearchParams = cloneSearchParams(previousSearchParams);
  return {
    remove: function (paramsToRemove: ParamsToRemove) {
      for (const key of previousKeys) {
        const previousValues = resultSearchParams.getAll(key);
        let updatedValues = [...previousValues];

        if (Object.hasOwn(paramsToRemove, key)) {
          const remValue = paramsToRemove[key];
          let remValues = new Set<string>();
          if (remValue === '*') {
            updatedValues = [];
          } else if (typeof remValue === 'string') {
            remValues.add(remValue);
          } else {
            remValues = new Set(remValue);
          }
          remValues.forEach((toRemove) => {
            const i = updatedValues.findIndex((value) => value === toRemove);
            updatedValues.splice(i, 1);
          });
        }
        this.update(key, updatedValues);
      }
      return resultSearchParams;
    },
    add: function (paramsToAdd: ParamsToAdd) {
      for (const key of Object.keys(paramsToAdd)) {
        const previousValues = previousSearchParams.getAll(key);
        let valuesToAdd: string[] = [];
        if (Object.hasOwn(paramsToAdd, key)) {
          valuesToAdd =
            typeof paramsToAdd[key] === 'object'
              ? (paramsToAdd[key] as string[])
              : [paramsToAdd[key] as string];
        }
        const updatedValues = [...previousValues, ...valuesToAdd];
        this.update(key, updatedValues);
      }
      return resultSearchParams;
    },
    update: function (key: string, values: string[]) {
      resultSearchParams.delete(key);
      values.forEach((q) => {
        resultSearchParams.append(key, q);
      });
    },
  };
}

function cloneSearchParams(params: URLSearchParams) {
  return new URLSearchParams(params);
}

type ParamsOptions = {
  add?: ParamsToAdd;
  rem?: ParamsToRemove;
};
type ParamsToRemove = Record<string, string[] | (string & {}) | '*'>;
type ParamsToAdd = Record<string, string[] | string>;
