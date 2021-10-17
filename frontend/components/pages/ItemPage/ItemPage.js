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
  Badge,
  Container,
  Divider,
  IconButton,
  ListItemIcon,
  Skeleton,
  Menu,
  MenuItem,
  Stack,
  Tooltip
} from "@mui/material";
import { push } from "connected-react-router";
import R from "ramda";
import React, { useEffect, useState } from "react";
import { store as RNC } from "react-notifications-component";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router";
import LinkComponent from "_atoms/LinkComponent";
import TypeIcon from "_atoms/TypeIcon";
import BreadCrumbs from "_molecules/BreadCrumbs";
import Editor from "_molecules/Editor";
import Comment from "_organisms/Comment";
import {
  attemptArchiveItem,
  attemptDeleteItem,
  attemptGetItem,
  attemptGetItemChildren,
  attemptPublishItem
} from "_thunks/item";
import {
  attemptAddBookmark,
  attemptGetUser,
  attemptRemoveBookmark
} from "_thunks/user";
import { deepEqual } from "_utils/compare";

const typeString = {
  cabinet: "서랍",
  document: "문서",
  card: "카드",
};

const hierarchyLevel = {
  cabinet: 1,
  document: 2,
  card: 3,
};

const statusIcon = {
  archived: mdiPackageDown,
  public: mdiEarth,
};

const statusTooltipText = {
  archived: "보관된",
  public: "공개된",
};

export default function ItemPage() {
  // Item id from URL params: /item/:itemId
  const { itemId } = useParams();

  // find current user from store
  const { user } = useSelector(R.pick(["user"]));
  const dispatch = useDispatch();

  // Read more about useSelector() hook here:
  // https://react-redux.js.org/api/hooks#useselector
  const cachedItem = useSelector((state) => state.itemCache[itemId]);

  // will try to use cachedItem if not null (= if exists in cache)
  const [item, setItem] = useState(cachedItem);
  const [itemChildren, setItemChildren] = useState(null);
  const [itemParents, setItemParents] = useState(null);
  const [isBookmarked, setBookmarked] = useState(
    user.bookmarks.includes(itemId)
  );
  const [itemOwner, setItemOwner] = useState(null);

  // visibility of the component; used on delete and unauthorized items
  const [visible, setVisible] = useState(true);

  // creates [currentItemId, parentItemId, parentParentItemId] array
  const pathArray =
    item != null
      ? item.path
          .split(",")
          .filter((e) => e !== "") // remove surrounding empty strings
          .reverse()
      : [];
  const cachedParent = useSelector(
    (state) => state.itemCache[pathArray.length > 1 ? pathArray[1] : null]
  );
  const cachedParentParent = useSelector(
    (state) => state.itemCache[pathArray.length > 2 ? pathArray[2] : null]
  );

  useEffect(() => {
    if (itemId.length != 24) {
      dispatch(push("/error"));
      return;
    }

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
          if (!deepEqual(item, response)) {
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

    // setting recents of localstorage
    const recentArray = JSON.parse(localStorage.getItem("recents"));
    if (recentArray != null) {
      if (!recentArray.includes(itemId)) {
        localStorage.setItem(
          "recents",
          JSON.stringify([itemId, ...recentArray].slice(0, 20))
        );
      }
    } else {
      localStorage.setItem("recents", JSON.stringify([itemId]));
    }
  }, [itemId]);

  useEffect(() => {
    if (item != null) {
      dispatch(attemptGetUser(item.owner._id)).then((user) => {
        setItemOwner(user);
      });

      switch (item.type) {
        case "cabinet": // will have 0 parents because it's the root item
          console.log("switch: case =", item.type, pathArray);
          setItemParents([]);
          break;
        case "document": // will have 1 parent item as cabinet
          console.log("switch: case =", item.type, pathArray);
          if (pathArray.length == 2) {
            // try item from cache
            setItemParents([cachedParent]);

            // check for document update
            dispatch(attemptGetItem(pathArray[1])).then((item) => {
              // update only if updated
              if (!deepEqual(item, cachedParent)) setItemParents([item]);
            });
          }
          break;
        case "card": // will have 2 parent items as document and cabinet
          console.log("switch: case =", item.type, pathArray);
          if (pathArray.length == 3) {
            // try item from cache
            setItemParents([cachedParentParent, cachedParent]);

            // check for document update
            dispatch(attemptGetItem(pathArray[1])).then((item) => {
              // update only if updated
              if (!deepEqual(item, cachedParent)) {
                // update to [newDocumentItem, previousCabinetItem]
                setItemParents([cachedParentParent, item]);
              }
            });

            // check for cabinet update
            dispatch(attemptGetItem(pathArray[2])).then((item) => {
              // update only if updated
              if (!deepEqual(item, cachedParentParent)) {
                // update to [previousDocumentItem, newCabinetItem]
                setItemParents([item, cachedParent]);
              }
            });
          }
      }
    }
  }, [item]);

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

  // states for menu component
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
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

  return visible && item != null ? (
    // <div className="content-pane">
    // <Header />
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Stack spacing={1} className="item-page">
        <Stack>
          <div className="item-header">
            <Tooltip
              title={
                (status != null ? `${statusTooltipText[status]} ` : "") +
                typeString[item.type]
              }
              arrow
            >
              <Badge
                badgeContent={
                  status != null ? (
                    <Icon size={0.75} path={statusIcon[status]} opacity={0.7} />
                  ) : null
                }
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "right",
                }}
                sx={{
                  ".MuiBadge-badge": {
                    backgroundColor: "#eae8dc",
                    p: "4px",
                    mb: "4px",
                    mr: "4px",
                  },
                }}
              >
                <TypeIcon type={item.type} size={1.5} opacity={0.7} />
              </Badge>
            </Tooltip>
            <div className="item-title">{item.title}</div>
            <Stack direction="row">
              <Tooltip title="북마크에 추가" arrow>
                <IconButton onClick={toggleBookmark}>
                  <Icon
                    size={1.25}
                    path={isBookmarked ? mdiStar : mdiStarOutline}
                  />
                </IconButton>
              </Tooltip>
              <IconButton onClick={handleClick}>
                <Icon size={1} path={mdiDotsVertical} />
              </IconButton>
            </Stack>
          </div>
          {itemParents != null ? (
            <BreadCrumbs itemArray={[...itemParents, item]} />
          ) : (
            <BreadCrumbs hierarchyLevel={hierarchyLevel[item.type]} />
          )}
        </Stack>
        {itemOwner != null ? (
          <Stack className="item-profile">
            <img
              className="item-profile-image"
              src={itemOwner.profileImageUrl || "/images/default-profile.png"}
            />
            <div className="item-profile-name">
              {itemOwner.rank} {itemOwner.name}
            </div>
          </Stack>
        ) : (
          <Stack className="item-profile">
            <Skeleton className="item-profile-image"/>
            <Skeleton className="item-profile-name" />
          </Stack>
        )}
        {item.content && <Editor content={item.content} editable={false} />}
        <div>
          <div className="outer-div">
            <div className="grid-container">
              {/* <GridHeader title={item.title} pathArray={pathObject.pathArray} />
          <div className="grid-layout-container">
            <GridLayout cardArray={childObject.childArray} />
          </div> */}
            </div>
          </div>
          {item.comments &&
            item.comments.map((elem) => (
              <Comment key={item.comments.indexOf(elem)} commentObject={elem} />
            ))}
        </div>
      </Stack>
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
              right: 20,
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
                <Icon path={mdiAccountMultipleCheck} size={1} />
              </ListItemIcon>
              권한 설정
            </MenuItem>
            <Divider light />
            {status !== "archived" ? (
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
    </Container>
  ) : (
    <div>Loading...</div>
  );
}
