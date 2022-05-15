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

export const patchUserProfile = async ({
  firstName,
  lastName,
  userId,
}: {
  firstName: string;
  lastName: string;
  userId: string;
}): Promise<TSecureUser> => {
  const token = sessionStorage.getItem("token");
  try {
    const req = await axios({
      method: "PATCH",
      url: `${API_URL}/api/user/${userId}/profile/basic`,
      withCredentials: true,
      headers: {
        ...AUTH_HEADER,
        "X-JWT-Token": token!,
      },
      data: {
        firstName,
        lastName,
      },
    });
    return req.data as TSecureUser;
  } catch (exception: any) {
    throw new Error(exception.response.data.error);
  }
};

export const patchUserSecurePassword = async ({
  password,
  userId,
}: {
  password: string;
  userId: string;
}): Promise<void> => {
  const token = sessionStorage.getItem("token");
  try {
    await axios({
      method: "PATCH",
      url: `${API_URL}/api/user/${userId}/profile/secure`,
      withCredentials: true,
      headers: {
        ...AUTH_HEADER,
        "X-JWT-Token": token!,
      },
      data: {
        password,
      },
    });
  } catch (exception: any) {
    throw new Error(exception.response.data.error);
  }
};
