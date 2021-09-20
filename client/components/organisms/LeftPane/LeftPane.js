import React from 'react';
import { useDispatch } from 'react-redux';

import Menu from 'react-bulma-companion/lib/Menu';

import Pink_trapezoid from '_assets/svgs/pink_trapezoid.svg'
import Logo from '_assets/svgs/logo.svg'

import ProfileMenu from '_molecules/ProfileMenu';
import MenuElem from '_molecules/MenuElem'

//function CreateGroupArr(groups = []){
//  ~~
//}

function ElemList(groups_arr){
  return(
    groups_arr.map(group=>(
      <MenuElem key = {group._id} str_value = {group.name}/>
    ))
  )
}


export default function LeftPane({name, rank, title, groups_arr}) {
  const dispatch = useDispatch();

  //const { user } = useSelector(R.pick(['user']));

  //const {name, rank, title, groups} = user;
  //const groups_arr = CreateGroupArr(groups);

  return (
    <div  className = "leftmenu-box">
      <div className = "red-leftmenu-header">
        <img className = "logo" src={Logo} draggable="false"/>
        <img className = "trapezoid" src={Pink_trapezoid} draggable="false"/>
        
      </div>
      <ProfileMenu name = {name} rank = {rank} title = {title} position = "인사담당관"/>
      <Menu className = "leftmenu-menu">
        <Menu.Label className ="leftmenu-label">
          내 서랍
        </Menu.Label>
        <Menu.List>
          {ElemList(groups_arr)}
        </Menu.List>
        <Menu.Label className ="leftmenu-label">
          내 문서
        </Menu.Label>
        <Menu.List>
          <MenuElem str_value = "내가 작성한" />
          <MenuElem str_value = "최근에 본" />
          <MenuElem str_value = "북마크" />
          <MenuElem str_value = "임시저장" />
        </Menu.List>
        <Menu.Label className ="leftmenu-label">
          기타
        </Menu.Label>
        <Menu.List>
          <MenuElem str_value = "도움말" />
        </Menu.List>
      </Menu>
    </div>
  );
}
