import React from 'react';
import R from 'ramda';
import { useDispatch, useSelector } from 'react-redux';

export default function Profile() {
  const dispatch = useDispatch();
  const { user } = useSelector(R.pick(['user']));
  const { group } = useSelector(R.pick(['group']));

  let status = "활성";
  switch(user.status){
    case "admin" : status="관리자;"
    case "inactive" : status="비활성";
    case "deleted" : status="삭제";
    case "retired" : status="전역";
    default : status="활성";
  }

  return (
    <div className="profile">
      <div className="profile-title">
        사용자 정보
      </div>
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
        <div className="profile-value">{status}</div>
        <div className="profile-value">{group.division === undefined ? "소속 없음" : group.division}</div>
        <div className="profile-value">{user.email}</div>
        <div className="profile-value">{user.tel.military}</div>
        <div className="profile-value">{user.tel.mobile}</div>
      </div>
    </div>
  );
}
