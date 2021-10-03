import React from 'react';

export default function Profile({name, rank, title, status, division, email, military, mobile,}) {
  return (
    <div className="profile">
      <div className="tab">
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
      {/*
      <div className="profile-values">
        <div className="profile-value">{name}</div>
        <div className="profile-value">{rank}</div>
        <div className="profile-value">{title}</div>
        <div className="profile-value">{status}</div>
        <div className="profile-value">{division}</div>
        <div className="profile-value">{email}</div>
        <div className="profile-value">{military}</div>
        <div className="profile-value">{mobile}</div>
      </div>
      */}
      <div className="profile-values">
        <div className="profile-value">야옹이</div>
        <div className="profile-value">이병</div>
        <div className="profile-value">짬타이거</div>
        <div className="profile-value">활성</div>
        <div className="profile-value">0사단 00연대</div>
        <div className="profile-value">example@example.com</div>
        <div className="profile-value">123-0000</div>
        <div className="profile-value">010-1337-1337</div>
      </div>
    </div>
  );
}
