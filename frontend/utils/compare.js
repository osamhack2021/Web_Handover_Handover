// Checks deep equality between objects
// Code from: https://dmitripavlutin.com/how-to-compare-objects-in-javascript/#4-deep-equality
export const deepEqual = (object1, object2) => {
  if (object1 == null && object2 == null) return true;
  if (object1 == null || object2 == null) return false;

  const keys1 = Object.keys(object1);
  const keys2 = Object.keys(object2);
  if (keys1.length !== keys2.length) {
    return false;
  }
  for (const key of keys1) {
    const val1 = object1[key];
    const val2 = object2[key];
    const areObjects = isObject(val1) && isObject(val2);
    if (
      (areObjects && !deepEqual(val1, val2)) ||
      (!areObjects && val1 !== val2)
    ) {
      return false;
    }
  }
  return true;
};

// Checks whether the parameter is object type
export const isObject = (object) => {
  return object != null && typeof object === "object";
};
