import React from "react";
import jwtApi, { APIResponse } from "./jwtApi";
import { User } from "../constants/userModel";

interface AuthInfo {
  user: User | null;
  login: (username: string, password: string) => Promise<APIResponse<User>>;
  logout: () => void;
  register: (
    username: string,
    password: string
  ) => Promise<APIResponse<User>>;
}

const AuthContext = React.createContext<AuthInfo>({
  user: jwtApi.getUser(),
  login: (un, p) => jwtApi.login(un, p),
  logout: () => jwtApi.logout(),
  register: (un, p) =>
    jwtApi.register(un, p),
});
export default AuthContext;

export const AuthContextProvider: React.FC = ({ children }) => {
  const [user, setUser] = React.useState(jwtApi.getUser());
  const timeout = React.useRef<NodeJS.Timeout>();

  const checkUserExpiration = () => {
    if (timeout.current) clearTimeout(timeout.current);
    const expiration = jwtApi.getAccessTokenExpiration();
    if (!expiration) return setUser(null);
    console.log(
      "seconds until expiration",
      (new Date().valueOf() - expiration.valueOf()) / 1000
    );
    timeout.current = setTimeout(
      () => checkUserExpiration,
      (new Date().valueOf() - expiration.valueOf()) / 1000 + 2000
    );
  };

  const login = async (username: string, password: string) => {
    const response = await jwtApi.login(username, password);
    setUser(response.status === "success" ? response.result : null);
    checkUserExpiration();
    return response;
  };

  const logout = () => {
    jwtApi.logout();
    setUser(null);
  };

  const register = async (
    username: string,
    password: string
  ) => {
    const response = await jwtApi.register(
      username,
      password
    );
    setUser(jwtApi.getUser());
    checkUserExpiration();
    return response;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        register,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
