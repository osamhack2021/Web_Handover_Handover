import { snakeToCamelCase } from 'json-style-converter/es5';
import { getItemByItemId } from '_api/item';

export default function PromiseItemArray(array, setTargetFunction, setLoadFunction, setName) {
  Promise.all(array.map((elem) => getItemByItemId(elem))).then((elemItem) => {
    setTargetFunction((prevState) => ({
      ...prevState,
      [setName]: snakeToCamelCase(elemItem),
    }
    ));
    setLoadFunction(false);
  });
}
