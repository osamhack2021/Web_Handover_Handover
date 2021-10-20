import React from 'react';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Link from '@mui/material/Link';
import HandoverLogo from '_assets/images/handover-logo.png';
import Logo from '_atoms/Logo';

export default function WelcomeFooter() {
  const onClickGithub = () => {
    window.location = 'https://github.com/osamhack2021/Web_Handover_Handover';
  };

  return (
    <Stack
      direction="row"
      justifyContent="space-between"
      alignItems="center"
      sx={{ backgroundColor: '#D8C3A5', height: '100px' }}
    >
      <Stack direction="row" spacing={3} sx={{ marginLeft: '40px' }}>
        <Logo width="100px" />
        <Link href="https://github.com/osamhack2021/Web_Handover_Handover" sx={{ color: 'black', fontSize: '18px', textAlign: 'end' }} underline="hover">Github Repo</Link>
      </Stack>
      <Typography sx={{ fontSize: '10px', marginRight: '40px' }}>
        Copyright @ 2021 Handover
      </Typography>
    </Stack>
  );
}
