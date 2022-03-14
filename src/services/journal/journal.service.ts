import { TJournal } from "./journal.types";
import axios from "axios";
import { API_URL, AUTH_HEADER } from "../../environment";

export const getAllJournalsForUser = async (
  userId: string
): Promise<TJournal[]> => {
  const token = sessionStorage.getItem("token");

  try {
    const req = await axios({
      method: "GET",
      url: `${API_URL}/api/user/${userId}/journals`,
      withCredentials: true,
      headers: {
        ...AUTH_HEADER,
        "X-JWT-Token": token!,
      },
    });
    if (req.status === 200) {
      return req.data as TJournal[];
    } else return [];
  } catch (exception: any) {
    throw new Error(exception.response.data.error);
  }
};
