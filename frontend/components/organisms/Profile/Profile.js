import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import { getUser } from "_api/user";
import { getGroupByGroupId } from "_api/group";

const status = {
  admin: "관리자",
  inactive: "비활성",
  deleted: "삭제",
  retired: "전역",
  active: "활성",
};

export default function Profile() {
  const { id } = useParams();

  const [user, setUser] = useState(null);
  const [group, setGroup] = useState(null);

  // Get user information
  useEffect(() => {
    getUser(Id)
      .then((data) => {
        setUser(data);
      });
  }, []);

  // Get group information after user information is fetched
  useEffect(() => {
    if (user != null) {
      getGroupByGroupId(user.group)
        .then((data) => {
          setGroup(data);
        });
    }
  }, [user]);

  return user == null || group == null ? (
    <div>Loading...</div>
  ) : (
    <div className="profile">
      <div className="profile-title">사용자 정보</div>
      <div className="profile-labels">
        <div className="profile-label">이름</div>
        <div className="profile-label">계급</div>
        <div className="profile-label">직무</div>
        <div className="profile-label">사용자 계정 상태</div>
        <div className="profile-label">소속</div>
        <div className="profile-label">군 이메일</div>
        <div className="profile-label">군 연락처</div>
        <div className="profile-label">일반 연락처</div>
      </div>
      <div className="profile-values">
        <div className="profile-value">{user.name}</div>
        <div className="profile-value">{user.rank}</div>
        <div className="profile-value">{user.title}</div>
        <div className="profile-value">{status[user.status]}</div>
        <div className="profile-value">
          {group.name === undefined ? "소속 없음" : group.name}
        </div>
        <div className="profile-value">{user.email}</div>
        <div className="profile-value">{user.tel.military}</div>
        <div className="profile-value">{user.tel.mobile}</div>
      </div>
    </div>
  );
}
