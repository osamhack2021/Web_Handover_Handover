import React, { useEffect, useState } from "react";
import { Switch, Route, useLocation, Redirect } from "react-router";
import { useParams } from "react-router";
import R from "ramda";
import { push } from "connected-react-router";

import Profile from "_organisms/Profile";
import UserItems from "_organisms/UserItems";

import Tabs from "@mui/material/Tabs";
import Badge from "@mui/material/Badge";
import ButtonBase from "@mui/material/ButtonBase";
import Tab from "@mui/material/Tab";
import Tooltip from "@mui/material/Tooltip";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import Icon from "@mdi/react";
import { mdiPencil } from "@mdi/js";

import User from "_assets/svgs/user.svg";
import { useDispatch, useSelector } from "react-redux";
import { getUser } from "_frontend/api/user";
import { getGroupByGroupId } from "_frontend/api/group";
import { getItemByUserId } from "_frontend/api/item";
import Avatar from "@mui/material/Avatar";
import { Link } from "react-router-dom";
import { LinkComponent } from "_frontend/components/atoms/LinkComponent/LinkComponent";

export default function ProfilePage() {
  // const dispatch = useDispatch();
  const location = useLocation();

  // Attempt to get current user
  // Should work since ProfilePage is only accessble when logged in
  const userId = useParams().hasOwnProperty("userId")
    ? useParams().userId // userId from URL params (/user/:userId)
    : useSelector(R.pick(["user"])).user.Id; // userId from redux state (/account)

  // Base URL to redirect with tab selection
  const baseURL = location.pathname.replace("/items", "");

  const [user, setUser] = useState(null);
  const [group, setGroup] = useState(null);
  const [userItem, setUserItem] = useState(null);

  // Get user information
  useEffect(() => {
    getUser(userId).then((data) => {
      setUser(data);
    });
  }, []);

  // Get group information after user information is fetched
  useEffect(() => {
    if (user != null) {
      getGroupByGroupId(user.group).then((data) => {
        setGroup(data);
      });
    }
  }, [user]);

  // Get user item information on /items
  useEffect(() => {
    if (location.pathname.endsWith("/items")) {
      getItemByUserId(userId).then((data) => {
        setUserItem(data);
        console.log("userItem = " + JSON.stringify(data));
      });
    }
  }, [location]);

  const [tabIndex, setTabIndex] = useState(
    location.pathname.endsWith("/items") ? 1 : 0
  );

  const handleChange = (event, newValue) => {
    setTabIndex(newValue);
  };

  return (
    <Box sx={{ width: "100%" }}>
      <Stack direction="row" sx={{ p: 4 }}>
        <Tooltip title={baseURL.endsWith("/account") ? "프로필 사진 변경" : ""} arrow>
          <Avatar
            component={ButtonBase}
            src={
              user == null || user.profileImageUrl == null
                ? "/images/default-profile.png"
                : user.profileImageUrl
            }
            sx={{ width: 120, height: 120, border: "1px solid #0002" }}
          />
        </Tooltip>
        {user == null || group == null ? null : (
          <Stack sx={{px: 4, justifyContent: 'center'}}>
            <strong style={{ fontSize: "2.5em" }}>
              {user.rank} {user.name}
            </strong>
            <span style={{ fontSize: "1.5em" }}>
              {group.name} {user.title}
            </span>
          </Stack>
        )}
      </Stack>
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs value={tabIndex} onChange={handleChange}>
          <Tab label="사용자 정보" component={LinkComponent} to={baseURL} />
          <Tab
            label="작성한 항목"
            component={LinkComponent}
            to={baseURL + "/items"}
          />
        </Tabs>
      </Box>
      <Switch>
        <Route exact path={baseURL}>
          <Profile user={user} group={group} />
        </Route>
        <Route exact path={baseURL + "/items"}>
          <UserItems userItem={userItem} />
        </Route>
      </Switch>
    </Box>
  );
}
