export type TSecureUser = {
  _id: string;
  email: string;
  firstName: string;
  lastName: string;
  journalIds: { [keyof: string]: Date };
  dateOfBirth: Date;
  createdAt: Date;
  updatedAt: Date;
};

export type T2FADeEnrollResponse = {
  status: "error" | "ok" | string;
  twoFactorEnabled: boolean;
  statusMessage: string;
  redirectPath?: string;
};
