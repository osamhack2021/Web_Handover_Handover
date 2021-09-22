import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import R from "ramda";

import { faUser } from "@fortawesome/free-solid-svg-icons/faUser";
import { faLock } from "@fortawesome/free-solid-svg-icons/faLock";

import Box from "react-bulma-companion/lib/Box";
import Block from "react-bulma-companion/lib/Block";
import Title from "react-bulma-companion/lib/Title";
import Control from "react-bulma-companion/lib/Control";
import Button from "react-bulma-companion/lib/Button";
import Checkbox from "react-bulma-companion/lib/Checkbox";

import useKeyPress from "_hooks/useKeyPress";
import { attemptLogin } from "_thunks/auth";
import FormInput from "_molecules/FormInput";

export default function Login() {
  const dispatch = useDispatch();

  const [remember, setRemember] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    const username = localStorage.getItem("username");
    if (username) {
      setRemember(true);
      setUsername(username);
    }
  }, []);

  const login = () => {
    const userCredentials = { username, password };

    if (remember) {
      localStorage.setItem("username", username);
    }

    dispatch(attemptLogin(userCredentials)).catch(R.identity);
  };

  useKeyPress("Enter", login);

  const rememberMe = () => {
    localStorage.removeItem("username");
    setRemember(!remember);
  };

  const updateUsername = (e) => setUsername(e.target.value);
  const updatePassword = (e) => setPassword(e.target.value);

  return (
    <div className="login-box">
      <div className="login-logo mx-auto"></div>
      <Block className="login-title">로그인</Block>
      <div className="login-subtitle">Welcome back!</div>
      <hr className="separator" />
      <div className="login-label">군번</div>
      <FormInput
        onChange={updateUsername}
        placeholder="군번을 입력하세요"
        value={username}
        className="login-input is-fullwidth"
        size="medium"
      />
      <div className="login-label">Password</div>
      <FormInput
        onChange={updatePassword}
        placeholder="비밀번호를 입력하세요"
        value={password}
        type="password"
        className="login-input is-fullwidth"
      />
      <Button
        className="login-button my-5"
        onClick={login}
        size="medium"
        $button-hover-border-color="orange"
      >
        Sign in
      </Button>
      <Block className="login-register">
        <Link to="/recovery" className="login-link">
          Forgot password
        </Link>
      </Block>
      <Block className="login-register">
        Don't have an account?&nbsp;
        <Link to="/register" className="login-link">
          Sign up
        </Link>
      </Block>
    </div>
  );
}
