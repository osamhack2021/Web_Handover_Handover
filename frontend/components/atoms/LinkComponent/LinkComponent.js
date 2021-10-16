import React from "react";
import { Link } from "react-router-dom";

// Component used to render MUI components as React Router
// <Link> components using MUI's `component` property.
// Read more here: https://mui.com/guides/composition/#caveat-with-refs
export default React.forwardRef((props, ref) => (
  <Link {...props} ref={ref}>
    {props.children}
  </Link>
));
