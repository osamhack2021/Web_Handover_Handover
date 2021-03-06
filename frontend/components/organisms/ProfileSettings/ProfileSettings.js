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
      valid ? '??????????????? ???????????????' : '??????????????? ???????????? ????????????',
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
              label="????????? ??????"
              value={profileImageUrl}
              onChange={(event) => handleInputChange(event, setProfileImageUrl)}
              placeholder="????????? ????????? ????????? ??????????????????"
              margin="normal"
            />
            <FormControl fullWidth margin="normal">
              <InputLabel htmlFor="select-rank">??????/??????</InputLabel>
              <Select
                defaultValue={user.rank}
                id="select-rank"
                label="??????/??????"
                onChange={(event) => handleInputChange(event, setRank)}
              >
                <MenuItem value="" disabled>
                  ??????
                </MenuItem>
                <ListSubheader>??????</ListSubheader>
                {mapMenuItem([
                  '??????',
                  '??????',
                  '??????',
                  '??????',
                  '??????',
                  '??????',
                  '??????',
                  '??????',
                  '??????',
                  '??????',
                ])}
                <ListSubheader>?????????</ListSubheader>
                {mapMenuItem(['??????', '??????', '??????', '??????', '??????'])}
                <ListSubheader>??????</ListSubheader>
                {mapMenuItem(['??????', '??????', '??????', '?????????'])}
                <ListSubheader>?????????</ListSubheader>
                {mapMenuItem([
                  '????????? 1???',
                  '????????? 2???',
                  '????????? 3???',
                  '????????? 4???',
                  '????????? 5???',
                  '????????? 6???',
                  '????????? 7???',
                  '????????? 8???',
                  '????????? 9???',
                  '????????? 10???',
                ])}
                <ListSubheader>?????????</ListSubheader>
                {mapMenuItem([
                  '????????? 1???',
                  '????????? 2???',
                  '????????? 3???',
                  '????????? 4???',
                  '????????? 5???',
                  '????????? 6???',
                  '????????? 7???',
                  '????????? 8???',
                  '????????? 9???',
                  '????????? 10???',
                ])}
              </Select>
            </FormControl>
            <FormControl fullWidth margin="normal">
              <InputLabel htmlFor="select-rank">?????? ??????</InputLabel>
              <Select
                defaultValue={user.status}
                id="select-status"
                label="?????? ??????"
                onChange={(event) => handleInputChange(event, setStatus)}
              >
                <MenuItem value="" disabled>
                  ??????
                </MenuItem>
                <MenuItem value="active">??????</MenuItem>
                <MenuItem value="inactive">?????????</MenuItem>
                <MenuItem value="retired">??????</MenuItem>
              </Select>
            </FormControl>
            <TextField
              fullWidth
              id="input-password"
              label="????????????"
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
              label="???????????? ??????"
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
              label="?????????"
              placeholder="?????? ?????????, ?????????, ..."
              value={title}
              onChange={(event) => handleInputChange(event, setTitle)}
              margin="normal"
            />
            <TextField
              fullWidth
              id="input-email"
              label="??? ?????????"
              type="email"
              placeholder="example@mnd.mil" // TODO: Add email format validation
              value={email}
              onChange={(event) => handleInputChange(event, setEmail)}
              margin="normal"
            />
            <TextField
              fullWidth
              id="input-tel-military"
              label="??? ????????????"
              type="tel"
              placeholder="000-0000" // TODO: Add phone number validation
              value={militaryTel}
              onChange={(event) => handleInputChange(event, setMilitaryTel)}
              margin="normal"
            />
            <TextField
              fullWidth
              id="input-tel-mobile"
              label="????????? ????????????"
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
        title={isInputValid() ? '' : '?????? ????????? ?????? ??????????????????'}
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
            ????????? ??????
          </Button>
        </span>
      </Tooltip>
    </Container>
  );
}
