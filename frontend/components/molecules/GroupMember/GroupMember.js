import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import { IconButton, Menu, MenuItem } from "@mui/material";
import PropTypes from "prop-types";
import React, { useState } from "react";

export default function GroupMember({
  name = "",
  rank = "",
  division = "",
  title = "",
  profileImageUrl = "",
  status = "",
  type = "",
}) {
  const aboveString = `${rank} ${name}`;
  const belowString = `${division} ${title}`;

  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div className="group-member">
      <div className="group-member-profile">
        <img
          className="profile-img"
          src={profileImageUrl || "/images/default-profile.png"}
          alt="profile"
        />
        <div className="profile-string">
          <div className="profile-string-above">{aboveString}</div>
          <div className="profile-string-below">{belowString}</div>
        </div>
      </div>
      <div className="group-member-admin">
        {type === "admin"
          ? "관리자"
          : type === "inspector"
          ? "보안 검수자"
          : "그룹원"}
      </div>
      <div className="group-member-active">
        {status === "active" ? "활동중" : "비활성"}
      </div>
      <div>
        <IconButton
          aria-label="more"
          id="long-button"
          aria-controls="long-menu"
          aria-expanded={open ? "true" : undefined}
          aria-haspopup="true"
          onClick={handleClick}
        >
          <MoreHorizIcon />
        </IconButton>
        <Menu
          id="group-member-menu"
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
        >
          <MenuItem onClick={handleClose}>권한 삭제</MenuItem>
          <MenuItem onClick={handleClose}>관리자로 변경</MenuItem>
        </Menu>
      </div>
    </div>
  );
}

GroupMember.propTypes = {
  name: PropTypes.string.isRequired,
  rank: PropTypes.string.isRequired,
  division: PropTypes.string,
  title: PropTypes.string.isRequired,
  profileImageUrl: PropTypes.string,
  status: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
};
