import React from 'react';
import { Tabs } from '@mui/material';
import { Tab } from '@mui/material';
import { Box } from '@mui/material';

import Button from "react-bulma-companion/lib/Button";

import TabPanel from '_molecules/TabPanel';
import ItemSelect from '_molecules/ItemSelect';
import FormInput from '_molecules/FormInput';

export default function ProfileSettings() {
  const [value, setValue] = React.useState(0);
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  const dummyitems = [
    {
      _id: 1,
      value: 'a',
    },
    {
      _id: 2,
      value: 'b',
    },
    {
      _id: 3,
      value: 'c',
    },
    {
      _id: 4,
      value: 'd',
    },
  ];

  return (
    <Box className="tabs-container">
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={value} onChange={handleChange} aria-label="basic tabs example" TabIndicatorProps={{style: {background:'black'}}} variant="fullWidth" >
          <Tab label="프로필 정보 수정" />
          <Tab label="비밀번호 변경" />
          <Tab label="추가 옵션" />
        </Tabs>
      </Box>
      <TabPanel value={value} index={0} className="tabpanel">
        <ItemSelect items={dummyitems} label="계급" />
        <ItemSelect items={dummyitems} label="계정 상태" />
        <ItemSelect items={dummyitems} label="회원 분류" />
        <div className="forminput-container">
          <FormInput placeholder="연락처를 입력해주세요" label="연락처" className="is-fullwidth" />
          <FormInput placeholder="이메일을 입력해주세요" label="이메일" className="is-fullwidth" /> 
        </div>
        <Button className="profile-button mt-5" size="medium">
          프로필 수정
        </Button>
      </TabPanel>
      <TabPanel value={value} index={1} className="tabpanel">
        <div className="forminput-container">
          <FormInput label="현재 비밀번호" className="is-fullwidth" type="password" />
          <FormInput label="새로운 비밀번호" className="is-fullwidth" type="password" />
          <FormInput label="새로운 비밀번호 확인" className="is-fullwidth" type="password" />
        </div>
        <Button className="profile-button mt-5" size="medium">
          비밀번호 변경
        </Button>
      </TabPanel>
      <TabPanel value={value} index={2} className="tabpanel">
        세 번째 페이지
      </TabPanel>
    </Box>
  );
}