import React from 'react';

import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import HandoverLogo from '_assets/images/handover-logo.png';
import { useHistory } from 'react-router-dom';

import Logo from '_atoms/Logo';

export default function WelcomeHeader() {
  const history = useHistory();
  const onClickLogo = (event) => {
    if (history.location.pathname !== '/') {
      history.push('/');
    }
  };
  const onClickAbout = (event) => {
    if (history.location.pathname !== '/about') {
      history.push('/about');
    }
  };
  const onClickLogin = (event) => {
    if (history.location.pathname !== '/login') {
      history.push('/login');
    }
  };
  const onClickRegister = (event) => {
    if (history.location.pathname !== '/register') {
      history.push('/register');
    }
  };
  return (
    <Stack
      direction="row"
      justifyContent="space-between"
      style={{ width: '100%', marginTop: '10px' }}
    >
      <div style={{ marginLeft: '40px' }}>
        <Logo width="170" onClick={onClickLogo} />
      </div>
      <Stack direction="row" sx={{ marginRight: '40px' }}>
        <Button
          sx={{ color: 'black', fontSize: '15px' }}
          onClick={onClickAbout}
        >
          소개
        </Button>
        <Button
          sx={{ color: 'black', fontSize: '15px' }}
          onClick={onClickLogin}
        >
          로그인
        </Button>
        <Button
          sx={{ color: 'black', fontSize: '15px' }}
          onClick={onClickRegister}
        >
          회원가입
        </Button>
      </Stack>
    </Stack>
  );
}
