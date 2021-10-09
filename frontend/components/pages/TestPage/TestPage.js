import React from 'react';
import { useSelector } from 'react-redux';
import Card from '_molecules/Card';
import R from 'ramda';

export default function TestPage() {
  const { userItem } = useSelector(R.pick(['userItem']));
  const currentId = userItem[0].Id;
  console.log(currentId);
  return (
    <Card Id={currentId} />
  );
}
