import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { snakeToCamelCase } from 'json-style-converter/es5';
import PropTypes from 'prop-types';
import { useHistory } from 'react-router-dom';
import R from 'ramda';

import { PromiseGroupArray } from '_utils/promiseArray';
import { getItemByItemId, getItemChild } from '_api/item';
import { attemptUpdatePermission } from '_thunks/item';
import { getGroupByGroupId } from '_api/group';
import CardDropdown from '_molecules/CardDropdown';
import NoteFooter from '../NoteFooter';
import CardItem from '../CardItem';

function ArrayToCardItems(array) {
  return array.map((elem) => <CardItem value={elem} key={elem.Id} />);
}

function Match(array, Id) {
  return array.filter((elem) => elem.Id === Id).length;
}

// find the initial permisison setting
function DetermineInitPermission(accessGroups, groupObjectArray, readOrEdit) {
  const access = (readOrEdit === 'read') ? accessGroups.read.map((elem) => elem.Id) : accessGroups.edit.map((elem) => elem.Id);
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
// type takes "card", "document", "cabinet" values
// refactoring due to change in item schema,
// require sole prop, the item object itself
// Reason : In calling Cards, the Parent already possesses the item array of card from api calls

export default function Card({ Id }) {
  console.log(`rendering card with ${Id}`);
  const history = useHistory();

  // find current user from store
  const { user } = useSelector(R.pick(['user']));
  const { group } = useSelector(R.pick(['group']));

  // states of item, createdby, and child array
  const [itemObject, setItemObject] = useState({});
  const [createdBy, setCreatedBy] = useState('');
  const [childObjectArray, setchildObjectArray] = useState([]);

  // states used for permission
  const [permissionId, setPermissionId] = useState('');
  const [groupObjectArray, setGroupObjectArray] = useState({ groupObjectArray: [] });

  // set boolean states to handle asynchronous requests
  const [loadingItem, setLoadingItem] = useState(true);
  const [loadingChild, setLoadingChild] = useState(true);
  const [loadingGroup, setLoadingGroup] = useState(true);
  const [isAvailable, setIsAvailable] = useState(false);

  const groupIdArray = group.path.split(',').filter((elem) => elem !== '');

  useEffect(() => {
    getItemByItemId(Id).then((item) => {
      console.log(`rendering item of ${Id}`);
      const camelItem = snakeToCamelCase(item);
      setItemObject(camelItem);
      setCreatedBy(camelItem.owner.name);
      setLoadingItem(false);
      // setting availability of item
      setIsAvailable(Match(camelItem.accessGroups.read, group.Id));
      getItemChild(camelItem.path).then((childArray) => {
        setchildObjectArray(childArray);
        setLoadingChild(false);
      });
      Promise.all(groupIdArray.map((elem) => getGroupByGroupId(elem))).then((elemItem) => {
        setGroupObjectArray((prevState) => ({
          ...prevState,
          groupObjectArray: snakeToCamelCase(elemItem),
        }
        ));
        console.log(`calling setPermission Id : ${Id}`);
        console.log(camelItem.accessGroups);
        console.log(snakeToCamelCase(elemItem));
        setPermissionId(DetermineInitPermission(camelItem.accessGroups, snakeToCamelCase(elemItem), 'read'));
        setLoadingGroup(false);
      });
    });
  }, []);

  const boolSum = loadingItem || loadingChild || loadingGroup;

  // setting appropriate values to constants
  const { title, content } = itemObject;
  const className = `note--${itemObject.type}`;
  const isArchived = user.bookmarks.includes(Id);
  const dateFromNow = '2주 전 수정됨';
  const routeChange = () => {
    const path = `/item/${Id}`;
    history.push(path);
  };
  const innerContent = (itemObject.type === 'card' ? content : ArrayToCardItems(childObjectArray));

  const onDeleteCard = (event) => {
    console.log('Deleting Card with onDeleteCard');
  };

  // fires when change of permission from mui-select occurs
  const onChangePermission = (event) => {
    console.log('Changing Permissions with onChangePermission');

    // sets the permission state
    setPermissionId(event.target.value);
    let index = 0;
    for (index = 0; index < groupIdArray.length; index++) {
      if (groupIdArray[index] === event.target.value) {
        break;
      }
    }
    // list of denied / allowed groupIds along the path of group
    const deniedList = groupIdArray.slice(0, index);
    const accessList = groupObjectArray.slice(index);

    // temporary object
    let tempAccessReadGroups = itemObject.accessGroups.read;

    // from given accessGroups, deletes the "denied" groups while adding the "allowed" groups
    tempAccessReadGroups = tempAccessReadGroups.filter((elem) => !deniedList.includes(elem.Id));
    accessList.map((groupObject) => {
      if (!tempAccessReadGroups.read.map((elem) => elem.Id).includes(groupObject.Id)) {
        tempAccessReadGroups.push(groupObject);
      }
      return groupObject;
    });

    const newReadPermission = {
      read: tempAccessReadGroups,
      edit: itemObject.accessGroups.edit,
    };

    // actual api request
    attemptUpdatePermission(itemObject.Id, newReadPermission);
  };

  return !boolSum && (
    <div className={className}>
      <div>
        {/* passing NoteHeader onClick element, so that upon clicking title can be redirected */}
        <div className="note-header">
          <div className="main-title" onClick={routeChange}>
            {title}
          </div>
          <div className="button-group">
            <CardDropdown
              groupObjectArray={groupObjectArray.groupObjectArray}
              onChangePermission={onChangePermission}
              permissionId={permissionId}
            />
          </div>
        </div>
        <div className="description">
          {createdBy}
        </div>
        <div className="container-child">
          {innerContent}
        </div>
      </div>
      <NoteFooter dateFromNow={dateFromNow} />
    </div>
  );
}

Card.propTypes = {
  Id: PropTypes.string.isRequired,
};
