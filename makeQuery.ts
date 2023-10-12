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
  const previousKeys = Array.from(previousSearchParams.keys());
  const resultSearchParams = cloneSearchParams(previousSearchParams);
  return {
    remove: function (paramsToRemove: ParamsToRemove) {
      for (const key of previousKeys) {
        const currentValues = resultSearchParams.getAll(key);
        let updatedValues = [...currentValues];

        if (Object.hasOwn(paramsToRemove, key)) {
          const remValue = paramsToRemove[key];
          let remValues: string[];
          if (remValue === '*') {
            updatedValues = [];
            remValues = [];
          } else if (typeof remValue === 'string') {
            remValues = [remValue];
          } else {
            remValues = remValue;
          }
          const index = updatedValues.findIndex((v) => remValues.includes(v));
          if (index !== -1) {
            updatedValues.splice(index, 1);
            delete paramsToRemove[key]; // remove key only once
          }
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
