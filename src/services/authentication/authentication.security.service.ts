import axios from "axios";
import { API_URL, AUTH_HEADER } from "../../environment";
import { TSecurityQuestionTemplate } from "./authentication.types";

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
}): Promise<TSecurityQuestionTemplate[]> => {
  return [];
};
