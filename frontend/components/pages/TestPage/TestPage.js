import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Card from '_molecules/Card';
import R from 'ramda';
import { attemptLogout } from '_thunks/auth';

export default function TestPage() {
  const { userItem } = useSelector(R.pick(['userItem']));
  
  const render = userItem.map((elem) => <Card Id={elem.Id} />);
  
  return (
    <div>
      {render}
    </div>
  );
}
