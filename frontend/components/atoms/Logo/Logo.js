import React from "react";

export default function Logo({ ...props }) {
  return <img className="logo" src="/icons/logo.svg" {...props} />;
}
