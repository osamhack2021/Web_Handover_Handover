import React from 'react';
import { Tabs } from '@mui/material';
import { Tab } from '@mui/material';
import { Box } from '@mui/material';

import TabPanel from '_molecules/TabPanel';
import GroupMember from '_molecules/GroupMember';

export default function ProfileSettings() {
  const [value, setValue] = React.useState(0);
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Box className="tabs-container">
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={value} onChange={handleChange} aria-label="basic tabs example" TabIndicatorProps={{style: {background:'black'}}} variant="fullWidth" >
          <Tab label="00사단" />
          <Tab label="00연대" />
          <Tab label="인사과" />
        </Tabs>
      </Box>
      <TabPanel value={value} index={0} className="tabpanel">
        <div className="tabpanel-title"> 그룹원 </div>
        <GroupMember name="최우혁" rank="일병" division="31사단 95여단" title="대형차량운용병" status="active" admin="admin" />
        <GroupMember name="조나단" rank="병장" division="1사단 22여단" title="팀장" status="active" admin="관리자" />
        <GroupMember name="김태원" rank="상병" division="2사단 33여단" title="프론트엔드" status="비활성" admin="그룹원" />
        <GroupMember name="오지환" rank="이병" division="3사단 44여단" title="백엔드" status="active" admin="그룹원" />
        <GroupMember name="안수겸" rank="상병" division="4사단 55여단" title="디자인" status="active" admin="그룹원" />
        <GroupMember name="박현준" rank="병장" division="5사단 66여단" title="백엔드" status="active" admin="admin" />
        <GroupMember name="박현준" rank="병장" division="5사단 66여단" title="백엔드" status="active" admin="admin" />
        <GroupMember name="박현준" rank="병장" division="5사단 66여단" title="백엔드" status="active" admin="admin" />
        <GroupMember name="박현준" rank="병장" division="5사단 66여단" title="백엔드" status="active" admin="admin" />
        <GroupMember name="박현준" rank="병장" division="5사단 66여단" title="백엔드" status="active" admin="admin" />
        <GroupMember name="박현준" rank="병장" division="5사단 66여단" title="백엔드" status="active" admin="admin" />
        <GroupMember name="박현준" rank="병장" division="5사단 66여단" title="백엔드" status="active" admin="admin" />

      </TabPanel>
      <TabPanel value={value} index={1} className="tabpanel">
        2
      </TabPanel>
      <TabPanel value={value} index={2} className="tabpanel">
        세 번째 페이지3333
      </TabPanel>
    </Box>
  );
}
