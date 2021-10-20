import React from 'react';
import { useHistory } from 'react-router-dom';
import Logo from '_frontend/components/atoms/Logo';
import { Container, Stack, Typography } from '@mui/material';
import Button from '@mui/material/Button';

export default function NotFoundPage() {
  const history = useHistory();
  const onClickHome = () => {
    history.push('/home');
  };
  return (
    <Container sx={{ paddingTop: '100px' }}>
      <Stack alignItems="center" spacing={2}>
        <Logo width="400" style={{ marginBottom: '50px' }} />
        <Stack alignItems="center" spacing={0.5}>
          <Typography sx={{ fontSize: '23px' }}>
            죄송합니다
          </Typography>
          <Typography sx={{ fontSize: '23px' }}>
            요청하신 페이지를 찾을 수 없습니다
          </Typography>
        </Stack>
        <div>
          페이지가 존재하지 않거나 사용할 수 없는 페이지 입니다.
          <br />
          입력하신 주소가 정확한지 다시 한 번 확인해주세요.
        </div>
        <Button onClick={onClickHome}> 홈으로 이동</Button>
      </Stack>
    </Container>
  );
}
