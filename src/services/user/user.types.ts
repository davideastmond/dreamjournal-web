export type TSecureUser = {
  _id: string;
  email: string;
  firstName: string;
  lastName: string;
  journalIds: { [keyof: string]: Date };
  createdAt: Date;
  updatedAt: Date;
};
