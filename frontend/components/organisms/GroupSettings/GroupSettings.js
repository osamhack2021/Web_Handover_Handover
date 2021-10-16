import { Box, Tab, Tabs } from "@mui/material";
import R from "ramda";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { getGroupByGroupId, searchGroupByAdmin } from "_api/group";
import { searchUserByGroupId } from "_api/user";
import GroupMember from "_molecules/GroupMember";
import TabPanel from "_molecules/TabPanel";

export default function GroupSettings() {
  const { user } = useSelector(R.pick(["user"]));
  const { group } = useSelector(R.pick(["group"]));

  const [managingGroup, setManagingGroup] = useState(null);
  const [managingMembers, setManagingMembers] = useState([]); // Nested array composed of members of each managing group.

  // Get managing groups
  useEffect(() => {
    searchGroupByAdmin(user.Id).then((result) => setManagingGroup(result));
  }, [user]);

  // Get group members of each groups after managing groups are fetched & Set division and admin field of each members
  useEffect(() => {
    if (managingGroup != null) {
      managingGroup.forEach((group) => {
        let adminIdArray = [];
        let inspectorIdArray = [];
        getGroupByGroupId(group._id).then((result) => {
          result.admins.forEach((admin) => 
            adminIdArray.push(admin._id)
          );
          result.inspectors.forEach((inspector) =>
            inspectorIdArray.push(inspector._id)
          );
        });
        searchUserByGroupId(group._id).then((result) => {
          let users = result;
          users.forEach((user, index) => {
            // user.type : 그룹에서 admin이면 'admin', inspector이면 'inspector', 둘 다 아니면 'member'
            users[index].type = adminIdArray.includes(user._id)
              ? "admin"
              : inspectorIdArray.includes(user._id)
              ? "inspector"
              : "member";

            // The following can be used to get user's group name, but it's not necessary for now.
            // The reason why member.division is undefined is because getGroupByGroupId() is an async request.
            // `setManagingMembers` won't contain the 'division' field because it is invocated before the 
            // respond of the request is recieved.
            // getGroupByGroupId(user.group).then((group) => {
            //   users[index].division = group.name;
            // }); 
          });
          setManagingMembers([...managingMembers, users]);
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
      return (
        <GroupMember
          profileImageUrl={member.profileImageUrl}
          name={member.name}
          rank={member.rank}
          title={member.title}
          status={member.status}
          // division={member.division}
          type={member.type}
        />
      );
    });
  };

  const mapTabPanel = (membersArray) =>
    membersArray.map((members, index) => (
      <TabPanel value={tabNumber} index={index} className="tabpanel">
        <div className="tabpanel-title">그룹원</div>
        {mapGroupMember(members)}
      </TabPanel>
    ));

  const mapTab = (groups) => groups.map((i) => <Tab label={i.name} />);

  return managingGroup == null ? (
    "Loading..."
  ) : (
    <Box className="tabs-container">
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs
          value={tabNumber}
          onChange={handleChange}
          TabIndicatorProps={{ style: { background: "black" } }}
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
