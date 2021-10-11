import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Card from '_molecules/Card';
import R from 'ramda';
import { attemptLogout } from '_thunks/auth';

export default function TestPage() {
  const { userItem } = useSelector(R.pick(['userItem']));
  const dispatch = useDispatch();
  const currentId = userItem[0].Id;
  const render = userItem.map((elem) => <Card Id={elem.Id} />);

  const logout = () => {
    dispatch(attemptLogout());
  };
  return (
    <div>
      <Card Id={userItem[2].Id} />
      <Card Id={userItem[3].Id} />
    </div>
  );
}
