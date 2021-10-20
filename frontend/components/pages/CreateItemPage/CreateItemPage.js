import { mdiContentSave, mdiFamilyTree, mdiUpload } from "@mdi/js";
import Icon from "@mdi/react";
import {
  Container,
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
  Stack
} from "@mui/material";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import { push } from "connected-react-router";
import R from "ramda";
import React, { useState } from "react";
import { store as RNC } from "react-notifications-component";
import { useDispatch, useSelector } from "react-redux";
import Editor from "_molecules/Editor";
import ItemListHeader from "_molecules/ItemListHeader";
import { attemptCreateItem } from "_thunks/item";

export default function CreateItemPage() {
  // find current user from store
  const { user } = useSelector(R.pick(["user"]));
  const dispatch = useDispatch();

  const draftItem = () => {
    RNC.addNotification({
      title: "임시저장 완료",
      type: "success",
      message: "항목을 임시저장하였습니다",
      container: "top-center",
      animationIn: ["animated", "fadeInRight"],
      animationOut: ["animated", "fadeOutRight"],
      dismiss: {
        duration: 5000,
      },
    });
  };

  // states for editor
  const [title, setTitle] = useState(null);
  const [content, setContent] = useState(null);
  const [initialContent, setInitialContent] = useState("");

  const handlePublish = () => {
    let item = {
      title: title,
      content: content,
      status: "published"
    };

    if (parentPath !== "new") {
      item["path"] = parentPath;
    }

    let commaCount = parentPath.match(/,/g) ? parentPath.match(/,/g).length : 0;

    if (commaCount == 0) {
      item["type"] = "cabinet";
    } else if (commaCount == 2) {
      item["type"] = "document";
    } else if (commaCount == 3) {
      item["type"] = "card";
    }

    // update content with content from editor
    dispatch(attemptCreateItem(item)).then((item) => {
      dispatch(push(`/item/${item._id}`));
    });
  };

  // states for settings
  const [parentPath, setParentPath] = useState(null);

  const availablePaths = Object.entries(
    useSelector((state) => state.itemCache)
  ).filter(
    // filter items from cache where type is parent and current user is owner
    ([itemId, item]) =>
      (item.type === "cabinet" || item.type === "document") &&
      item.owner._id === user._id
  );

  const handleParentPathChange = (event) => {
    setParentPath(event.target.value);
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      {/* Item Edit Page */}
      <Stack className="item-page item-editor">
        <Stack>
          <div className="item-page-header">
            {/* Item title */}
            <TextField
              className="item-page-header-title item-page-header-title-editor"
              fullWidth
              id="item-page-header-title-editor"
              label="제목"
              variant="standard"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
        </Stack>

        {/* Item content editor */}
        <Editor
          className="item-page-content-editor"
          content={initialContent} // initial content state
          onContentChange={(html) => setContent(html)} // saves updates to separate state than item
        />

        <ItemListHeader
          title="항목 위치"
          icon={mdiFamilyTree}
          style={{ marginTop: 16, marginBottom: 16 }}
        />

        <FormControl>
          <InputLabel id="item-path-label">상위 항목</InputLabel>
          <Select
            className="item-page-settings-item-path"
            labelId="item-path-label"
            id="item-path-select"
            value={parentPath != null ? parentPath : ""}
            displayEmpty
            label="상위 항목"
            onChange={handleParentPathChange}
          >
            <MenuItem value="new">새로운 서랍 만들기</MenuItem>
            {availablePaths.map(([itemId, item]) => (
              <MenuItem value={item.path} key={item.path}>
                {`${
                  item.type
                    ? { cabinet: "[서랍] ", document: "[문서] " }[item.type]
                    : ""
                }${item.title}`}
              </MenuItem>
            ))}
          </Select>
          <FormHelperText>현재 항목을 포함할 상위 항목</FormHelperText>
        </FormControl>

        {/* Item save action */}
        <div className="item-action-editor">
          <Button
            variant="outlined"
            color="secondary"
            size="large"
            onClick={draftItem}
          >
            <Icon path={mdiContentSave} size={0.9} />
            임시저장
          </Button>
          <Button
            disableElevation
            variant="contained"
            color="secondary"
            size="large"
            disabled={parentPath == null}
            onClick={handlePublish}
          >
            <Icon path={mdiUpload} size={0.9} style={{ marginLeft: "-4px" }} />
            항목 게시
          </Button>
        </div>
      </Stack>
    </Container>
  );
}
