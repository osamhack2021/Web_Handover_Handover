import { mdiDotsVertical, mdiStar, mdiStarOutline } from "@mdi/js";
import Icon from "@mdi/react";
import { ButtonBase, IconButton, Skeleton } from "@mui/material";
import humanizeDuration from "humanize-duration";
import PropTypes from "prop-types";
import R from "ramda";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getItemByItemId, getItemChild } from "_api/item";
import LinkComponent from "_atoms/LinkComponent";

const borderRadius = {
  cabinet: "0px 0px 16px 16px",
  document: "0px 16px 16px 0px",
  card: "16px",
};

// find the initial permisison setting
function DetermineInitPermission(accessGroups, groupObjectArray, readOrEdit) {
  const access =
    readOrEdit === "read"
      ? accessGroups.read.map((elem) => elem.Id)
      : accessGroups.edit.map((elem) => elem.Id);
  let i = 0;
  for (i = 0; i < groupObjectArray.length; i++) {
    if (access.includes(groupObjectArray[i].Id)) {
      break;
    }
  }
  if (i === groupObjectArray.length) {
    return groupObjectArray[i - 1].Id;
  }
  return groupObjectArray[i].Id;
}

// Maximum number o
const LINE_CLAMP = 4;

const content = (item, itemChildren) => {
  if (item == null) return null;

  if (item.type === "card") {
    // Card directly hold content, display summary of it
    return item.content;
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
    }) + " 전"
  );
};

function convertToPlain(html) {
  const tempDivElement = document.createElement("div");
  tempDivElement.innerHTML = html;
  return tempDivElement.textContent || tempDivElement.innerText || "";
}
// type takes "card", "document", "cabinet" values
// refactoring due to change in item schema,
// require sole prop, the item object itself
// Reason : In calling Cards, the Parent already possesses the item array of card from api calls

// TODO: refactor <Card Id="..." /> to <Card itemId="..." />
export default function Card({ Id: itemId }) {
  console.log(`rendering card with ${itemId}`);
  const dispatch = useDispatch();

  // find current user from store
  const { user } = useSelector(R.pick(["user"]));
  const { group } = useSelector(R.pick(["group"]));
  const { userItem } = useSelector(R.pick(["userItem"]));

  // states of item, createdby, and child array
  const [item, setItem] = useState(null);
  const [itemChildren, setItemChildren] = useState(null);
  const [isBookmarked, setBookmarked] = useState(
    user.bookmarks.includes(itemId)
  );

  // const [itemObject, setItemObject] = useState({});
  // const [createdBy, setCreatedBy] = useState("");
  // const [childObjectArray, setchildObjectArray] = useState([]);
  // const [bookmarkBoolean, setBookmarkBoolean] = useState(
  //   user.bookmarks.includes(itemId)
  // );

  // // states used for permission
  // const [permissionId, setPermissionId] = useState("");
  // const [groupObjectArray, setGroupObjectArray] = useState({
  //   groupObjectArray: [],
  // });

  // // set boolean states to handle asynchronous requests
  // const [loadingItem, setLoadingItem] = useState(true);
  // const [loadingChild, setLoadingChild] = useState(true);
  // const [loadingGroup, setLoadingGroup] = useState(true);
  // const [isAvailable, setIsAvailable] = useState(false);
  // const [isDeleted, setIsDeleted] = useState(false);

  // const groupIdArray = group.path.split(",").filter((elem) => elem !== "");

  useEffect(() => {
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
          setItem({ error: response.text });
        });
    }

    // getItemByItemId(itemId).then((item) => {
    //   console.log(`rendering item of ${itemId}`);
    //   const camelItem = snakeToCamelCase(item);
    //   setItemObject(camelItem);
    //   setCreatedBy(camelItem.owner.name);
    //   setLoadingItem(false);
    //   // setting availability of item
    //   setIsAvailable(Match(camelItem.accessGroups.read, group.Id));
    //   getItemChild(camelItem.path).then((childArray) => {
    //     setchildObjectArray(childArray);
    //     setLoadingChild(false);
    //   });
    //   Promise.all(groupIdArray.map((elem) => getGroupByGroupId(elem))).then(
    //     (elemItem) => {
    //       setGroupObjectArray((prevState) => ({
    //         ...prevState,
    //         groupObjectArray: snakeToCamelCase(elemItem),
    //       }));
    //       console.log(`calling setPermission Id : ${itemId}`);
    //       console.log(camelItem.accessGroups);
    //       console.log(snakeToCamelCase(elemItem));
    //       setPermissionId(
    //         DetermineInitPermission(
    //           camelItem.accessGroups,
    //           snakeToCamelCase(elemItem),
    //           "read"
    //         )
    //       );
    //       setLoadingGroup(false);
    //     }
    //   );
    // });
  }, []);

  if (item != null && item.hasOwnProperty("error")) {
    if (item.error.startsWith("Access denied")) return null; // don't render items without permission
  }

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
  //   status: String
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

  console.log(item);

  // const boolSum = loadingItem || loadingChild || loadingGroup;

  // // setting appropriate values to constants
  // const { title, content } = itemObject;
  // const className = `item-${itemObject.type}`;
  // const isArchived = user.bookmarks.includes(itemId);
  // const dateFromNow = "2주 전 수정됨";
  // const innerContent =
  //   itemObject.type === "card" ? content : ArrayToCardItems(childObjectArray);

  // const onDeleteCard = () => {
  //   dispatch(
  //     attemptDeleteItem(
  //       itemId
  //     )
  //   );
  //   setIsDeleted(true);
  // };

  // const onDuplicateCard = () => {
  //   console.log("Duplicating card with onDuplicateCard");
  //   console.log(itemObject.path);
  //   const newString = itemObject.path
  //     .split(",")
  //     .filter((elem) => elem !== "")
  //     .splice(-1)
  //     .join(",");
  //   let newPathString;
  //   switch (itemObject.type) {
  //     case "Cabinet":
  //       newPathString = "";
  //       break;
  //     default:
  //       newPathString = `,${newString},`;
  //   }
  //   const dupObject = {
  //     type: itemObject.type,
  //     title: itemObject.title,
  //     path: newPathString,
  //     content: itemObject.content,
  //     tags: itemObject.tags,
  //     status: itemObject.status,
  //   };
  //   dispatch(attemptDuplicateItem(dupObject));
  // };
  // // fires when change of p ermission from mui-select occurs
  // const onChangePermission = (event) => {
  //   console.log("Changing Permissions with onChangePermission");

  //   // sets the permission state
  //   setPermissionId(event.target.value);
  //   let index = 0;
  //   for (index = 0; index < groupIdArray.length; index++) {
  //     if (groupIdArray[index] === event.target.value) {
  //       break;
  //     }
  //   }
  //   // list of denied / allowed groupIds along the path of group
  //   const deniedList = groupIdArray.slice(0, index);
  //   const accessList = groupObjectArray.slice(index);

  //   // temporary object
  //   let tempAccessReadGroups = itemObject.accessGroups.read;

  //   // from given accessGroups, deletes the "denied" groups while adding the "allowed" groups
  //   tempAccessReadGroups = tempAccessReadGroups.filter(
  //     (elem) => !deniedList.includes(elem.Id)
  //   );
  //   accessList.map((groupObject) => {
  //     if (
  //       !tempAccessReadGroups.read
  //         .map((elem) => elem.Id)
  //         .includes(groupObject.Id)
  //     ) {
  //       tempAccessReadGroups.push(groupObject);
  //     }
  //     return groupObject;
  //   });

  //   const newReadPermission = {
  //     read: tempAccessReadGroups,
  //     edit: itemObject.accessGroups.edit,
  //   };

  //   // actual api request
  //   dispatch(attemptUpdatePermission(itemObject.Id, newReadPermission));
  // };

  console.log(content(item, itemChildren));

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
          backgroundColor: "white",
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
        <div className="item-title">{item.title}</div>
        <div className="item-content">{content(item, itemChildren)}</div>
      </ButtonBase>
      <div className="item-footer">
        <div className="item-description">
          {item.owner.rank} {item.owner.name} · {dateElapsed(item.created)}
        </div>
        <IconButton>
          <Icon size={1} path={isBookmarked ? mdiStar : mdiStarOutline} />
        </IconButton>
        <IconButton>
          <Icon size={1} path={mdiDotsVertical} />
        </IconButton>
      </div>
    </div>
  );
}

// <div className="item-title">{title}</div>
// <div className="item-description">{createdBy}</div>
// <div>
//   {/* passing NoteHeader onClick element, so that upon clicking title can be redirected */}
//   <div className="note-header">
//     <div className="button-group">
//       <CardDropdown
//         groupObjectArray={groupObjectArray.groupObjectArray}
//         onChangePermission={onChangePermission}
//         onDeleteCard={onDeleteCard}
//         permissionId={permissionId}
//       />
//     </div>
//   </div>
//   <div className="description">{createdBy}</div>
//   <div className="container-child">{innerContent}</div>
// </div>
// <NoteFooter dateFromNow={dateFromNow} />

Card.propTypes = {
  Id: PropTypes.string.isRequired,
};
