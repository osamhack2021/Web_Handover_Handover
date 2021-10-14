import R from 'ramda';
import React from 'react';
import { useSelector } from 'react-redux';
import Item from '_molecules/Item';

export default function TestPage() {
  const { userItem } = useSelector(R.pick(['userItem']));
  const render = userItem.map((elem) => <Item item={elem} />);
  return (
    <div>
      {render}
    </div>
  );
}
