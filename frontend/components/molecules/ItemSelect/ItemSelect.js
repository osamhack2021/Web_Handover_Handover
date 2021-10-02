import React from 'react';

import Label from "react-bulma-companion/lib/Label";
import Field from "react-bulma-companion/lib/Field";
import Control from "react-bulma-companion/lib/Control";
import Select from "react-bulma-companion/lib/Select";

export default function ItemSelect({items, label, onChange}) {
  const arrayRender = items.map((elem) => (
    <option key={elem._id} value={elem.value}>{elem.value}</option>
  ));
  console.log(arrayRender);
  return (
    <div className="item-select-box">
      <div className="item-select-label">{label}</div>
      <div className="select is-fullwidth">
        <select>
          {arrayRender}
        </select>
      </div>
    </div>
  );
}
