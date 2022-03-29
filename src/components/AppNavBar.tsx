import React from "react";
import { useNavigate } from "react-router";
import { LinkProps } from "react-router-dom";

import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";

import "./styles.scss";
import AuthContext from "../services/AuthProvider";
import Link from "./Link";

const AppLink: React.FC<LinkProps> = ({ children, ...props }) => (
  <Link className="navbar__link" {...props}>
    {children}
  </Link>
);

const AnonymousOnly: React.FC = ({ children }) => {
  const { user } = React.useContext(AuthContext);
  return !user ? <>{children}</> : null;
};

const UserOnly: React.FC = ({ children }) => {
  const { user } = React.useContext(AuthContext);
  return user ? <>{children}</> : null;
};

function AppNavBar() {
  const navigate = useNavigate();
  const { logout } = React.useContext(AuthContext);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <AppBar
      position="static"
      sx={{
        mb: 2,
      }}
      className="navbar"
    >
      <Container maxWidth="lg">
        <Toolbar disableGutters>
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{ mr: 3, display: "flex" }}
          >
            LOGO
          </Typography>
          <Box sx={{ flexGrow: 1, display: "flex" }}>
            <AppLink to="/">Home</AppLink>
          </Box>

          <Box sx={{ display: "flex" }}>
            <UserOnly>
              <AppLink to="/">Apps</AppLink>
              <AppLink to="/" onClick={handleLogout}>Logout</AppLink>
            </UserOnly>
            <AnonymousOnly>
              <AppLink to="/register">Register</AppLink>
              <AppLink to="/login">Login</AppLink>
            </AnonymousOnly>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}

export default AppNavBar;
