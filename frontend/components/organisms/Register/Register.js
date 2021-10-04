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
import { postCheckServiceNumber } from "_api/users";
import { validateServiceNumber, validatePassword } from "_utils/validation";
import { attemptRegister } from "_thunks/auth";

import FormInput from "_molecules/FormInput";

export default function Register() {
  const dispatch = useDispatch();

  // User data from input form
  // API request content would be the following:
  // {
  //   serviceNumber: "18-567182",
  //   name: "홍길동",
  //   password: "password",
  //   rank: "중사",
  //   title: "인사담당관",
  //   email: "hong@army.mil",      // optional
  //   tel: {                       // optional
  //     military: "000-000-0000",
  //     mobile: "000-0000-0000"
  //   }
  // }
  const [serviceNumber, setServiceNumber]     = useState("12-121212");
  const [name, setName]                       = useState("홍길동");
  const [password, setPassword]               = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [rank, setRank]                       = useState("중사");
  const [title, setTitle]                     = useState("인사담당관");
  const [email, setEmail]                     = useState("hong@army.mil");
  const [militaryTel, setMilitaryTel]         = useState("123-1234");
  const [mobileTel, setMobileTel]             = useState("010-1234-1234");

  // ServiceNumber validation error states
  const [serviceNumberMessage, setServiceNumberMessage] = useState("");
  const [serviceNumberAvailable, setServiceNumberAvailable] = useState(false);

  // Password validation error states
  const [passwordMessage, setPasswordMessage] = useState("");
  const [passwordValid, setPasswordValid] = useState(false);

  // Password confirmation validation error states
  const [passwordConfirmMessage, setPasswordConfirmMessage] = useState("");
  const [passwordConfirmValid, setPasswordConfirmValid] = useState(false);

  const checkPassword = (newServiceNumber, newPassword) => {
    const { valid, message } = validatePassword(newServiceNumber, newPassword);

    setPasswordValid(valid);
    setPasswordMessage(message);
  };

  const checkPasswordConfirm = (newPasswordConfirm) => {
    const valid = newPasswordConfirm === password;

    setPasswordConfirmValid(valid);
    setPasswordConfirmMessage(valid ? "비밀번호가 일치합니다" : "비밀번호가 일치하지 않습니다");
  };

  const checkServiceNumber = (newServiceNumber) => {
    const { valid, message } = validateServiceNumber(newServiceNumber);

    if (valid) {
      setServiceNumberMessage("군번 확인중입니다...");
      setServiceNumberAvailable(false);

      // postCheckServiceNumber(newServiceNumber)
      //   .then((res) => {
      //     setServiceNumberAvailable(res.available);
      //     setServiceNumberMessage(res.message);
      //   })
      //   .catch(R.identity);

      // TODO: use code above when service number checking API is implemented
      setTimeout(() => {
        setServiceNumberMessage("가입하실 수 있는 군번입니다");
        setServiceNumberAvailable(true);
      }, 250)
    } else {
      setServiceNumberAvailable(valid);
      setServiceNumberMessage(message);
    }
  };

  const updateServiceNumber = (newUserName) => {
    setServiceNumber(newUserName);
    checkPassword(newUserName, password);
  };

  const handleServiceNumberChange = (e) => {
    updateServiceNumber(e.target.value);
    checkServiceNumber(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    checkPassword(serviceNumber, e.target.value);
  };

  const handlePasswordConfirmChange = (e) => {
    setPasswordConfirm(e.target.value);
    checkPasswordConfirm(e.target.value);
  };

  const handleInputChange = (event, setter) => {
    setter(event.target.value)
  }

  const register = () => {
    if (serviceNumberAvailable && passwordValid) {
      const newUser = {
        "serviceNumber": serviceNumber,
        "name": name,
        "password": password,
        "rank": rank,
        "title": title,
        "email": email,
        "tel": {
          "military": militaryTel,
          "mobile": mobileTel
        },
      };

      dispatch(attemptRegister(newUser)).catch(R.identity);
    }
  };

  useKeyPress("Enter", register);

  return (
    <div className="register-box">
      <div className="login-logo"></div>
      <Block className="login-title">회원가입</Block>
      <div className="login-subtitle">환영합니다!</div>
      <hr className="separator" />
      <div className="forminput-container">
        <FormInput
          id="serviceNumber"
          className="is-fullwidth"
          onChange={handleServiceNumberChange}
          value={serviceNumber}
          placeholder="군번을 입력해주세요"
          label="군번"
          color={
            serviceNumber ? (serviceNumberAvailable ? "success" : "danger") : undefined
          }
          rightIcon={serviceNumberAvailable ? faCheck : faExclamationTriangle}
          inputIsvalid={serviceNumberAvailable}
          helpMessage={serviceNumberMessage}
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
          id="password-check"
          className="is-fullwidth"
          placeholder="비밀번호를 다시 입력해주세요"
          type="password"
          value={passwordConfirm}
          onChange={handlePasswordConfirmChange}
          label="비밀번호 재입력"
          color={passwordConfirm ? (passwordConfirmValid ? "success" : "danger") : undefined}
          rightIcon={passwordConfirmValid ? faCheck : faExclamationTriangle}
          inputIsvalid={passwordConfirmValid}
          helpMessage={passwordConfirmMessage}
        />
        <FormInput
          id="name"
          className="is-fullwidth"
          placeholder="이름을 입력해주세요"
          value={name}
          onChange={event => handleInputChange(event, setName)}
          label="이름"
        />
        <FormInput // TODO: Use dropdown
          id="rank"
          className="is-fullwidth"
          placeholder="e.g. 중사, 상병"
          value={rank}
          onChange={event => handleInputChange(event, setRank)}
          label="계급"
        />
        <FormInput
          id="title"
          className="is-fullwidth"
          placeholder="e.g. 인사 담당관, 대대장"
          value={title}
          onChange={event => handleInputChange(event, setTitle)}
          label="직무명"
        />
        <FormInput
          id="email"
          className="is-fullwidth"
          placeholder="e.g. example@example.com" // TODO: Add email format validation
          value={email}
          onChange={event => handleInputChange(event, setEmail)}
          label="군 이메일"
        />
        <FormInput
          id="tel-military"
          className="is-fullwidth"
          placeholder="e.g. 000-0000" // TODO: Add phone number validation
          value={militaryTel}
          onChange={event => handleInputChange(event, setMilitaryTel)}
          label="군 연락처"
        />
        <FormInput
          id="tel-mobile"
          className="is-fullwidth"
          placeholder="e.g. 010-1111-1111" // TODO: Add phone number validation
          value={mobileTel}
          onChange={event => handleInputChange(event, setMobileTel)}
          label="휴대폰 번호"
        />
      </div>
      <hr className="separator" />
      <Button
        className="login-button"
        onClick={register}
        size="medium"
        /*disabled={!passwordValid || !serviceNumberAvailable}*/
        /*$button-hover-border-color="orange"*/
      >
        회원가입
      </Button>
    </div>
  );
}
