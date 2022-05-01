import axios from "axios";
import { API_URL, AUTH_HEADER } from "../../environment";
import {
  TJournalByIdTagAnalyticsResponseData,
  TUserJournalTagAnalyticsResponseData,
} from "./journal.analytics.types";

export const getTagCountByJournalId = async ({
  journalId,
}: {
  journalId: string;
}): Promise<TJournalByIdTagAnalyticsResponseData> => {
  const token = sessionStorage.getItem("token");
  try {
    const req = await axios({
      method: "GET",
      url: `${API_URL}/api/journal/${journalId}/tags/analytics`,
      withCredentials: true,
      headers: {
        ...AUTH_HEADER,
        "X-JWT-Token": token!,
      },
    });
    return req.data;
  } catch (exception: any) {
    console.error("Exception " + exception);
    throw new Error(exception.message);
  }
};

export const getAllTagsCountByUserId = async ({
  userId,
}: {
  userId: string;
}): Promise<TUserJournalTagAnalyticsResponseData> => {
  const token = sessionStorage.getItem("token");
  try {
    const req = await axios({
      method: "GET",
      url: `${API_URL}/api/user/${userId}/journals/tags/analytics`,
      withCredentials: true,
      headers: {
        ...AUTH_HEADER,
        "X-JWT-Token": token!,
      },
    });
    return req.data;
  } catch (exception: any) {
    console.error("Exception " + exception);
    throw new Error(exception.message);
  }
};
