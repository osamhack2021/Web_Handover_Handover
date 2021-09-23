import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import R from "ramda";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck } from "@fortawesome/free-solid-svg-icons/faCheck";
import { faExclamationTriangle } from "@fortawesome/free-solid-svg-icons/faExclamationTriangle";

import Box from "react-bulma-companion/lib/Box";
import Button from "react-bulma-companion/lib/Button";
import Block from "react-bulma-companion/lib/Block";
import Title from "react-bulma-companion/lib/Title";
import Field from "react-bulma-companion/lib/Field";
import Control from "react-bulma-companion/lib/Control";
import Icon from "react-bulma-companion/lib/Icon";
import Input from "react-bulma-companion/lib/Input";
import Label from "react-bulma-companion/lib/Label";
import Help from "react-bulma-companion/lib/Help";

import useKeyPress from "_hooks/useKeyPress";
import { postCheckUsername } from "_api/users";
import { validateUsername, validatePassword } from "_utils/validation";
import { attemptRegister } from "_thunks/auth";

import FormInput from "_molecules/FormInput";

export default function Register() {
  const dispatch = useDispatch();

  const [username, setUsername] = useState("");
  const [usernameMessage, setUsernameMessage] = useState("");
  const [password, setPassword] = useState("");
  const [passwordMessage, setPasswordMessage] = useState("");
  const [usernameAvailable, setUsernameAvailable] = useState(false);
  const [passwordValid, setPasswordValid] = useState(false);

  const checkPassword = (newUsername, newPassword) => {
    const { valid, message } = validatePassword(newUsername, newPassword);

    setPasswordValid(valid);
    setPasswordMessage(message);
  };

  const checkUsername = (newUsername) => {
    const { valid, message } = validateUsername(newUsername);

    if (valid) {
      setUsernameMessage("Checking username...");
      setUsernameAvailable(false);

      postCheckUsername(newUsername)
        .then((res) => {
          setUsernameAvailable(res.available);
          setUsernameMessage(res.message);
        })
        .catch(R.identity);
    } else {
      setUsernameAvailable(valid);
      setUsernameMessage(message);
    }
  };

  const updateUsername = (newUserName) => {
    setUsername(newUserName);
    checkPassword(newUserName, password);
  };

  const handleUsernameChange = (e) => {
    updateUsername(e.target.value);
    checkUsername(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    checkPassword(username, e.target.value);
  };

  const register = () => {
    if (usernameAvailable && passwordValid) {
      const newUser = {
        username,
        password,
      };

      dispatch(attemptRegister(newUser)).catch(R.identity);
    }
  };

  useKeyPress("Enter", register);

  return (
    <div className="register-box">
      <div className="login-logo"></div>
      <Block className="login-title">회원가입</Block>
      <div className="login-subtitle">Welcome!</div>
      <hr className="separator" />
      <FormInput
        id="username"
        className="is-fullwidth"
        onChange={handleUsernameChange}
        value={username}
        placeholder="군번을 입력해주세요"
        label="군번"
        color={
          username ? (usernameAvailable ? "success" : "danger") : undefined
        }
        rightIcon={usernameAvailable ? faCheck : faExclamationTriangle}
        inputIsvalid={usernameAvailable}
        helpMessage={usernameMessage}
      />
      <FormInput
        id="password"
        className="is-fullwidth"
        placeholder="비밀번호를 입력해주세요"
        type="password"
        value={password}
        onChange={handlePasswordChange}
        label="비밀번호"
        color={password ? (passwordValid ? "success" : "danger") : undefined}
        rightIcon={passwordValid ? faCheck : faExclamationTriangle}
        inputIsvalid={passwordValid}
        helpMessage={passwordMessage}
      />
      <FormInput
        id="password-re"
        className="is-fullwidth"
        placeholder="비밀번호를 다시 입력해주세요"
        type="password"
        label="비밀번호 재입력"
      />
      <FormInput
        id="name"
        className="is-fullwidth"
        placeholder="이름을 입력해주세요"
        label="이름"
      />
      <FormInput
        id="name"
        className="is-fullwidth"
        placeholder="이름을 입력해주세요"
        label="이름"
      />
      <FormInput
        id="job-name"
        className="is-fullwidth"
        placeholder="e.g. 인사 담당관, 대대장..."
        label="직무명"
      />
      <FormInput
        id="email"
        className="is-fullwidth"
        placeholder="e.g. example@example.com"
        label="군 이메일"
      />
      <FormInput
        id="number-army"
        className="is-fullwidth"
        placeholder="e.g.  000-0000"
        label="군 연락처"
      />
      <FormInput
        id="number-phone"
        className="is-fullwidth"
        placeholder="e.g.  010-1111-1111"
        label="휴대폰 번호"
      />
      <hr className="separator" />
      <Button
        className="login-button"
        onClick={register}
        size="medium"
        /*disabled={!passwordValid || !usernameAvailable}*/
        /*$button-hover-border-color="orange"*/
      >
        회원가입
      </Button>
    </div>
  );
}
