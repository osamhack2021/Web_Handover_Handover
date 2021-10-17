import LoadingButton from "@mui/lab/LoadingButton";
import Container from "@mui/material/Container";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import ListSubheader from "@mui/material/ListSubheader";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import TextField from "@mui/material/TextField";
import Tooltip from "@mui/material/Tooltip";
import R from "ramda";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { attemptRegister } from "_thunks/auth";
import { validatePassword, validateServiceNumber } from "_utils/validation";




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
  const [serviceNumber, setServiceNumber] = useState("");
  const [name, setName] = useState("홍길동");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [rank, setRank] = useState("");
  const [title, setTitle] = useState("인사담당관");
  const [email, setEmail] = useState("hong@army.mil");
  const [militaryTel, setMilitaryTel] = useState("123-1234");
  const [mobileTel, setMobileTel] = useState("010-1234-1234");

  // ServiceNumber validation error states
  const [serviceNumberMessage, setServiceNumberMessage] = useState("");
  const [serviceNumberAvailable, setServiceNumberAvailable] = useState(false);

  // Password validation error states
  const [passwordMessage, setPasswordMessage] = useState("");
  const [passwordValid, setPasswordValid] = useState(false);

  // Password confirmation validation error states
  const [passwordConfirmMessage, setPasswordConfirmMessage] = useState("");
  const [passwordConfirmValid, setPasswordConfirmValid] = useState(false);

  // Register POST request status states
  const [registerStatus, setRegisterStatus] = useState("");
  const [registerMessage, setRegisterMessage] = useState("");

  const checkPassword = (newServiceNumber, newPassword) => {
    const { valid, message } = validatePassword(newServiceNumber, newPassword);

    setPasswordValid(valid);
    setPasswordMessage(message);
  };

  const checkPasswordConfirm = (newPasswordConfirm) => {
    const valid = newPasswordConfirm === password;

    setPasswordConfirmValid(valid);
    setPasswordConfirmMessage(
      valid ? "비밀번호가 일치합니다" : "비밀번호가 일치하지 않습니다"
    );
  };

  const checkServiceNumber = (newServiceNumber) => {
    const { valid, message } = validateServiceNumber(newServiceNumber);

    if (valid) {
      setServiceNumberMessage("군번 확인중입니다...");
      setServiceNumberAvailable("loading");

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
      }, 250);
    } else {
      setServiceNumberAvailable(valid);
      setServiceNumberMessage(message);
    }
  };

  const handleServiceNumberChange = (e) => {
    setServiceNumber(e.target.value);
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
    setter(event.target.value);
  };

  const register = () => {
    if (serviceNumberAvailable && passwordValid) {
      const newUser = {
        serviceNumber: serviceNumber,
        name: name,
        password: password,
        rank: rank,
        title: title,
        email: email,
        tel: {
          military: militaryTel,
          mobile: mobileTel,
        },
      };

      dispatch(attemptRegister(newUser)).catch(R.identity);
    }
  };

  // Creates list of MenuItem components for select input
  const mapMenuItem = (item) =>
    item.map((i) => <MenuItem value={i}>{i}</MenuItem>);

  const isInputValid = () => {
    const isServiceNumberValid =
      serviceNumber.length > 1 && serviceNumberAvailable;
    const isPasswordValid = password.length > 1 && passwordValid;
    const isPasswordConfirmValid =
      passwordConfirm.length > 1 && passwordConfirmValid;
    const isNameValid = name.length > 1;
    const isRankValid = rank.length > 1;
    const isTitleValid = title.length > 1;
    const isEmailValid = email.length > 1;
    console.log(rank);
    return (
      isServiceNumberValid &&
      isPasswordValid &&
      isPasswordConfirmValid &&
      isNameValid &&
      isRankValid &&
      isTitleValid &&
      isEmailValid
    );
  };

  return (
    <Container maxWidth="md">
      <div className="login-logo mx-auto" />
      <div className="login-title">회원가입</div>
      <div className="login-subtitle">환영합니다!</div>
      <div>
        <TextField
          fullWidth
          id="input-service-number"
          label="군번"
          value={serviceNumber}
          onChange={handleServiceNumberChange}
          margin="normal"
          color={
            serviceNumber
              ? serviceNumberAvailable === "loading"
                ? "warning" // warning color while checking for availability
                : serviceNumberAvailable
                ? "success"
                : "error" // danger color when serviceName is unavailable
              : "" // no color on empty string
          }
          error={serviceNumber.length > 1 && !serviceNumberAvailable}
          helperText={serviceNumberMessage}
        />
        <TextField
          fullWidth
          id="input-password"
          label="비밀번호"
          type="password"
          value={password}
          onChange={handlePasswordChange}
          margin="normal"
          color={password ? (passwordValid ? "success" : "error") : ""}
          error={password.length > 1 && !passwordValid}
          helperText={passwordMessage}
        />
        <TextField
          fullWidth
          id="input-password-check"
          label="비밀번호 확인"
          type="password"
          value={passwordConfirm}
          onChange={handlePasswordConfirmChange}
          margin="normal"
          color={
            passwordConfirm ? (passwordConfirmValid ? "success" : "error") : ""
          }
          error={passwordConfirm.length > 1 && !passwordConfirmValid}
          helperText={passwordConfirmMessage}
        />
        <TextField
          fullWidth
          id="input-name"
          label="이름"
          value={name}
          onChange={(event) => handleInputChange(event, setName)}
          margin="normal"
        />
        <FormControl fullWidth margin="normal">
          <InputLabel htmlFor="select-rank">계급/등급</InputLabel>
          <Select defaultValue="" id="select-rank" label="계급/등급" onChange={(event) => handleInputChange(event, setRank)}>
            <MenuItem value="" disabled={true}>
              선택
            </MenuItem>
            <ListSubheader>장교</ListSubheader>
            {mapMenuItem([
              "대장",
              "중상",
              "소장",
              "준장",
              "대령",
              "중령",
              "소령",
              "대위",
              "중위",
              "소위",
            ])}
            <ListSubheader>부사관</ListSubheader>
            {mapMenuItem(["준위", "원사", "상사", "중사", "하사"])}
            <ListSubheader>용사</ListSubheader>
            {mapMenuItem(["병장", "상병", "일병", "이등병"])}
            <ListSubheader>군무원</ListSubheader>
            {mapMenuItem([
              "군무원 1급",
              "군무원 2급",
              "군무원 3급",
              "군무원 4급",
              "군무원 5급",
              "군무원 6급",
              "군무원 7급",
              "군무원 8급",
              "군무원 9급",
              "군무원 10급",
            ])}
            <ListSubheader>공무원</ListSubheader>
            {mapMenuItem([
              "공무원 1급",
              "공무원 2급",
              "공무원 3급",
              "공무원 4급",
              "공무원 5급",
              "공무원 6급",
              "공무원 7급",
              "공무원 8급",
              "공무원 9급",
              "공무원 10급",
            ])}
          </Select>
        </FormControl>
        <TextField
          fullWidth
          id="input-title"
          label="직무명"
          placeholder="인사 담당관, 대대장, ..."
          value={title}
          onChange={(event) => handleInputChange(event, setTitle)}
          margin="normal"
        />
        <TextField
          fullWidth
          id="input-email"
          label="군 이메일"
          type="email"
          placeholder="example@mnd.mil" // TODO: Add email format validation
          value={email}
          onChange={(event) => handleInputChange(event, setEmail)}
          margin="normal"
        />
        <TextField
          fullWidth
          id="input-tel-military"
          label="군 전화번호"
          type="tel"
          placeholder="000-0000" // TODO: Add phone number validation
          value={militaryTel}
          onChange={(event) => handleInputChange(event, setMilitaryTel)}
          margin="normal"
        />
        <TextField
          fullWidth
          id="input-tel-mobile"
          label="휴대폰 전화번호"
          type="tel"
          placeholder="010-0000-0000" // TODO: Add phone number validation
          value={mobileTel}
          onChange={(event) => handleInputChange(event, setMobileTel)}
          margin="normal"
        />
      </div>

      {/* Register button with tooltip */}
      <Tooltip
        title={isInputValid() ? "" : "필수 정보를 모두 입력해주세요"}
        placement="bottom"
      >
        <span style={{ width: "100%" }}>
          <LoadingButton
            sx={{ mt: 2 }}
            fullWidth
            disabled={!isInputValid()}
            loading={registerStatus === "loading"}
            onClick={register}
            margin="normal"
            variant="contained"
            size="large"
          >
            회원가입
          </LoadingButton>
        </span>
      </Tooltip>
    </Container>
  );
}
