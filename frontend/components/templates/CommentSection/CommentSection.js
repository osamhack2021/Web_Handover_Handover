import { Button, Divider, TextField } from "@mui/material";
import React from "react";
import { useDispatch } from "react-redux";
import { attemptAddItemComment } from "_frontend/store/thunks/item";
import Comment from "_organisms/Comment";

export default function CommentSection({
  itemId,
  comments: commentObjects,
  currentUser,
}) {
  const [comments, setComments] = React.useState(commentObjects);
  const [commentContent, setCommentContent] = React.useState("");
  const [editable, setEditable] = React.useState(true);
  const dispatch = useDispatch();

  const handleChange = (event) => {
    setCommentContent(event.target.value);
  };

  const submittable = commentContent.trim() !== "";

  const handleAddComment = () => {
    setEditable(false);

    if (submittable) {
      dispatch(
        attemptAddItemComment(
          itemId,
          [
            ...comments,
            {
              content: commentContent,
              by: currentUser._id,
              date: new Date().toISOString(),
              isEdited: false,
            },
          ],
          (item) => {
            setComments(item.comments);
            setCommentContent("");
            setEditable(true);
          }
        )
      ).catch(() => {
        setEditable(true);
      });
    }
  };

  return comments != null ? (
    <div className="comment-section">
      <div className="comment-section-list">
        {comments &&
          comments.map((elem, index) => <Comment key={index} comment={elem} />)}
      </div>
      {(comments && comments.length > 0) && <Divider />}
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
            disabled={!editable}
            minRows={3}
            placeholder="댓글을 작성하세요"
            value={commentContent}
            onChange={handleChange}
          />
          <Button
            disabled={!submittable || !editable}
            onClick={handleAddComment}
            className="comment-section-editor-button"
            variant="contained"
            disableElevation
          >
            댓글 달기
          </Button>
        </div>
      </div>
    </div>
  ) : (
    <div>Loading...</div>
  );
}
