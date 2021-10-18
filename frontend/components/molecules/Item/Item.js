import {
  mdiCog,
  mdiContentDuplicate,
  mdiDelete,
  mdiDotsVertical,
  mdiEarth,
  mdiFileEditOutline,
  mdiPackageDown,
  mdiShare,
  mdiStar,
  mdiStarOutline,
  mdiUpload,
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
  Tooltip,
} from "@mui/material";
import R from "ramda";
import React, { useEffect, useState } from "react";
import { store as RNC } from "react-notifications-component";
import { useDispatch, useSelector } from "react-redux";
import LinkComponent from "_atoms/LinkComponent";
import { dateElapsed, dateToString } from "_frontend/utils/date";
import {
  attemptArchiveItem,
  attemptDeleteItem,
  attemptGetItem,
  attemptGetItemChildren,
  attemptPublishItem,
} from "_thunks/item";
import { attemptAddBookmark, attemptRemoveBookmark } from "_thunks/user";
import { deepEqual } from "_utils/compare";

const borderRadius = {
  cabinet: "0px 0px 16px 16px",
  document: "0px 16px 16px 0px",
  card: "16px",
};

// Maximum number of line of the content
const LINE_CLAMP = 4;

const renderContent = (item, itemChildren) => {
  if (item == null || !item.hasOwnProperty("content")) return null;

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
  }
  if (itemChildren == null) return null;

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
};

const statusIcon = {
  archived: mdiPackageDown,
  public: mdiEarth,
};

const statusTooltipText = {
  archived: "보관된 항목",
  public: "공개된 항목",
};

export default function Item({
  id = null,
  item: itemObject = null,
  itemChildren: itemChildrenObject = null,
}) {
  // find current user from store
  const { user } = useSelector(R.pick(["user"]));
  const dispatch = useDispatch();

  const itemId =
    itemObject != null
      ? itemObject.hasOwnProperty("_id")
        ? itemObject._id // id from API response
        : id
      : id; // id from props

  // Read more about useSelector() hook here:
  // https://react-redux.js.org/api/hooks#useselector
  const cachedItem = useSelector((state) => state.itemCache[itemId]);

  // DEBUG
  // if (cachedItem == null) console.log(itemId + " wasn't found in itemCache.");
  // else console.log(itemId + " was found in itemCache: ", cachedItem);

  // will try to use object passed as props if exists
  // will try to use cachedItem if not null (= if exists in cache)
  const [item, setItem] = useState(
    itemObject ? itemObject : cachedItem // look for itemCache
  );
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
    if (
      item == null ||
      !item.hasOwnProperty("accessGroups") || // item must have accessGroups property
      !item.hasOwnProperty("content") // item must have content property
    ) {
      // retrieve item and its children from API if there were no item object passed
      dispatch(attemptGetItem(itemId))
        .then((item) => {
          setItem(item);
          if (item.type !== "card") {
            dispatch(attemptGetItemChildren(item.path)).then((items) => {
              setItemChildren(items);
            });
          }
        })
        .catch(() => setVisible(false));
    } else {
      // retrieve item from server for possible updates
      dispatch(attemptGetItem(itemId))
        .then((response) => {
          if (!deepEqual(item, setItem(response))) {
            // update state deep equality between state and response is false
            console.log(
              itemId,
              " cache was updated compared to server: ",
              response
            );
            setItem(response);
          }
        })
        .catch(() => setVisible(false));

      if (item.type !== "card" && itemChildren == null) {
        dispatch(attemptGetItemChildren(item.path)).then((children) => {
          setItemChildren(children);
        });
      }
    }
  }, []);

  const shareItem = () => {
    navigator.clipboard.writeText(`${location.hostname}/item/${itemId}`);

    RNC.addNotification({
      title: "클립보드에 복사됨",
      type: "success",
      message: "항목 링크가 클립보드에 복사되었습니다.",
      container: "top-center",
      animationIn: ["animated", "fadeInRight"],
      animationOut: ["animated", "fadeOutRight"],
      dismiss: {
        duration: 5000,
      },
    });
  };

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
    item == null ||
    !item.hasOwnProperty("status") ||
    !item.hasOwnProperty("accessGroups")
      ? null
      : item.status === "archived"
      ? "archived"
      : item.accessGroups.read === "all"
      ? "public"
      : null;

  const isCurrentUserOwner = item ? item.owner._id === user._id : false;
  const isCurrentUserEditor =
    item != null && item.hasOwnProperty("accessGroups")
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

  const content = renderContent(item, itemChildren);

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
          <Icon size={1} path={mdiStarOutline} />
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
            <div />
          )}
        </div>
        {content != null ? (
          <div className="item-content">{content}</div>
        ) : (
          <div className="item-content">
            <Skeleton width="100%" />
            <Skeleton width="100%" />
            <Skeleton width="75%" />
          </div>
        )}
      </ButtonBase>
      <div className="item-footer">
        <Tooltip title={dateToString(item.created)} arrow>
          <div className="item-description">
            {`${item.owner.rank} ${item.owner.name} · ${dateElapsed(
              item.created
            )}`}
          </div>
        </Tooltip>
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
              right: 16,
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
          <div />
        )}
        <MenuItem component={LinkComponent} to={`/item/${itemId}/duplicate`}>
          <ListItemIcon>
            <Icon path={mdiContentDuplicate} size={1} />
          </ListItemIcon>
          복제
        </MenuItem>
        <MenuItem onClick={shareItem}>
          <ListItemIcon>
            <Icon path={mdiShare} size={1} />
          </ListItemIcon>
          공유
        </MenuItem>
        {isCurrentUserOwner ? (
          <div>
            <MenuItem component={LinkComponent} to={`/item/${itemId}/settings`}>
              <ListItemIcon>
                <Icon path={mdiCog} size={1} />
              </ListItemIcon>
              설정
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
          <div />
        )}
      </Menu>
    </div>
  );
}
