import React from "react";
import { BrowserRouter, Outlet, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@mui/material/styles";

import { AuthContextProvider } from "./services/AuthProvider";

import AppNavBar from "./components/AppNavBar";
import theme from "./utils/palette";

import Home from "./pages/Home";
import NotFound from "./pages/NotFound";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";

const Layout: React.FC = () => {
  return (
    <div>
      <AppNavBar />
      <Outlet />
    </div>
  );
};

function App() {
  return (
    <ThemeProvider theme={theme}>
      <AuthContextProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route path="login" element={<Login />} />
              <Route path="register" element={<Register />} />
              <Route index element={<Home />} />
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </AuthContextProvider>
    </ThemeProvider>
  );
}

export default App;
