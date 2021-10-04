import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { push } from 'connected-react-router';
import R from 'ramda';

import Register from '_templates/RegisterSection';

import Box from '@mui/material/Box';

export default function RegisterPage() {
  const dispatch = useDispatch();
  const { user } = useSelector(R.pick(['user']));

  useEffect(() => {
    if (!R.isEmpty(user)) {
      dispatch(push('/home'));
    }
  }, []);

  return (
    <Box 
      className="register-page page"
      sx={{
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center'
      }}
    >
      <Register />
    </Box>
  );
}
