import {
  mdiAccountMultipleCheck,
  mdiCog,
  mdiCommentTextOutline,
  mdiContentDuplicate,
  mdiContentSave,
  mdiDelete,
  mdiDotsVertical,
  mdiEarth,
  mdiFamilyTree,
  mdiFileEditOutline,
  mdiFileTreeOutline,
  mdiHistory,
  mdiPackageDown,
  mdiShare,
  mdiStar,
  mdiStarOutline,
  mdiUpload
} from "@mdi/js";
import Icon from "@mdi/react";
import {
  Badge,
  ButtonBase,
  Container,
  Divider,
  FormControl,
  FormHelperText,
  IconButton,
  InputLabel,
  ListItemIcon,
  Menu,
  MenuItem,
  Select,
  Skeleton,
  Stack,
  Tooltip
} from "@mui/material";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import { push } from "connected-react-router";
import R from "ramda";
import React, { useEffect, useState } from "react";
import { store as RNC } from "react-notifications-component";
import { useDispatch, useSelector } from "react-redux";
import { Route, Switch, useLocation, useParams } from "react-router";
import { Link } from "react-router-dom";
import LinkComponent from "_atoms/LinkComponent";
import TypeIcon from "_atoms/TypeIcon";
import { getGroupByGroupId } from "_frontend/api/group";
import { getItem } from "_frontend/api/item";
import MultipleGroupSelectChip from "_frontend/components/molecules/MultipleGroupSelectChip";
import ItemList from "_frontend/components/organisms/ItemList";
import CommentSection from "_frontend/components/templates/CommentSection";
import { dateElapsed, dateToString } from "_frontend/utils/date";
import BreadCrumbs from "_molecules/BreadCrumbs";
import Editor from "_molecules/Editor";
import ItemListHeader from "_molecules/ItemListHeader";
import {
  attemptArchiveItem,
  attemptDeleteItem,
  attemptGetItem,
  attemptGetItemChildren,
  attemptPublishItem,
  attemptUpdateItemContents,
  attemptUpdateItemSettings
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
  const { pathname } = useLocation();

  // find current user from store
  const { user } = useSelector(R.pick(["user"]));
  const dispatch = useDispatch();

  // Read more about useSelector() hook here:
  // https://react-redux.js.org/api/hooks#useselector
  const cachedItem = useSelector((state) => state.itemCache[itemId]);

  // will try to use cachedItem if not null (= if exists in cache)
  const [item, setItem] = useState(null);
  const [itemChildren, setItemChildren] = useState(null);
  const [itemParents, setItemParents] = useState(null);
  const [itemOwner, setItemOwner] = useState(null);
  const [itemHistory, setItemHistory] = useState(null);

  // visibility of the component; used on delete and unauthorized items
  const [visible, setVisible] = useState(true);
  const [isBookmarked, setBookmarked] = useState(
    user.bookmarks.includes(itemId)
  );

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

    // reset states
    console.log("render (useEffect): item =", item, "cachedItem =", cachedItem);
    setItem(cachedItem);
    setItemChildren(null);
    setItemParents(null);
    setItemOwner(null);
    setAvailableGroups(null);
    setVisible(true);
    setBookmarked(user.bookmarks.includes(itemId));
    setItem(cachedItem);

    // Use this to add alert on leave
    // if (pathname.endsWith("/edit")) {
    //   const unsavedChangesDialog = {
    //     title: "페이지를 나가시겠습니까?",
    //     content: "저장되지 않은 모든 정보는 소실됩니다. 복구할 수 없으니 주의해주세요.",
    //     action: {
    //       primary: {
    //         text: "페이지에 머무르기",
    //         callback: null
    //       },
    //       secondary: {
    //         text: "나가기",
    //         callback: null
    //       }
    //     }
    //   }

    //   const alertUser = e => {
    //     e.preventDefault();
    //     e.returnValue = '';

    //     showDialog(unsavedChangesDialog);
    //   }

    //   // Code from: https://javascript.plainenglish.io/how-to-alert-a-user-before-leaving-a-page-in-react-a2858104ca94
    //   window.addEventListener('beforeunload', alertUser)
    //   // window.addEventListener('unload', handleUnload)
    //   return () => {
    //     window.removeEventListener('beforeunload', alertUser)
    //     // window.removeEventListener('unload', handleUnload)
    //   }
    // } else if (pathname.endsWith("/settings")) {
    //   // do something
    // } else {
    // }
    // setting recents of localstorage when visited as page
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
    // retrieve item from server for possible updates
    dispatch(attemptGetItem(itemId))
      .then((response) => {
        if (!deepEqual(item, response)) {
          // update state if deep equality between state and response is false
          console.log("updated:", item, response);
          setItem(response);
        }
      })
      .catch(() => setVisible(false));

    if (item != null) {
      // set editor initial state
      setTitle(item.title);

      // set settings initial state
      setAccessGroups(item.accessGroups);

      // retrieve itemOwner
      if (itemOwner == null) {
        dispatch(attemptGetUser(item.owner._id)).then((user) => {
          setItemOwner(user);
        });
      }

      // retrieve itemChildren
      if (itemChildren == null) {
        if (item.type !== "card") {
          dispatch(attemptGetItemChildren(item.path)).then((children) => {
            setItemChildren(
              children.filter(
                (child) =>
                  child._id != item._id && child.path.includes(item.path)
              )
            );
          });
        }
      }

      // retrieve itemParents
      if (itemParents == null) {
        console.log("get itemParents");
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
              setParentPath(cachedParent.path);
              console.log("document - cachedParent.path", cachedParent.path);

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
              setParentPath(cachedParent.path);
              console.log("card - cachedParent.path", cachedParent.path);

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

      // get parent groups
      if (user != null && availableGroups == null) {
        getGroupByGroupId(user.group).then(async (group) => {
          const loadedGroupIds = group.pathGroups.map(
            (pathGroup) => pathGroup._id
          );
          // List of groupIds that have to be loaded because they were in accessGroups
          let accessGroupIds = [
            ...item.accessGroups.read.map((group) => group._id),
            ...item.accessGroups.edit.map((group) => group._id),
          ];
          accessGroupIds = accessGroupIds
            .filter((e, i) => accessGroupIds.indexOf(e) === i) // only leave unique items
            .filter((groupId) => !loadedGroupIds.includes(groupId));

          console.log("additionally loading:", accessGroupIds);

          const loadedGroups = group.pathGroups;

          for (const groupId of accessGroupIds) {
            if (groupId != null) {
              const group = await getGroupByGroupId(groupId);
              // add the group to the available groups
              loadedGroups.push(group);
            }
          }

          setAvailableGroups(loadedGroups);
        });
      }
    }
  }, [item]);

  useEffect(async () => {
    if (item != null && pathname.includes("/history")) {
      let itemHistoryArray = [];

      // get full item from history in array
      for (const itemId of item.history) {
        if (itemId != null) {
          const historyItem = await getItem(itemId);
          itemHistoryArray.push(historyItem);
        }
      }

      setItemHistory(itemHistoryArray);
    }
  }, [pathname, item]);

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

  const deleteItem = () => {
    dispatch(attemptDeleteItem(itemId)).then(() => {
      setVisible(false);
    });
  };

  const archiveItem = () => {
    dispatch(attemptArchiveItem(itemId)).then(() => {
      setItem({ ...item, status: "archived" });
    });
  };

  const publishItem = () => {
    dispatch(attemptPublishItem(itemId)).then(() => {
      setItem({ ...item, status: "published" });
    });
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
  const isMenuOpen = Boolean(anchorEl);
  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  // // states for dialog component
  // const [dialog, setDialog] = useState({
  //   title: "",
  //   content: "",
  //   action: {
  //     primary: {
  //       text: "",
  //       callback: null,
  //     },
  //     secondary: {
  //       text: "",
  //       callback: null,
  //     },
  //   },
  // });
  // const [isDialogOpen, setDialogOpen] = useState(false);
  // const handleDialogOpen = () => {
  //   setDialogOpen(true);
  // };
  // const handleDialogClose = () => {
  //   setDialogOpen(false);
  // };
  // const showDialog = (dialog) => {
  //   setDialog(dialog);
  //   handleDialogOpen();
  // };

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

  // states for editor
  const [title, setTitle] = useState(null);
  const [content, setContent] = useState(null);

  const handlePublish = () => {
    // update content with content from editor
    dispatch(
      attemptUpdateItemContents(itemId, {
        ...item,
        title: title,
        content: content,
      })
    ).then((item) => {
      setItem(item);
      dispatch(push(`/item/${itemId}`));
    });
  };

  // states for settings
  const [parentPath, setParentPath] = useState(null);
  const [accessGroups, setAccessGroups] = useState(null);
  const [availableGroups, setAvailableGroups] = useState(null);

  const parentType =
    item &&
    {
      card: "document",
      document: "cabinet",
      cabinet: null,
    }[item.type];

  const availablePaths = Object.entries(
    useSelector((state) => state.itemCache)
  ).filter(
    // filter items from cache where type is parent and current user is owner
    ([itemId, item]) => item.type === parentType && item.owner._id === user._id
  );

  const handleParentPathChange = (event) => {
    setParentPath(event.target.value);
  };

  const handleUpdateSettings = () => {
    // update settings from settings select
    dispatch(
      attemptUpdateItemSettings(itemId, {
        ...item,
        path: parentPath,
        accessGroups: {
          read: accessGroups.read.map((groups) => groups._id),
          edit: accessGroups.edit.map((groups) => groups._id),
        },
      })
    ).then((item) => {
      setItem(item);
      dispatch(push(`/item/${itemId}`));
    });
  };

  // Menu will lose anchor on render, use memoized component instead
  // Code from: https://stackoverflow.com/a/59682239/4524257
  const ItemActions = React.useMemo(() => {
    return React.forwardRef((props, ref) => (
      <Stack direction="row" ref={ref} {...props}>
        <Tooltip title="북마크에 추가" arrow>
          <IconButton onClick={toggleBookmark}>
            <Icon size={1.25} path={isBookmarked ? mdiStar : mdiStarOutline} />
          </IconButton>
        </Tooltip>
        <IconButton onClick={handleMenuClick}>
          <Icon size={1} path={mdiDotsVertical} />
        </IconButton>
      </Stack>
    ));
  }, []);

  if (!visible || item == null) return <div>Loading...</div>;

  // refactored components

  const ItemTypeIconWithTooltip = () => (
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
  );

  const ItemBreadCrumbs = ({ clickable = true }) =>
    item != null && itemParents != null ? (
      <BreadCrumbs itemArray={[...itemParents, item]} clickable={clickable} />
    ) : (
      <BreadCrumbs hierarchyLevel={hierarchyLevel[item.type]} />
    );

  const ItemOwnerProfile = () =>
    itemOwner != null ? (
      <Stack className="item-page-profile">
        <img
          className="item-page-profile-image profile-image"
          src={itemOwner.profileImageUrl || "/images/profile-default.jpg"}
        />
        <div className="item-page-profile-name">
          <Link to={`/user/${itemOwner._id}`}>
            {itemOwner.rank} {itemOwner.name}
          </Link>
          님이
          <Tooltip title={dateToString(item.created)} arrow>
            <div>{dateElapsed(item.created)}</div>
          </Tooltip>
          작성
        </div>
      </Stack>
    ) : (
      <Stack className="item-page-profile">
        <Skeleton variant="circular" width={24} height={24} />
        <Skeleton width={200} height="1em" />
      </Stack>
    );

  const ItemMetadata = () => (
    <Stack className="item-page-metadata">
      {/* Item owner profile, created date */}
      <ItemOwnerProfile />

      {/* Item history */}
      {item.history.length > 0 && (
        <Button
          component={LinkComponent}
          to={`/item/${itemId}/history`}
          variant="text"
          sx={{ fontSize: "1em", alignItems: "normal", pt: "8px" }}
        >
          <Icon path={mdiHistory} size={1} style={{ marginRight: 4 }} />
          수정 기록
        </Button>
      )}
    </Stack>
  );

  const HistoryListItem = ({ item: historyItem }) => (
    <ButtonBase
      className="item-page-history-list-item"
      component={LinkComponent}
      to={`/item/${itemId}/history/${historyItem ? historyItem._id : ""}`}
    >
      <div className="item-page-history-list-item-header">
        <div className="item-page-history-list-item-id">
          {historyItem ? historyItem._id.slice(-6) : <Skeleton width="45px" height="1em" />}
        </div>
        <div className="item-page-history-list-item-title">
          {historyItem ? historyItem.title : <Skeleton width="150px" height="1.2em" />}
        </div>
      </div>
      {historyItem ? (
        <div className="item-page-history-list-profile">
          {historyItem.owner.rank} {historyItem.owner.name} 님이
          <Tooltip title={dateToString(historyItem.created)} arrow>
            <div>{dateElapsed(historyItem.created)}</div>
          </Tooltip>
          작성
        </div>
      ) : (
        <Skeleton width="150px" height="0.8em" />
      )}
    </ButtonBase>
  );

  return (
    // <div className="content-pane">
    // <Header />
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Switch>
        {/* Item Read Page */}
        <Route exact path="/item/:itemId">
          <Stack spacing={1} className="item-page">
            <Stack>
              <div className="item-page-header">
                <ItemTypeIconWithTooltip />

                {/* Item title */}
                <div className="item-page-header-title">{item.title}</div>

                {/* Item action menus */}
                <ItemActions />
              </div>
            </Stack>

            {/* Item BreadCrumbs */}
            <ItemBreadCrumbs />

            {/* Item content */}
            {item.content && (
              <div className="item-page-content">
                <Editor content={item.content} editable={false} />
              </div>
            )}

            {/* Item metadata (owner profile, created date) */}
            <ItemMetadata />

            {/* Item children */}
            {item.type !== "card" && (
              <ItemList
                items={itemChildren}
                title="하위 항목"
                icon={mdiFileTreeOutline}
              />
            )}

            {/* Item comments */}
            <ItemListHeader title="댓글" icon={mdiCommentTextOutline} />
            <CommentSection
              itemId={itemId}
              comments={item.comments}
              currentUser={user}
            />
          </Stack>
        </Route>

        {/* Item Edit Page */}
        <Route exact path="/item/:itemId/edit">
          <Stack className="item-page item-editor">
            <Stack>
              <div className="item-page-header">
                <ItemTypeIconWithTooltip />

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

                {/* Item action menus */}
                <ItemActions />
              </div>
            </Stack>

            {/* Item BreadCrumbs */}
            <div className="item-editor-breadcrumb">
              <ItemBreadCrumbs clickable={false} />
              <Button
                variant="text"
                color="secondary"
                size="small"
                component={LinkComponent}
                to={`/item/${itemId}/settings`}
              >
                <Icon path={mdiFileTreeOutline} size={0.75} />
                항목 위치 변경
              </Button>
            </div>

            {/* Item content editor */}
            <Editor
              className="item-page-content-editor"
              content={item.content} // initial content state
              onContentChange={(html) => setContent(html)} // saves updates to separate state than item
            />

            <ItemMetadata />

            {/* Item children */}
            {item.type !== "card" && (
              <ItemList
                items={itemChildren}
                title="하위 항목"
                icon={mdiFileTreeOutline}
              />
            )}

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
                variant="outlined"
                color="secondary"
                size="large"
                disabled={status === "archived"}
                onClick={archiveItem}
              >
                <Icon path={mdiPackageDown} size={0.9} />
                항목 보관
              </Button>
              <Button
                disableElevation
                variant="contained"
                color="secondary"
                size="large"
                onClick={handlePublish}
              >
                <Icon
                  path={mdiUpload}
                  size={0.9}
                  style={{ marginLeft: "-4px" }}
                />
                항목 게시
              </Button>
            </div>
          </Stack>
        </Route>

        {/* Item Settings Page */}
        <Route exact path="/item/:itemId/settings">
          <Stack spacing={1} className="item-page">
            <Stack>
              <div className="item-page-header">
                <ItemTypeIconWithTooltip />

                {/* Item title */}
                <div className="item-page-header-title">{item.title}</div>

                {/* Item action menus */}
                <ItemActions />
              </div>
            </Stack>

            {/* Item BreadCrumbs */}
            <ItemBreadCrumbs />

            {/* Item path */}
            {item != null && item.type !== "cabinet" && (
              <>
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
                    {availablePaths.map(([itemId, item]) => (
                      <MenuItem value={item.path} key={item.path} >
                        {/* <TypeIcon
                          type={item.type}
                          size={0.75}
                          style={{ marginRight: 4 }}
                        /> */}
                        {item.title}
                      </MenuItem>
                    ))}
                  </Select>
                  <FormHelperText>현재 항목을 포함할 상위 항목</FormHelperText>
                </FormControl>
              </>
            )}

            {/* Item access groups */}
            <ItemListHeader
              title="그룹 권한"
              icon={mdiAccountMultipleCheck}
              style={{ marginTop: 16, marginBottom: 16 }}
            />

            <MultipleGroupSelectChip
              items={availableGroups}
              label="열람 권한"
              helperText="현재 항목을 열람할 수 있는 사용자 그룹"
              selectedGroups={
                // array of groupId
                accessGroups?.read.map((group) =>
                  group.hasOwnProperty("_id") ? group._id : group
                )
              }
              onChange={(selection) =>
                setAccessGroups({
                  ...accessGroups,
                  read: selection.map((groupId) =>
                    availableGroups.find((e) => e._id === groupId)
                  ),
                })
              }
            />

            <div style={{ height: 8 }} />

            <MultipleGroupSelectChip
              items={availableGroups}
              label="수정 권한"
              helperText="현재 항목을 수정할 수 있는 사용자 그룹"
              selectedGroups={
                // array of groupId
                accessGroups?.edit.map((group) =>
                  group.hasOwnProperty("_id") ? group._id : group
                )
              }
              onChange={(selection) =>
                setAccessGroups({
                  ...accessGroups,
                  edit: selection.map((groupId) =>
                    availableGroups.find((e) => e._id === groupId)
                  ),
                })
              }
            />

            {/* Item children */}
            {item.type !== "card" && (
              <ItemList
                items={itemChildren}
                title="하위 항목"
                icon={mdiFileTreeOutline}
              />
            )}

            {/* Item save action */}
            <div className="item-action-editor">
              <Button
                variant="contained"
                color="secondary"
                size="large"
                onClick={handleUpdateSettings}
              >
                <Icon
                  path={mdiContentSave}
                  size={0.9}
                  style={{ paddingLeft: -2 }}
                />
                변경 내용 저장
              </Button>
            </div>
          </Stack>
        </Route>

        {/* Item History Page */}
        <Route exact path="/item/:itemId/history">
          <Stack spacing={1} className="item-page">
            <Stack>
              <div className="item-page-header">
                <ItemTypeIconWithTooltip />

                {/* Item title */}
                <div className="item-page-header-title">{item.title}</div>

                {/* Item action menus */}
                <ItemActions />
              </div>
            </Stack>

            {/* Item BreadCrumbs */}
            <ItemBreadCrumbs />

            {/* History item list */}
            <ItemListHeader
              title="수정 기록"
              icon={mdiHistory}
              style={{ marginTop: 16, marginBottom: 16 }}
            />
            <div className="item-page-history-list">
              {itemHistory != null
                ? itemHistory.map((item, index) => (
                    <HistoryListItem item={item} key={index} />
                  ))
                : [...Array(item.history.length).keys()].map((i, index) => (
                    <HistoryListItem key={index} />
                  ))}
            </div>
          </Stack>
        </Route>
      </Switch>
      <Menu
        anchorEl={anchorEl}
        open={isMenuOpen}
        onClose={handleMenuClose}
        onClick={handleMenuClose}
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
              right: 24,
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
        {!pathname.endsWith("/edit") &&
        (isCurrentUserOwner || isCurrentUserEditor) ? ( // only show edit menu to owner and editor
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
            {!pathname.endsWith("/settings") && (
              <MenuItem
                component={LinkComponent}
                to={`/item/${itemId}/settings`}
              >
                <ListItemIcon>
                  <Icon path={mdiCog} size={1} />
                </ListItemIcon>
                설정
              </MenuItem>
            )}
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
  );
}

// <Dialog open={isDialogOpen} onClose={handleDialogClose} maxWidth="xs">
//   <DialogTitle id="alert-dialog-title">{dialog.title}</DialogTitle>
//   <DialogContent>
//     <DialogContentText id="alert-dialog-description">
//       {dialog.content}
//     </DialogContentText>
//   </DialogContent>
//   <DialogActions>
//     <Button
//       onClick={() => {
//         handleDialogClose();
//         dialog.action.secondary.callback && dialog.action.secondary.callback();
//       }}
//     >
//       {dialog.action.secondary.text}
//     </Button>
//     <Button
//       onClick={() => {
//         handleDialogClose();
//         dialog.action.primary.callback && dialog.action.primary.callback();
//       }}
//       autoFocus
//     >
//       {dialog.action.primary.text}
//     </Button>
//   </DialogActions>
// </Dialog>
