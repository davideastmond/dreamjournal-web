import axios from "axios";
import { API_URL, AUTH_HEADER } from "../../environment";
import { TLoginResponseData } from "../services.types";
import { TRegistrationRequestDetails } from "./authentication.types";
export const registerUser = async (data: TRegistrationRequestDetails) => {
  try {
    await axios({
      url: `${API_URL}/api/auth/register`,
      method: "POST",
      withCredentials: true,
      headers: AUTH_HEADER,
      data: {
        firstName: data.firstName,
        lastName: data.lastName,
        password: data.plainTextPassword,
        email: data.email,
      },
    });
    await logInUser({ email: data.email, password: data.plainTextPassword });
    data.onSuccess();
  } catch (exception: any) {
    data.onError(`${exception.response.data.error}`);
  }
};

export const logInUser = async ({
  email,
  password,
}: {
  email: string;
  password: string;
}): Promise<TLoginResponseData> => {
  try {
    const req = await axios({
      url: `${API_URL}/api/auth/login`,
      method: "POST",
      withCredentials: true,
      headers: AUTH_HEADER,
      data: {
        email,
        password,
      },
    });
    if (req.status === 200) {
      writeTokenDataToSessionStorage(req.data);
      return req.data;
    } else {
      throw new Error("Received some other status than 200 from login request");
    }
  } catch (exception: any) {
    throw new Error(`${exception.response.data.error}`);
  }
};

function writeTokenDataToSessionStorage(data: TLoginResponseData) {
  sessionStorage.setItem("token", data.token);
  sessionStorage.setItem("issued", JSON.stringify(data.issued));
  sessionStorage.setItem("expires", JSON.stringify(data.expires));
}

export const verifyActiveSession = async (): Promise<boolean> => {
  const token = sessionStorage.getItem("token");
  //if (!token) return false;

  try {
    const res = await axios({
      url: `${API_URL}/api/auth/session`,
      method: "GET",
      withCredentials: true,
      headers: {
        ...AUTH_HEADER,
        "x-jwt-token": token!,
      },
    });

    if (res.data.response === "OK") return true;
    const renewedToken = res.headers["x-renewed-jwt-token"];
    const activeToken = res.headers["x-jwt-token"];
    if (activeToken) {
      sessionStorage.setItem("token", activeToken);
      return true;
    }

    if (renewedToken) {
      return true;
    }
    return false;
  } catch (exception) {
    return false;
  }
};
