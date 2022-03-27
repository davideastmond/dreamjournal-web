import { TSecureUser } from "../user/user.types";

export type TJournal = {
  _id: string;
  title: string;
  ownerId: string;
  tags?: string[];
  photoUrl?: string;
  description?: string;
  journalEntries: Array<TJournalEntry>;
  createdAt: Date;
  updatedAt: Date;
};

export type TJournalEntry = {
  _id: string;
  parentJournalId: string;
  ownerId: string;
  title: string;
  description?: string;
  text: string;
  photoUrl?: string;
  tags: string[];
  createdAt?: Date;
  updatedAt?: Date;
};

export type TNewJournalReturnData = {
  user: TSecureUser;
  journal: TJournal;
};

export type TTitlePatchRequest = {
  title: { action: "update" | "delete"; data: string };
};
export type TDescriptionPatchRequest = {
  description: { action: "update" | "delete"; data: string };
};
export type TTagsPatchRequest = {
  tags: { action: "update" | "delete"; data: string[] };
};
export type TPhotoURLPatchRequest = {
  photoUrl: { action: "update" | "delete"; data: string };
};

export type TUpdateAction = "update" | "delete";

export type TJournalFieldUpdateAction = {
  field: "title" | "tags" | "description" | "photoUrl" | "no changes";
  action: TUpdateAction;
  data?: string | string[] | null;
};
export type TJournalAttributesReturnData = {
  actionsTaken: TJournalFieldUpdateAction[];
  journal: TJournal | null;
};

export type TJournalDeleteResult = {
  info: {
    actionTaken: "delete" | "none";
    otherInfo?: string;
    deletedJournalId: string;
  };
  user: TSecureUser;
  journals: TJournal[];
};
