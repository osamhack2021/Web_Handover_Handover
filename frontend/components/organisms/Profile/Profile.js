import { Container, LinearProgress } from "@mui/material";
import React from "react";

const status = {
  admin: "관리자",
  inactive: "비활성",
  deleted: "삭제",
  retired: "전역",
  active: "활성",
};

export default function Profile({ user, group }) {
  if (user == null || group == null) return <LinearProgress />;

  const entry = [
    {
      label: "계급",
      value: user.rank,
    },
    {
      label: "이름",
      value: user.name,
    },
    {
      label: "직무",
      value: user.title,
    },
    {
      label: "사용자 상태",
      value: status[user.status],
    },
    {
      label: "소속",
      value: group.name == null ? "소속 없음" : group.name,
    },
    {
      label: "이메일",
      value: user.email,
    },
    {
      label: "군 연락처",
      value: user.tel.military,
    },
    {
      label: "일반 연락처",
      value: user.tel.mobile,
    },
  ];

  return user == null || group == null ? (
    <LinearProgress />
  ) : (
    <Container maxWidth="sm" minWidth="sm" sx={{ pt: 4, ml: 6 }} className="profile">
      {entry.map((e, index) => (
        <div className="profile-item" key={index}>
          <div className="profile-label">{e.label}</div>
          <div className="profile-value">{e.value != null ? e.value : ""}</div>
        </div>
      ))}
    </Container>
  );
}
