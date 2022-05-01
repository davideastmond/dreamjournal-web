import { TJournal, TJournalEntry } from "../journal/journal.types";
export enum MatchingCriteria {
  JournalTitle = "journalTitle",
  JournalDescription = "journalDescription",
  JournalTags = "journalTags",
  JournalCreateDate = "journalCreateDate",
  JournalUpdatedDate = "journalUpdatedDate",

  JournalEntryTitle = "journalEntryTitle",
  JournalEntryDescription = "journalEntryDescription",
  JournalEntryTags = "journalEntryTags",
  JournalEntryText = "journalEntryText",
  journalEntryCreateDate = "journalEntryCreateDate",
  JournalEntryUpdatedDate = "journalEntryUpdatedDate",

  Default = "default",
}
export type TJournalEntryMatchInstance = {
  journalEntry: TJournalEntry;
  matchedBy: MatchingCriteria;
};

export type TJournalMatchInstance = {
  journal: TJournal;
  matchedBy: MatchingCriteria;
};

export type TSearchResults = {
  queryString: string;
  journalEntries: TJournalEntryMatchInstance[];
  journals: TJournalMatchInstance[];
};
