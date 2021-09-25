import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";

import Block from "react-bulma-companion/lib/Block";
import Button from "react-bulma-companion/lib/Button";

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
      <Block className="login-title">비밀번호 찾기</Block>
      <hr className="separator" />
      <div className="forminput-container">
        <FormInput
          onChange={updateUsername}
          placeholder="군번을 입력해주세요"
          value={username}
          className="is-fullwidth"
          label="군번"
        />
        <FormInput
          /*onChange={}*/
          placeholder="이름을 입력해주세요"
          /*value={}*/
          className="is-fullwidth"
          label="이름"
        />
        <FormInput
          onChange={updateEmail}
          placeholder="e.g. example@example.com"
          /*value={password}*/
          className="is-fullwidth"
          label="군 이메일"
        />
      </div>
      <hr className="separator" />
      <Button
        className="login-button"
        /*onClick={}*/
        size="medium"
        /*disabled={!passwordValid || !usernameAvailable}*/
        /*$button-hover-border-color="orange"*/
      >
        이메일로 인증번호 받기
      </Button>
    </div>
  );
}
