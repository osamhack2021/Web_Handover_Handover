import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from 'react-redux';
import R from 'ramda';

import { Tabs } from '@mui/material';
import { Tab } from '@mui/material';
import { Box } from '@mui/material';

import TabPanel from '_molecules/TabPanel';
import GroupMember from '_molecules/GroupMember';
import { getGroupByGroupId, searchGroupByAdmin } from "_api/group";
import { searchUserByGroupId } from "_api/user";

export default function GroupSettings() {
  const { user } = useSelector(R.pick(['user']));
  const { group } = useSelector(R.pick(['group']));

  const [managingGroup, setManagingGroup] = useState(null);
  const [managingMembers, setManagingMembers] = useState([]); // Nested array composed of members of each managing group.

  // Get managing groups
  useEffect(() => {
    searchGroupByAdmin(user.Id)
      .then(result => setManagingGroup(result));
  }, [user]);

  // Get group members of each groups after managing groups are fetched & Set division and admin field of each members
  useEffect(() => {
    if (managingGroup != null) {
      managingGroup.forEach((group) => {
        let adminIdArray = [];
        let inspectorIdArray = [];
        getGroupByGroupId(group._id).then(result => {
          result.admins.forEach(admin => adminIdArray.push(admin._id));
          result.inspectors.forEach(inspector => inspectorIdArray.push(inspector._id));
        })
        searchUserByGroupId(group._id).then(result => {
          result.forEach((member) => {
            // member.admin : 그룹에서 admin이면 admin, inspector이면 inspector, 둘 다 아니면 member (필드 이름 수정이 필요..) 
            member.admin = (adminIdArray.includes(member._id)) ? "admin" : (inspectorIdArray.includes(member._id) ? "inspector" : "member");
            getGroupByGroupId(member.group).then((group) => { member.division = group.name }); // Set member's division (정의가 안되는 중..)
          })
          setManagingMembers([...managingMembers, result])
        });
      });
    }
  }, [managingGroup]);

  const [tabNumber, setTabNumber] = React.useState(0);

  const handleChange = (event, newValue) => {
    setTabNumber(newValue);
  };

  const mapGroupMember = (members) => {
    return members.map((member) => {
      console.log("member: " + JSON.stringify(member));
      console.log(member.division); // I'm not sure why member.division is output as undefined.. 😢
      return <GroupMember name={member.name} rank={member.rank} title={member.title} status={member.status} division={member.division} admin={member.admin} />
    });
  }

  const mapTabPanel = (membersArray) =>
    membersArray.map((members, index) => (
      <TabPanel value={tabNumber} index={index} className="tabpanel">
        <div className="tabpanel-title">그룹원</div>
        {mapGroupMember(members)}
      </TabPanel>
    ));

  const mapTab = (groups) =>
    groups.map((i) => <Tab label={i.name} />);

  return managingGroup == null ? ("Loading...") : (
    <Box className="tabs-container">
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs
          value={tabNumber}
          onChange={handleChange}
          TabIndicatorProps={{ style: { background: 'black' } }}
          variant="scrollable"
          scrollButtons="auto"
        >
          {mapTab(managingGroup)}
        </Tabs>
      </Box>
      {mapTabPanel(managingMembers)}
    </Box>
  );
}
