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

const template = [
  {
    title: "순서가 있는 업무",
    content:
      "<h1>1. 첫번째 업무 제목</h1><p>첫번째 업무에 대한 설명을 자세히 적어주세요.</p><h1>2. 두번째 업무 제목</h1><p>두번째 업무에 대한 설명을 자세히 적어주세요.</p><h1>3. 세번째 업무 제목</h1><p>세번째 업무에 대한 설명을 자세히 적어주세요.</p>",
  },
  {
    title: "시간대별로 수행하는 업무",
    content:
      "<h1>09:00 업무 제목</h1><p>09:00 에 하는 업무에 대한 설명을 자세히 적어주세요.</p><h1>10:00 업무 제목</h1><p>10:00 에 하는 업무에 대한 설명을 자세히 적어주세요.</p><h1>11:00 업무 제목</h1><p>11:00 에 하는 업무에 대한 설명을 자세히 적어주세요.</p>",
  },
  {
    title: "상황에 따라 하는 업무",
    content:
      "<h1>상황: 상황 제목</h1><p>아래 업무는 이러이러한 상황이 일어났을때 수행한다.</p><p>상황에 대한 설명을 자세히 적어주세요.</p><h1>업무: 수행해야 할 업무 제목</h1><p>수행해야 할 업무에 대한 설명을 자세히 적어주세요.</p>",
  },
  {
    title: "부대시설 이용",
    content:
      "<h1>부대시설 이름</h1><p>부대시설에 대한 설명을 간단하게 적어주세요.</p><h2>사용 시간</h2><p>부대시설을 사용할 수 있는 시간을 적어주세요.</p><ul><li><p><strong>평일</strong>: 09:00 ~ 17:00</p></li><li><p><strong>주말</strong>: 11:00 ~ 15:00</p></li></ul><h2>사용 방법</h2><p>부대시설을 사용하는 방법을 자세히 적어주세요.</p><h2>주의 사항</h2><p>부대시설을 사용할 때 주의해야 할 사항을 자세히 적어주세요.</p>",
  },
  {
    title: "내용 초기화",
    content: "",
  },
];

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
      status: "published",
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

        <div style={{ display: "flex", flexDirection: "row", gap: 8 }}>
          {template.map((e, i) => (
            <Button variant="outlined" onClick={() => setInitialContent(e.content)}>
              <div className="item-title">{e.title}</div>
            </Button>
          ))}
        </div>

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
