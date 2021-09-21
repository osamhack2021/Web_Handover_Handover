import React from 'react';
import { Link } from 'react-router-dom';

// import "_styles/leftmenu.scss"

export default function MenuItem({ title, link = '/' }) {
  return (
    <Link to={link} className="menulistitem">{title}</Link>
  );
}
