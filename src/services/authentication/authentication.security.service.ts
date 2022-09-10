import axios from "axios";
import { API_URL, AUTH_HEADER } from "../../environment";
import { TGetTwoFactorEnabledResponse } from "./authentication.types";

export const getIsTwoFactorAuthenticationEnabled = async ({
  userId,
}: {
  userId: string;
}): Promise<TGetTwoFactorEnabledResponse> => {
  const token = sessionStorage.getItem("token");
  try {
    const res = await axios({
      method: "GET",
      url: `${API_URL}/api/user/${userId}/profile/security/tfa/status`,
      withCredentials: true,
      headers: {
        ...AUTH_HEADER,
        "X-JWT-Token": token!,
      },
    });
    return res.data;
  } catch (exception: any) {
    throw new Error(exception.response.data.error);
  }
};
