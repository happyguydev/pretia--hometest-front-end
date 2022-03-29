import { User } from "../constants/userModel";
import { AppListResponse, AppModel } from "../constants/appModel";

const JWT_API_URL = import.meta.env.VITE_JWT_API_URL;

interface ErrorResponse {
  status: "error";
  message: string;
  result: "";
}
interface SuccessResponse<T> {
  status: "success";
  result: T;
}
export type APIResponse<T> = ErrorResponse | SuccessResponse<T>;

const toSuccess = <T>(result: T): SuccessResponse<T> => ({
  status: "success",
  result,
});

const toAPIResponse = async <T>(
  response: Response
): Promise<APIResponse<T>> => {
  const json = await response.json();
  if (response.status >= 200 && response.status < 300) return toSuccess(json);
  return { status: "error", message: json.message, result: "" };
};

const decodeJwt = (token: string) => {
  const base64Url = token.split(".")[1];
  const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
  const jsonPayload = decodeURIComponent(
    atob(base64)
      .split("")
      .map(function (c) {
        return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
      })
      .join("")
  );
  return JSON.parse(jsonPayload);
};

const handleTokenResponse = async (
  response: Response
): Promise<APIResponse<User>> => {
  const json = await response.json();
  if (response.status !== 200) return json;
  window.sessionStorage.setItem("user", JSON.stringify(json.user));
  window.sessionStorage.setItem("accessToken", json.accessToken);
  return toSuccess(json.user);
};

const callAPI = async <T>(url: string, body: T): Promise<Response> => {
  const headers: HeadersInit = { "Content-Type": "application/json" };
  if (window.sessionStorage.getItem("accessToken"))
    headers["Authentication"] = `Bearer ${window.sessionStorage.getItem(
      "accessToken"
    )}`;
  return await fetch(`${JWT_API_URL}${url}`, {
    method: "POST",
    headers,
    body: JSON.stringify(body),
  });
};

const jwtAPI = {
  getAccessToken: () => {
    if (!jwtAPI.hasValidAccessToken()) return null;
    return window.sessionStorage.getItem("accessToken");
  },

  hasValidAccessToken: () => {
    const token = window.sessionStorage.getItem("accessToken");
    if (!token) return false;
    const decoded = decodeJwt(token);
    return new Date().valueOf() / 1000 < decoded.exp;
  },

  getAccessTokenExpiration: (): Date | null => {
    const token = window.sessionStorage.getItem("accessToken");
    if (!token) return null;
    const decoded = decodeJwt(token);
    return new Date(decoded.exp * 1000);
  },

  getUser: (): User | null => {
    if (!jwtAPI.hasValidAccessToken()) return null;
    const stored = window.sessionStorage.getItem("user");
    if (!stored) return null;
    return JSON.parse(stored);
  },

  refreshToken: async (): Promise<APIResponse<User>> => {
    const response = await fetch(`${JWT_API_URL}/refresh`, {
      credentials: "include",
    });
    return handleTokenResponse(response);
  },

  ensureValidAccessToken: () => {
    if (jwtAPI.hasValidAccessToken()) return;
    jwtAPI.refreshToken();
  },

  login: async (
    username: string,
    password: string
  ): Promise<APIResponse<User>> => {
    const response = await callAPI("/login", { username, password });
    return handleTokenResponse(response);
  },

  logout: () => {
    window.sessionStorage.removeItem("accessToken");
    window.sessionStorage.removeItem("user");
  },

  register: async (
    username: string,
    password: string
  ): Promise<APIResponse<User>> => {
    const response = await callAPI("/register", {
      username,
      password,
    });
    return handleTokenResponse(response);
  },

  getAppList: async (): Promise<APIResponse<AppListResponse>> => {
    const response = await fetch(`${JWT_API_URL}/applist`);
    return await toAPIResponse(response);
  },

  createEditApp: async (formData: AppModel): Promise<APIResponse<any>> => {
    const response = await callAPI("/create-edit-app", {
      id: formData.id,
      title: formData.title,
      description: formData.description,
      type: formData.type,
    });
    return await toAPIResponse(response);
  },

  deleteApp: async (ids: string[]): Promise<APIResponse<any>> => {
    const response = await callAPI("/delete-app", { ids });
    return await toAPIResponse(response);
  },
};

export default jwtAPI;
