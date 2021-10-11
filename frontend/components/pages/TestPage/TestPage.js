import React from 'react';
import { useSelector } from 'react-redux';
import Card from '_molecules/Card';
import R from 'ramda';

export default function TestPage() {
  const { userItem } = useSelector(R.pick(['userItem']));
  const currentId = userItem[0].Id;
  const render = userItem.map((elem) => <Card Id={elem.Id} />);
  console.log(currentId);
  return (
    <div>
      <Card Id={userItem[2].Id} />
      <Card Id={userItem[3].Id} />
      <Card Id={userItem[4].Id} />
    </div>
  );
}
