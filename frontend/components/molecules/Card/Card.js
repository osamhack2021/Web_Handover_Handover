import {
  mdiAccountMultipleCheck,
  mdiContentDuplicate,
  mdiDelete,
  mdiDotsVertical,
  mdiEarth,
  mdiFileEditOutline,
  mdiPackageDown,
  mdiShare,
  mdiStar,
  mdiStarOutline,
  mdiUpload
} from "@mdi/js";
import Icon from "@mdi/react";
import {
  ButtonBase,
  Divider,
  IconButton,
  ListItemIcon,
  Menu,
  MenuItem,
  Skeleton,
  Tooltip
} from "@mui/material";
import humanizeDuration from "humanize-duration";
import R from "ramda";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getItemByItemId, getItemChild } from "_api/item";
import LinkComponent from "_atoms/LinkComponent";
import { attemptArchiveItem, attemptDeleteItem } from "_thunks/item";
import { attemptRemoveBookmark } from "_thunks/user";
import { attemptPublishItem } from "./../../../store/thunks/item";
import { attemptAddBookmark } from "./../../../store/thunks/user";

const borderRadius = {
  cabinet: "0px 0px 16px 16px",
  document: "0px 16px 16px 0px",
  card: "16px",
};

// Maximum number of line of the content
const LINE_CLAMP = 4;

const content = (item, itemChildren) => {
  if (item == null) return null;

  if (item.type === "card") {
    // Card directly hold content, display summary of it
    return (
      <div className="item-content-html">
        {
          item.content
            .replace(/[ ]{2,}/g, "") // remove HTML indentation spaces
            .replace(/<\/[h\d|p|br]>/g, "\n") // replace HTML closing tags to newline
            .replace(/\n+/, "") // remove starting newline
            .replace(/[\s]{2,}/g, "") // remove multiple whitespace characters
            .replace(/<[^>]+>/g, "") // remove all HTML tags
        }
      </div>
    );
  } else {
    if (itemChildren == null) return null;
    else {
      // Join titles of child items with new line
      return itemChildren.map((child, i) => {
        if (i < LINE_CLAMP) {
          return <div key={i}>{child.title}</div>;
        }
        if (i == LINE_CLAMP) {
          return (
            <div className="item-content-ellipsis" key={i}>
              외 {itemChildren.length - LINE_CLAMP}건
            </div>
          );
        }
      });
    }
  }
};

const dateElapsed = (date) => {
  const created = new Date(date);
  const now = new Date();
  return (
    humanizeDuration(now - created, {
      language: "ko",
      largest: 1,
      spacer: "",
      round: true,
    }) + " 전"
  );
};

const statusIcon = {
  archived: mdiPackageDown,
  public: mdiEarth,
};

const statusTooltipText = {
  archived: "보관된 항목",
  public: "공개된 항목",
};

// TODO: refactor <Card Id="..." /> to <Card itemId="..." />
export default function Card({
  Id: itemId,
  item: itemObject = null,
  itemChildren: itemChildrenObject = null,
}) {
  const dispatch = useDispatch();

  // find current user from store
  const { user } = useSelector(R.pick(["user"]));

  // will try to use object passed as props if exists
  const [item, setItem] = useState(itemObject);
  const [itemChildren, setItemChildren] = useState(itemChildrenObject);

  const [isBookmarked, setBookmarked] = useState(
    user.bookmarks.includes(itemId)
  );
  // visibility of the component; used on delete and unauthorized items
  const [visible, setVisible] = useState(true);

  // states for menu component
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  useEffect(() => {
    // retrieve item and its children from API if there were no item object passed
    if (item == null) {
      getItemByItemId(itemId)
        .then((item) => {
          setItem(item);
          if (item.type !== "card") {
            getItemChild(item.path).then((children) => {
              setItemChildren(children);
            });
          }
        })
        .catch((response) => {
          setVisible(false);
          // setItem({ error: response.text });
          if (!response.text.startsWith("Access denied"))
            console.error(response);
        });
    } else {
      if (item.type !== "card" && itemChildren == null) {
        getItemChild(item.path).then((children) => {
          setItemChildren(children);
        });
      }
    }
  }, []);

  const deleteItem = () => {
    dispatch(attemptDeleteItem(itemId));
    setVisible(false);
  };

  const archiveItem = () => {
    dispatch(attemptArchiveItem(itemId));
    setItem({ ...item, status: "archived" });
  };

  const publishItem = () => {
    dispatch(attemptPublishItem(itemId));
    setItem({ ...item, status: "published" });
  };

  const toggleBookmark = () => {
    let bookmarkArray = user.bookmarks;

    if (isBookmarked) {
      // previously was bookmarked, delete from bookmark array
      bookmarkArray = bookmarkArray.filter((elem) => elem !== itemId);
      dispatch(attemptRemoveBookmark({ bookmarks: bookmarkArray }));
    } else {
      // previously wasn't bookmarked, add to bookmark array
      bookmarkArray = [...bookmarkArray, itemId];
      dispatch(attemptAddBookmark({ bookmarks: bookmarkArray }));
    }

    setBookmarked(!isBookmarked);
  };

  const status =
    item == null
      ? null
      : item.status === "archived"
      ? "archived"
      : item.accessGroups.read === "all"
      ? "public"
      : null;

  const isCurrentUserOwner = item ? item.owner._id === user.Id : false;
  const isCurrentUserEditor = item
    ? item.accessGroups.edit.includes(user.group)
    : false;

  // Item object schema
  // {
  //   _id: ObjectId,
  //   title: String,
  //   type: "cabinet"|"document"|"card",
  //   owner: user._id,
  //   path: String,
  //   content: String,
  //   tags: [String],
  //   createdDate: Date,
  //   contributor: [user._id],
  //   accessGroups: {
  //     read: [group._id],
  //     edit: [group._id]
  //   },
  //   history: [item._id]
  //   status: "draft"|"archived"|"published"
  //   inspection: {
  //     result: String,
  //     by: user._id,
  //     date: Date
  //   }
  //   comments: [{
  //     content: String,
  //     by: user._id,
  //     date: Date,
  //     isEdited: Boolean
  //   }]
  // }

  // don't render if visible is false
  if (visible == false) return null;

  return item == null ? (
    <div className="item" key={itemId}>
      <ButtonBase
        sx={{
          width: "100%",
          height: "100%",
          backgroundColor: "white",
          border: "0.5px solid rgba(0, 0, 0, 0.25)",
          padding: "24px",
          display: "flex",
          flexDirection: "column",
          alignItems: "stretch",
          justifyContent: "space-between",
          borderRadius: borderRadius.card,
        }}
      >
        <div className="item-title">
          <Skeleton width="100%" height="32px" />
        </div>
        <div className="item-content">
          <Skeleton width="100%" />
          <Skeleton width="100%" />
          <Skeleton width="75%" />
        </div>
      </ButtonBase>
      <div className="item-footer">
        <div className="item-description">
          <Skeleton width="100%" />
        </div>
        <IconButton>
          <Icon size={1} path={isBookmarked ? mdiStar : mdiStarOutline} />
        </IconButton>
        <IconButton>
          <Icon size={1} path={mdiDotsVertical} />
        </IconButton>
      </div>
    </div>
  ) : (
    <div className="item" key={itemId}>
      <ButtonBase
        sx={{
          width: "100%",
          height: "100%",
          backgroundColor: item.status === "archived" ? "WhiteSmoke" : "white",
          border: "0.5px solid rgba(0, 0, 0, 0.25)",
          padding: "24px",
          display: "flex",
          flexDirection: "column",
          alignItems: "stretch",
          justifyContent: "space-between",
          borderRadius: borderRadius[item.type],
        }}
        component={LinkComponent}
        to={`/item/${itemId}`}
      >
        <div className="item-header">
          <div className="item-title">{item.title}</div>
          {status != null ? (
            <Tooltip title={statusTooltipText[status]} arrow>
              <Icon size={1} path={statusIcon[status]} />
            </Tooltip>
          ) : (
            <div></div>
          )}
        </div>
        <div className="item-content">{content(item, itemChildren)}</div>
      </ButtonBase>
      <div className="item-footer">
        <div className="item-description">
          {item.owner.rank} {item.owner.name} · {dateElapsed(item.created)}
        </div>
        <Tooltip title="북마크에 추가" arrow>
          <IconButton onClick={toggleBookmark}>
            <Icon size={1} path={isBookmarked ? mdiStar : mdiStarOutline} />
          </IconButton>
        </Tooltip>
        <IconButton onClick={handleClick}>
          <Icon size={1} path={mdiDotsVertical} />
        </IconButton>
      </div>
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        PaperProps={{
          elevation: 0,
          sx: {
            overflow: "visible",
            filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
            ml: "6px",
            mt: 0.5,
            "&:before": {
              content: '""',
              display: "block",
              position: "absolute",
              top: 0,
              right: 18,
              width: 10,
              height: 10,
              bgcolor: "background.paper",
              transform: "translateY(-50%) rotate(45deg)",
              zIndex: 0,
            },
          },
        }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        {isCurrentUserOwner || isCurrentUserEditor ? ( // only show edit menu to owner and editor
          <MenuItem component={LinkComponent} to={`/item/${itemId}/edit`}>
            <ListItemIcon>
              <Icon path={mdiFileEditOutline} size={1} />
            </ListItemIcon>
            수정
          </MenuItem>
        ) : (
          <div></div>
        )}
        <MenuItem component={LinkComponent} to={`/item/${itemId}/duplicate`}>
          <ListItemIcon>
            <Icon path={mdiContentDuplicate} size={1} />
          </ListItemIcon>
          복제
        </MenuItem>
        <MenuItem>
          <ListItemIcon>
            <Icon path={mdiShare} size={1} />
          </ListItemIcon>
          공유
        </MenuItem>
        {isCurrentUserOwner ? (
          <div>
            <MenuItem component={LinkComponent} to={`/item/${itemId}/settings`}>
              <ListItemIcon>
                <Icon path={mdiAccountMultipleCheck} size={1} />
              </ListItemIcon>
              권한 설정
            </MenuItem>
            <Divider light />
            {item.status !== "archived" ? (
              <MenuItem onClick={archiveItem}>
                <ListItemIcon>
                  <Icon path={mdiPackageDown} size={1} />
                </ListItemIcon>
                보관
              </MenuItem>
            ) : (
              <MenuItem onClick={publishItem}>
                <ListItemIcon>
                  <Icon path={mdiUpload} size={1} />
                </ListItemIcon>
                게시
              </MenuItem>
            )}
            <MenuItem onClick={deleteItem}>
              <ListItemIcon>
                <Icon path={mdiDelete} size={1} />
              </ListItemIcon>
              삭제
            </MenuItem>
          </div>
        ) : (
          <div></div>
        )}
      </Menu>
    </div>
  );
}
