export type TJournalByIdTagAnalyticsResponseData = {
  journalId: string;
  tagCount: { [keyof: string]: number };
};

export type TUserJournalTagAnalyticsResponseData = {
  journalCount: number;
  tagCount: { [keyof: string]: number };
};
