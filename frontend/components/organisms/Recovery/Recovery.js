import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";

import TextField from "@mui/material/TextField";
import Button from '@mui/material/Button';


import FormInput from "_molecules/FormInput";

export default function Login() {
  const dispatch = useDispatch();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");

  const updateUsername = (e) => setUsername(e.target.value);
  const updateEmail = (e) => setEmail(e.target.value);

  return (
    <div className="recovery-box">
      <div className="login-logo mx-auto"></div>
      <div className="login-title">비밀번호 찾기</div>
      <div className="forminput-container">
        <TextField
          fullWidth
          id="input-username"
          label="군번"
          placeholder="군번을 입력해주세요"
          value={username}
          onChange={updateUsername}
          margin="normal"
        />
        <TextField
          fullWidth
          id="input-name"
          label="이름"
          placeholder="이름을 입력해주세요"
          /*value={}*/
          /*onChange={}*/
          margin="normal"
        />
        <TextField
          fullWidth
          id="input-username"
          label="군 이메일"
          placeholder="e.g. example@example.com"
          value={email}
          onChange={updateEmail}
          margin="normal"
        />
      </div>
      <Button
        className="login-button"
        size="medium"
        variant = "contained"
      >
        이메일로 인증번호 받기
      </Button>
    </div>
  );
}
