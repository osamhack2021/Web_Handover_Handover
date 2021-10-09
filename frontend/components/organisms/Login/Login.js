import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import R from 'ramda';

import Button from '@mui/material/Button';
import TextField from "@mui/material/TextField";

import useKeyPress from '_hooks/useKeyPress';
import { attemptLogin } from '_thunks/auth';
// import { attemptDummyLogin } from '_thunks/auth';

export default function Login() {
  const dispatch = useDispatch();

  const [remember, setRemember] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    const username = localStorage.getItem('username');
    if (username) {
      setRemember(true);
      setUsername(username);
    }
  }, []);

  const login = () => {
    const userCredentials = { serviceNumber: username, password };

    if (remember) {
      localStorage.setItem("serviceNumber", username);
    }

    dispatch(attemptLogin(userCredentials)).catch(R.identity);
  };

  useKeyPress('Enter', login);

  const rememberMe = () => {
    localStorage.removeItem('username');
    setRemember(!remember);
  };

  const updateUsername = (e) => setUsername(e.target.value);
  const updatePassword = (e) => setPassword(e.target.value);

  return (
    <div className="login-box">
      <div className="login-logo" />
      <div className="login-title">로그인</div>
      <div className="login-subtitle">환영합니다!</div>
      <div className="forminput-container">
        <TextField
          fullWidth
          id="input-id"
          label="군번"
          placeholder="군번을 입력해주세요"
          value={username}
          onChange={updateUsername}
          margin="normal"
        />
        <TextField
          fullWidth
          id="input-password"
          label="비밀번호"
          placeholder="군번을 입력해주세요"
          value={password}
          type="password"
          onChange={updatePassword}
          margin="normal"
        />
      </div>
      <Button className="login-button mb-5" variant = "contained" onClick={login}>
        로그인
      </Button>
      <div className="login-register">
        <Link to="/recovery" className="login-link">
          비밀번호 찾기
        </Link>
      </div>
      <div className="login-register">
        계정이 없으신가요?&nbsp;
        <Link to="/register" className="login-link">
          회원가입
        </Link>
      </div>
    </div>
  );
}
