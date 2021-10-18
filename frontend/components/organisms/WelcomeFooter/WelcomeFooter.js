import React from 'react';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import HandoverLogo from '_assets/images/handover-logo.png';
import Logo from '_atoms/Logo';

export default function WelcomeFooter() {
  return (
    <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ backgroundColor: '#D8C3A5', height: '100px' }}>
      <Stack direction="row" spacing={3} sx={{ marginLeft: '40px' }}>
        <Logo width="100px" />
        <Typography>
          프로젝트 소개
        </Typography>
        <Typography>
          팀 소개
        </Typography>
        <Typography>
          Github Repo
        </Typography>
      </Stack>
      <Typography sx={{ fontSize: '10px', marginRight: '40px' }}>
        Copyright @ 2021 Handover
      </Typography>
    </Stack>
  );
}
