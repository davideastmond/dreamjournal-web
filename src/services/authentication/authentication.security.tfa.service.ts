import axios from "axios";
import { API_URL, AUTH_HEADER } from "../../environment";
type TEnrollTFAResponse = {
  token: string;
};
export async function enrollTFA({
  userId,
  ctn,
}: {
  userId: string;
  ctn: string;
}): Promise<TEnrollTFAResponse> {
  const token = sessionStorage.getItem("token");
  try {
    const req = await axios({
      method: "POST",
      url: `${API_URL}/api/user/${userId}/profile/security/tfa/enroll`,
      withCredentials: true,
      headers: {
        ...AUTH_HEADER,
        "X-JWT-Token": token!,
      },
      data: {
        ctn,
      },
    });

    return req.data;
  } catch (exception: any) {
    throw new Error(exception.response.data.error);
  }
}

export async function submitVerifyTFA({
  userId,
  authCode,
  tfaToken,
}: {
  userId: string;
  authCode: string;
  tfaToken: string;
}): Promise<void> {
  const token = sessionStorage.getItem("token");
  try {
    await axios({
      method: "POST",
      url: `${API_URL}/api/auth/security/tfa/verify`,
      withCredentials: true,
      headers: {
        ...AUTH_HEADER,
        "X-JWT-Token": token!,
      },
      data: {
        userId,
        authCode,
        tfaToken,
      },
    });
  } catch (exception: any) {
    throw new Error(exception.response.data.error);
  }
}
