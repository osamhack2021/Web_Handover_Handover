import { Container } from '@mui/material';
import { push } from 'connected-react-router';
import R from 'ramda';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import WelcomeHeader from '_frontend/components/organisms/WelcomeHeader';
import Login from '_organisms/Login';

export default function LoginPage() {
  const dispatch = useDispatch();
  const { user } = useSelector(R.pick(['user']));

  useEffect(() => {
    if (!R.isEmpty(user)) {
      dispatch(push('/home'));
    }
  }, []);

  return (
    <div style={{ overflowY: 'hidden' }}>
      <WelcomeHeader />
      <Container
        maxWidth="xs"
        sx={{
          marginTop: '200px',
          height: '100%',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Login />
      </Container>
    </div>

  );
}
