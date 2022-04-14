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
export type TJournalEntryMatchInstance = TJournalEntry & {
  matchedBy: MatchingCriteria;
};

export type TJournalMatchInstance = TJournal & {
  matchedBy: MatchingCriteria;
};

export type TSearchResults = {
  journalEntries: TJournalEntryMatchInstance[];
  journals: TJournalMatchInstance[];
};
