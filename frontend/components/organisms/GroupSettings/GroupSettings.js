import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import R from 'ramda';

import { Tabs } from '@mui/material';
import { Tab } from '@mui/material';
import { Box } from '@mui/material';

import TabPanel from '_molecules/TabPanel';
import GroupMember from '_molecules/GroupMember';

export default function GroupSettings() {
  const { user } = useSelector(R.pick(['user']));
  const { group } = useSelector(R.pick(['group']));
  //그룹이 A > B > C > D 있을 때
  // A -> B -> C -> D 순회하면서 어디서부터 admin인지 체크
  //만약 B부터 admin이라고 치면 B, C, D를 array에 넣기
  //B의 그룹원 렌더링
  //C의 그룹원 렌더링
  //D의 그룹원 렌더링
  //특정 그룹원의 권한 바꾸기 (일반 그룹원 / 그룹 관리자 / 보안 관리자) -> update group

  const [tabNumber, setTabNumber] = React.useState(0);

  const handleChange = (event, newValue) => {
    setTabNumber(newValue);
  };

  const mapGroupMember = (members) =>
    members.map((i) => <GroupMember name={i.name} rank={i.rank} division={i.division} title={i.title} status={i.status} admin={i.admin} />);

  const mapTabPanel = (groups) =>
    groups.map((i, index) => (
      <TabPanel value={tabNumber} index={index} className="tabpanel">
        <div className="tabpanel-title">그룹원</div>
        {mapGroupMember(i.members)}
      </TabPanel>
    ));

  const mapTab = (groups) =>
    groups.map((i) => <Tab label={i.title} />);

  const dummymembers = [{
    name: '최우혁',
    rank: '일병',
    division: '31사단 95여단',
    title: 'TOD운용병',
    status: 'active',
    admin: 'admin',
  },
  {
    name: '조나단',
    rank: '일병',
    division: '1사단 22여단',
    title: '팀장',
    status: 'active',
    admin: 'admin',
  },
  {
    name: '김태원',
    rank: '일병',
    division: '2사단 33여단',
    title: '프론트엔드',
    status: '비활성',
    admin: '그룹원',
  },
  ];
  const dummygroups = [
    { title: "00사단", members: dummymembers },
    { title: "00연대", members: [...dummymembers, ...dummymembers] },
    { title: "인사과", members: [...dummymembers, ...dummymembers, ...dummymembers] },
  ];
  return (
    <Box className="tabs-container">
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs
          value={tabNumber}
          onChange={handleChange}
          TabIndicatorProps={{ style: { background: 'black' } }}
          variant="scrollable"
          scrollButtons="auto"
        >
          {mapTab([...dummygroups,...dummygroups,...dummygroups,])}
        </Tabs>
      </Box>
      {mapTabPanel([...dummygroups,...dummygroups,...dummygroups,])}
    </Box>
  );
}
