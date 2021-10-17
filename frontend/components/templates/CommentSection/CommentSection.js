import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import React from "react";
import Comment from "_organisms/Comment";

export default function CommentSection({ comments, currentUser }) {
  const [commentContent, setCommentContent] = React.useState("");

  const handleChange = (event) => {
    setCommentContent(event.target.value);
  };

  return comments != null ? (
    <div className="comment-section">
      <div className="comment-section-list">
        {comments &&
          comments.map((elem, index) => (
            <Comment key={index} comment={elem} />
          ))}
      </div>
      <div className="comment-section-item">
        <img
          className="comment-section-profile-image"
          src={currentUser.profileImageUrl || "/images/default-profile.png"}
        />
        <div className="comment-section-editor comment-section-content">
          <TextField
            className="comment-section-editor-textfield"
            multiline
            fullWidth
            minRows={3}
            placeholder="댓글을 작성하세요"
            value={commentContent}
            onChange={handleChange}
          />
          <Button className="comment-section-editor-button" variant="contained" disableElevation>
            댓글 달기
          </Button>
        </div>
      </div>
    </div>
  ) : (
    <div>Loading...</div>
  );
}
