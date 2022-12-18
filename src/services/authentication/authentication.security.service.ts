import axios from "axios";
import { API_URL, AUTH_HEADER } from "../../environment";
import { AuthenticationRecoveryRequestResponseData } from "./definitions";

export async function requestPasswordRecovery({
  email,
  dateOfBirth,
}: {
  email: string;
  dateOfBirth: string;
}): Promise<void> {
  // Send request
  try {
    await axios({
      method: "POST",
      url: `${API_URL}/api/auth/password-recovery/request`,
      withCredentials: true,
      headers: {
        ...AUTH_HEADER,
      },
      data: {
        email,
        dateOfBirth,
      },
    });
  } catch (exception: any) {
    throw new Error(exception.message);
  }
}

export async function authenticatePasswordRecoveryRequest(
  encryptedToken: string
): Promise<AuthenticationRecoveryRequestResponseData> {
  try {
    const res = await axios({
      method: "POST",
      url: `${API_URL}/api/auth/password-recovery/authenticate`,
      withCredentials: true,
      headers: {
        ...AUTH_HEADER,
      },
      data: {
        encryptedToken,
      },
    });
    return res.data; // if this is a success, we need to store the acceptanceToken
  } catch (err: any) {
    throw new Error("Unable to authenticate this request");
  }
}

export async function sendPasswordResetData({
  encryptedToken,
  plainTextPassword,
  acceptanceToken,
}: {
  encryptedToken: string;
  plainTextPassword: string;
  acceptanceToken: string;
}): Promise<void> {
  /**
   * Submit a post request to server containing the encrypted and acceptance tokens and the new password
   */
  try {
    await axios({
      method: "POST",
      url: `${API_URL}/api/auth/password-recovery/complete`,
      withCredentials: true,
      headers: {
        ...AUTH_HEADER,
      },
      data: {
        encryptedToken,
        plainTextPassword,
        acceptanceToken,
      },
    });
  } catch (err: any) {
    throw new Error(
      `Submit new password request -- cannot authenticate this due to ${err.message}`
    );
  }
}
