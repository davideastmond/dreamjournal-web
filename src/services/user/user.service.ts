import axios from "axios";
import { API_URL, AUTH_HEADER } from "../../environment";
import { TSecureUser } from "./user.types";

export const getSessionUser = async (): Promise<TSecureUser> => {
  const token = sessionStorage.getItem("token");
  try {
    const req = await axios({
      method: "GET",
      url: `${API_URL}/api/user/me`,
      withCredentials: true,
      headers: {
        ...AUTH_HEADER,
        "X-JWT-Token": token!,
      },
    });
    return req.data as TSecureUser;
  } catch (exception: any) {
    throw new Error(exception.response.data.error);
  }
};
