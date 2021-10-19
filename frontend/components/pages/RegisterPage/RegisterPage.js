import { Container } from '@mui/material';
import { push } from 'connected-react-router';
import R from 'ramda';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Register from '_organisms/Register';

export default function RegisterPage() {
  const dispatch = useDispatch();
  const { user } = useSelector(R.pick(['user']));

  useEffect(() => {
    if (!R.isEmpty(user)) {
      dispatch(push('/home'));
    }
  }, []);

  return (
    <Container
      maxWidth="xs"
      sx={{
        // overflow: 'scroll',
        // height: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Register />
    </Container>
  );
}
