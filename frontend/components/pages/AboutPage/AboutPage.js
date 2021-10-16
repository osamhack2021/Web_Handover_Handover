import React from 'react';
import TeamProfile from '_organisms/TeamProfile';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';

export default function AboutPage() {
  return (
    <div>
      <Typography sx={{
        fontFamily: 'BM HANNA',
        fontStyle: 'normal',
        fontWeight: '400',
        fontSize: '40px',
        marginBottom: '50px',
      }}
      >
        프로젝트 소개
      </Typography>
      <Grid container item spacing={3} sx={{ marginBottom: '100px' }}>
        <Grid item>
          <div style={{ backgroundColor: 'white', width: '400px', height: '300px' }} />
        </Grid>
        <Grid item>
          <Typography sx={{
            fontFamily: 'BM HANNA',
            fontStyle: 'normal',
            fontWeight: '400',
            fontSize: '20px',
            width: '500px',
          }}
          >
            Handover🤝는 군에서 더 편리하게, 더 똑똑하게 인수인계를 할 수 있도록 사용자들을 지원하는 Web 서비스입니다. Handover를 통해 여러 방법으로 진행되고 있는 인수인계 방식들을 통일하고, 체계적으로 문서들을 관리해보세요!
          </Typography>
        </Grid>
      </Grid>
      <Typography sx={{
        fontFamily: 'BM HANNA_TTF',
        fontStyle: 'normal',
        fontWeight: '400',
        fontSize: '40px',
        marginBottom: '50px',
      }}
      >
        팀원 소개
      </Typography>
      <Grid container spacing={3}>
        <Grid container item spacing={5}>
          <Grid item>
            <TeamProfile name="조나단" description="기획 및 프론트엔드 개발" />
          </Grid>
          <Grid item>
            <TeamProfile name="김태원" description="프론트엔드 개발" />
          </Grid>
        </Grid>
        <Grid container item spacing={5}>
          <Grid item>
            <TeamProfile name="박현준" description="백엔드 개발 " />
          </Grid>
          <Grid item>
            <TeamProfile name="최우혁" description="프론트엔드 개발" />
          </Grid>
        </Grid>
        <Grid container item spacing={5}>
          <Grid item>
            <TeamProfile name="오지환" description="백엔드 개발" />
          </Grid>
          <Grid item>
            <TeamProfile name="안수겸" description="디자인" />
          </Grid>
        </Grid>
      </Grid>
      <div />

    </div>
  );
}
