import { Skeleton, Tooltip } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { attemptGetUser } from "_thunks/user";
import { dateElapsed, dateToString } from "_utils/date";

export default function Comment({ comment }) {
  // decomposes comment Object
  const [user, setUser] = useState({});
  const dispatch = useDispatch();

  useEffect(() => {
    if (comment != null) {
      dispatch(attemptGetUser(comment.by)).then((user) => {
        setUser(user);
      });
    }
  }, [comment]);

  return (
    <div className="comment-section-item">
      {user != null ? (
        <img
          className="comment-section-profile-image profile-image"
          src={user.profileImageUrl || "/images/profile-default.jpg"}
        />
      ) : (
        <Skeleton variant="circular" width={48} height={48} />
      )}
      <div className="comment-section-content">
        {user != null && comment != null ? (
          <div className="comment-section-item-header">
            <Link to={`/user/${user._id}`}>
              {user.rank} {user.name}
            </Link>
            {"님이"}
            <Tooltip title={dateToString(comment.date)} arrow>
              <div>{dateElapsed(comment.date)}</div>
            </Tooltip>
            {"작성"}
          </div>
        ) : (
          <Skeleton width="150px" height="1em" />
        )}
        <div className="comment-section-item-content">
          {comment && comment.content}
        </div>
      </div>
    </div>
  );
}
