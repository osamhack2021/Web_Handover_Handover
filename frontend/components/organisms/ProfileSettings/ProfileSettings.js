import { Box, Container, Stack } from '@mui/material';
import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import ListSubheader from '@mui/material/ListSubheader';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import TextField from '@mui/material/TextField';
import Tooltip from '@mui/material/Tooltip';
import R from 'ramda';
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import TabPanel from '_molecules/TabPanel';
import { attemptUpdateUser } from '_thunks/user';
import { validatePassword } from '_utils/validation';

export default function ProfileSettings() {
  const dispatch = useDispatch();

  const { user } = useSelector(R.pick(['user']));

  const [tabNumber, setTabNumber] = useState(0);
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [rank, setRank] = useState(user.rank);
  const [status, setStatus] = useState(user.status);
  const [title, setTitle] = useState(user.title);
  const [email, setEmail] = useState(user.email);
  const [militaryTel, setMilitaryTel] = useState(user.tel.military);
  const [mobileTel, setMobileTel] = useState(user.tel.mobile);
  const [profileImageUrl, setProfileImageUrl] = useState(user.profileImageUrl);

  const handleChange = (event, newValue) => {
    setTabNumber(newValue);
  };

  // Password validation error states
  const [passwordMessage, setPasswordMessage] = useState('');
  const [passwordValid, setPasswordValid] = useState(false);

  // Password confirmation validation error states
  const [passwordConfirmMessage, setPasswordConfirmMessage] = useState('');
  const [passwordConfirmValid, setPasswordConfirmValid] = useState(false);

  const checkPassword = (newServiceNumber, newPassword) => {
    const { valid, message } = validatePassword(newServiceNumber, newPassword);

    setPasswordValid(valid);
    setPasswordMessage(message);
  };

  const checkPasswordConfirm = (newPasswordConfirm) => {
    const valid = newPasswordConfirm === password;

    setPasswordConfirmValid(valid);
    setPasswordConfirmMessage(
      valid ? '비밀번호가 일치합니다' : '비밀번호가 일치하지 않습니다',
    );
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    checkPassword('', e.target.value);
  };

  const handlePasswordConfirmChange = (e) => {
    setPasswordConfirm(e.target.value);
    checkPasswordConfirm(e.target.value);
  };

  const handleInputChange = (event, setter) => {
    setter(event.target.value);
  };

  const mapMenuItem = (item) => item.map((i, index) => (
    <MenuItem value={i} key={index}>
      {i}
    </MenuItem>
  ));

  const isInputValid = () => {
    const isPasswordValid = password.length > 1 && passwordValid;
    const isPasswordConfirmValid = passwordConfirm.length > 1 && passwordConfirmValid;
    const isRankValid = rank.length > 1;
    const isStatusValid = status.length > 1;
    const isTitleValid = title.length > 1;
    const isEmailValid = email.length > 1;
    const isMilitaryTelValid = militaryTel.length > 1;
    const isMobileTelValid = mobileTel.length > 1;
    return (
      isPasswordValid
      && isPasswordConfirmValid
      && isRankValid
      && isStatusValid
      && isTitleValid
      && isEmailValid
      && isMilitaryTelValid
      && isMobileTelValid
    );
  };

  const update = () => {
    if (passwordValid) {
      const updatedUser = {
        name: user.name,
        password,
        rank,
        title,
        email,
        tel: {
          military: militaryTel,
          mobile: mobileTel,
        },
        profileImageUrl,
      };
      console.log(updatedUser);
      dispatch(attemptUpdateUser(updatedUser)).catch(R.identity);
    }
  };

  return (
    <Container
      width="md"
      sx={{
        paddingTop: '50px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      }}
    >
      <Stack direction="row" spacing={4}>
        <img
          className="profile-image"
          width="200px"
          height="200px"
          src={user.profileImageUrl || '/images/profile-default.jpg'}
          alt="profile"
        />
        <Stack direction="row" spacing={2}>
          <Stack width="40%">
            <TextField
              fullWidth
              id="input-profileImageUrl"
              label="프로필 사진"
              value={profileImageUrl}
              onChange={(event) => handleInputChange(event, setProfileImageUrl)}
              placeholder="프로필 사진의 링크를 입력해주세요"
              margin="normal"
            />
            <FormControl fullWidth margin="normal">
              <InputLabel htmlFor="select-rank">계급/등급</InputLabel>
              <Select
                defaultValue={user.rank}
                id="select-rank"
                label="계급/등급"
                onChange={(event) => handleInputChange(event, setRank)}
              >
                <MenuItem value="" disabled>
                  선택
                </MenuItem>
                <ListSubheader>장교</ListSubheader>
                {mapMenuItem([
                  '대장',
                  '중상',
                  '소장',
                  '준장',
                  '대령',
                  '중령',
                  '소령',
                  '대위',
                  '중위',
                  '소위',
                ])}
                <ListSubheader>부사관</ListSubheader>
                {mapMenuItem(['준위', '원사', '상사', '중사', '하사'])}
                <ListSubheader>용사</ListSubheader>
                {mapMenuItem(['병장', '상병', '일병', '이등병'])}
                <ListSubheader>군무원</ListSubheader>
                {mapMenuItem([
                  '군무원 1급',
                  '군무원 2급',
                  '군무원 3급',
                  '군무원 4급',
                  '군무원 5급',
                  '군무원 6급',
                  '군무원 7급',
                  '군무원 8급',
                  '군무원 9급',
                  '군무원 10급',
                ])}
                <ListSubheader>공무원</ListSubheader>
                {mapMenuItem([
                  '공무원 1급',
                  '공무원 2급',
                  '공무원 3급',
                  '공무원 4급',
                  '공무원 5급',
                  '공무원 6급',
                  '공무원 7급',
                  '공무원 8급',
                  '공무원 9급',
                  '공무원 10급',
                ])}
              </Select>
            </FormControl>
            <FormControl fullWidth margin="normal">
              <InputLabel htmlFor="select-rank">계정 상태</InputLabel>
              <Select
                defaultValue={user.status}
                id="select-status"
                label="계정 상태"
                onChange={(event) => handleInputChange(event, setStatus)}
              >
                <MenuItem value="" disabled>
                  선택
                </MenuItem>
                <MenuItem value="active">활성</MenuItem>
                <MenuItem value="inactive">비활성</MenuItem>
                <MenuItem value="retired">전역</MenuItem>
              </Select>
            </FormControl>
            <TextField
              fullWidth
              id="input-password"
              label="비밀번호"
              type="password"
              value={password}
              onChange={handlePasswordChange}
              margin="normal"
              color={password ? (passwordValid ? 'success' : 'error') : ''}
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
                passwordConfirm
                  ? passwordConfirmValid
                    ? 'success'
                    : 'error'
                  : ''
              }
              error={passwordConfirm.length > 1 && !passwordConfirmValid}
              helperText={passwordConfirmMessage}
            />

          </Stack>
          <Stack width="40%">
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
              placeholder="010-0000-0000"
              value={mobileTel}
              onChange={(event) => handleInputChange(event, setMobileTel)}
              margin="normal"
            />
          </Stack>
        </Stack>
      </Stack>
      <Tooltip
        title={isInputValid() ? '' : '필수 정보를 모두 입력해주세요'}
        placement="bottom"
      >
        <span style={{ width: '70%', marginTop: '50px' }}>
          <Button
            className="profile-setting-button"
            fullWidth
            variant="contained"
            size="large"
            disabled={!isInputValid()}
            onClick={update}
          >
            프로필 수정
          </Button>
        </span>
      </Tooltip>
    </Container>
  );
}
