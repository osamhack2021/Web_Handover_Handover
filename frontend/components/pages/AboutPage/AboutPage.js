import React from "react";
import TeamProfile from "_organisms/TeamProfile";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import WelcomeHeader from "_organisms/WelcomeHeader";
import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";

export default function AboutPage() {
  return (
    <div>
      <WelcomeHeader />
      <Container maxWidth="md" sx={{ paddingBottom: "200px" }}>
        <Typography
          sx={{
            fontFamily: "BM HANNA",
            fontStyle: "normal",
            fontWeight: "400",
            fontSize: "40px",
            marginBottom: "80px",
          }}
        >
          프로젝트 소개
        </Typography>
        <Stack
          direction="row"
          alignItems="center"
          spacing={3}
          sx={{ marginBottom: "200px" }}
        >
          <div
            style={{
              backgroundColor: "white",
              width: "400px",
              height: "300px",
            }}
          />
          <Typography
            sx={{
              fontFamily: "BM HANNA",
              fontStyle: "normal",
              fontWeight: "400",
              fontSize: "20px",
              width: "500px",
            }}
          >
            Handover🤝는 군에서 더 편리하게, 더 똑똑하게 인수인계를 할 수 있도록
            사용자들을 지원하는 Web 서비스입니다. Handover를 통해 여러 방법으로
            진행되고 있는 인수인계 방식들을 통일하고, 체계적으로 문서들을
            관리해보세요!
          </Typography>
        </Stack>
        <Typography
          sx={{
            fontFamily: "BM HANNA_TTF",
            fontStyle: "normal",
            fontWeight: "400",
            fontSize: "40px",
            marginBottom: "80px",
          }}
        >
          팀원 소개
        </Typography>
        <Grid container spacing={3}>
          <Grid container item spacing={5}>
            <Grid item>
              <TeamProfile
                name="상병 조나단"
                roles="Leader,Frontend,CI/CD"
                army="육군 1군단 운전병"
                status="중앙대학교 2학년 수료"
                imgSrc="https://user-images.githubusercontent.com/13298429/132793750-33ab9941-00f3-4ee9-8401-adbf95201806.png"
              />
            </Grid>
            <Grid item>
              <TeamProfile
                name="상병 김태원"
                roles="Frontend"
                army="육군 2작사 어학병"
                status="KAIST 2학년 수료"
                imgSrc="https://user-images.githubusercontent.com/13298429/132990109-6c65271f-431b-460a-98bb-d59ad00b1024.png"
              />
            </Grid>
          </Grid>
          <Grid container item spacing={5}>
            <Grid item>
              <TeamProfile
                name="병장 박현준"
                roles="Backend,Testing"
                army="육군 28사단 보병"
                status="한국산업기술대학교 2학년 수료"
                imgSrc="https://user-images.githubusercontent.com/13298429/132939286-3aa06019-e474-4f42-b164-1813a925d624.png"
              />
            </Grid>
            <Grid item>
              <TeamProfile
                name="일병 최우혁"
                roles="Frontend,Docs"
                army="육군 31사단 TOD 운용병"
                status="서울대학교 2학년 수료"
                imgSrc="https://user-images.githubusercontent.com/13298429/132937945-1035efad-e38b-4595-9f68-8593d03fb214.png"
              />
            </Grid>
          </Grid>
          <Grid container item spacing={5}>
            <Grid item>
              <TeamProfile
                name="상병 오지환"
                roles="Backend,Docs"
                army="해군 군수사 CERT 감시병"
                status="협성대학교 1학년 수료"
                imgSrc="https://user-images.githubusercontent.com/13298429/132968154-4d885c91-ba18-4bbd-871b-8f4b969451a8.png"
              />
            </Grid>
            <Grid item>
              <TeamProfile
                name="상병 안수겸"
                roles="Design,Presentation"
                army="육군 2군단 운전병"
                status="중앙대학교 1학년 수료"
                imgSrc="https://user-images.githubusercontent.com/13298429/132990151-bb4bbdb0-67b0-4df8-894a-5173204778b2.png"
              />
            </Grid>
          </Grid>
        </Grid>
      </Container>
    </div>
  );
}
