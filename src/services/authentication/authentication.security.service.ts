import axios from "axios";
import { API_URL, AUTH_HEADER } from "../../environment";
import {
  TNewSecurityQuestionDataSubmission,
  TSecurityQuestionTemplate,
} from "./authentication.types";

export const getAvailableSecurityQuestions = async (): Promise<
  TSecurityQuestionTemplate[]
> => {
  const token = sessionStorage.getItem("token");
  try {
    const req = await axios({
      method: "GET",
      url: `${API_URL}/api/auth/security/questions`,
      withCredentials: true,
      headers: {
        ...AUTH_HEADER,
        "X-JWT-Token": token!,
      },
    });
    return req.data as TSecurityQuestionTemplate[];
  } catch (exception: any) {
    throw new Error(exception.response.data.error);
  }
};

export const getSecurityQuestionsForUserByUserId = async ({
  userId,
}: {
  userId: string;
}): Promise<{ isSet: boolean; questions: TSecurityQuestionTemplate[] }> => {
  const token = sessionStorage.getItem("token");
  try {
    const req = await axios({
      method: "GET",
      url: `${API_URL}/api/user/${userId}/security`,
      withCredentials: true,
      headers: {
        ...AUTH_HEADER,
        "X-JWT-Token": token!,
      },
    });
    console.log(req.data);
    return req.data;
  } catch (exception: any) {
    throw new Error(exception.response.data.error);
  }
};

export const sendSecurityQuestionsSelection = async ({
  userId,
  data,
}: {
  data: TNewSecurityQuestionDataSubmission;
  userId: string;
}): Promise<void> => {
  const token = sessionStorage.getItem("token");
  try {
    await axios({
      method: "PUT",
      url: `${API_URL}/api/user/${userId}/security`,
      withCredentials: true,
      headers: {
        ...AUTH_HEADER,
        "X-JWT-Token": token!,
      },
      data,
    });
  } catch (exception: any) {
    throw new Error(exception.response.data.error);
  }
};
