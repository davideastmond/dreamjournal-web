export type TJournal = {
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
