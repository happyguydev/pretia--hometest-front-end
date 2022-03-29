import React from "react";
import { Link as RouterLink, LinkProps } from "react-router-dom";
import { Link as MuiLink } from "@mui/material";

const Link: React.FC<LinkProps> = (props) => (
  <MuiLink component={RouterLink} {...props}>
    {props.children}
  </MuiLink>
);

export default Link;
