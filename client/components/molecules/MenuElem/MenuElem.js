import React from "react";
import { Link } from "react-router-dom";


// import "_styles/leftmenu.scss"

function MenuElem({str_value, link = '/'}){
    return (
        <Link to = {link} className = "menulistitem">{str_value}</Link>
    )
}

export default MenuElem;