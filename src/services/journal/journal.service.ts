import {
  TDescriptionPatchRequest,
  TJournal,
  TJournalDeleteResult,
  TNewJournalReturnData,
  TPhotoURLPatchRequest,
  TTagsPatchRequest,
  TTitlePatchRequest,
} from "./journal.types";
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
      console.log("22", req.data);
      return req.data as TJournal[];
    } else return [];
  } catch (exception: any) {
    throw new Error(exception.response.data.error);
  }
};

export const submitNewJournal = async ({
  userId,
  title,
  description,
  tags,
}: {
  userId: string;
  title: string;
  description: string;
  tags?: string[];
}): Promise<TNewJournalReturnData> => {
  const token = sessionStorage.getItem("token");
  try {
    const req = await axios({
      method: "POST",
      url: `${API_URL}/api/user/${userId}/journals`,
      withCredentials: true,
      headers: {
        ...AUTH_HEADER,
        "X-JWT-Token": token!,
      },
      data: {
        title,
        description,
        tags,
      },
    });
    console.log(req.data);
    return req.data;
  } catch (exception: any) {
    throw new Error(exception.message);
  }
};

export const patchJournalAttribute = async ({
  journalId,
  patchObject,
}: {
  journalId: string;
  patchObject:
    | TTitlePatchRequest
    | TDescriptionPatchRequest
    | TTagsPatchRequest
    | TPhotoURLPatchRequest;
}) => {
  const token = sessionStorage.getItem("token");
  try {
    const req = await axios({
      method: "PATCH",
      url: `${API_URL}/api/journal/${journalId}`,
      withCredentials: true,
      headers: {
        ...AUTH_HEADER,
        "X-JWT-Token": token!,
      },
      data: {
        ...patchObject,
      },
    });

    console.log(req.data);
  } catch (exception: any) {
    throw new Error(exception.message);
  }
};

export const deleteJournalById = async ({
  journalId,
}: {
  journalId: string;
}): Promise<TJournalDeleteResult> => {
  const token = sessionStorage.getItem("token");
  try {
    const req = await axios({
      method: "DELETE",
      url: `${API_URL}/api/journal/${journalId}`,
      withCredentials: true,
      headers: {
        ...AUTH_HEADER,
        "X-JWT-Token": token!,
      },
    });
    return req.data;
  } catch (exception: any) {
    throw new Error(exception.message);
  }
};

export const addEntryToJournal = async ({
  journalId,
  title,
  description,
  text,
  photoUrl,
  tags,
}: {
  journalId: string;
  title: string;
  description: string;
  text: string;
  photoUrl?: string;
  tags?: string[];
}): Promise<TJournal> => {
  const token = sessionStorage.getItem("token");

  try {
    const req = await axios({
      method: "PUT",
      url: `${API_URL}/api/journal/${journalId}/entry`,
      withCredentials: true,
      headers: {
        ...AUTH_HEADER,
        "X-JWT-Token": token!,
      },
      data: {
        title,
        description,
        text,
        photoUrl,
        tags,
      },
    });
    return req.data;
  } catch (exception: any) {
    throw new Error(exception.message);
  }
};
