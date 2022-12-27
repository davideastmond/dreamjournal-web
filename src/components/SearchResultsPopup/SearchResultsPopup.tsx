import {
  TSearchResults,
  TJournalMatchInstance,
  MatchingCriteria,
  TJournalEntryMatchInstance,
} from "../../services/search/search.types";

import { SearchResultCard } from "./components/SearchResultCard";
import "./style.css";
interface ISearchResultsPopupProps {
  onClickAway?: () => void;
  searchData?: TSearchResults;
}

const EmptyResultCard = () => {
  return (
    <div className="SearchResultCard__empty">
      <div className="SearchResultCard__empty_text top-bottom-padding">
        No results
      </div>
    </div>
  );
};

function renderJournalResults(
  journalMatches: TJournalMatchInstance[],
  queryString: string
): JSX.Element[] {
  return journalMatches.map((journalMatch, index) => {
    if (journalMatch.matchedBy === MatchingCriteria.JournalTags) {
      return (
        <SearchResultCard
          kind={"tag"}
          data={journalMatch}
          queryString={queryString}
          key={`${journalMatch.journal._id}_JournalTag_${index}`}
        />
      );
    } else {
      return (
        <SearchResultCard
          kind={"journal"}
          data={journalMatch}
          queryString={queryString}
          key={`${journalMatch.journal._id}_DefaultJournal_${index}`}
        />
      );
    }
  });
}

function renderJournalEntryResults(
  journalEntryMatches: TJournalEntryMatchInstance[],
  queryString: string
): JSX.Element[] {
  return journalEntryMatches.map((entryMatch, index) => {
    if (entryMatch.matchedBy === MatchingCriteria.JournalEntryTags) {
      return (
        <SearchResultCard
          kind={"tag"}
          data={entryMatch}
          queryString={queryString}
          key={`${entryMatch.journalEntry._id}_JE_Tag_${index}`}
        />
      );
    } else if (entryMatch.matchedBy === MatchingCriteria.JournalEntryText) {
      return (
        <SearchResultCard
          kind={"journalEntry"}
          data={entryMatch}
          queryString={queryString}
          key={`${entryMatch.journalEntry._id}_DefaultJE_${index}`}
        />
      );
    } else {
      return <></>;
    }
  });
}

export function SearchResultsPopup(props: ISearchResultsPopupProps) {
  const handleOverlayClick = (event: any) => {
    event.stopPropagation();
    props.onClickAway && props.onClickAway();
  };

  const hasSearchData = (): boolean => {
    if (!props.searchData) return false;
    if (
      props.searchData.journalEntries?.length === 0 &&
      props.searchData.journals?.length === 0
    )
      return false;
    return true;
  };
  console.log("hasSearchData?", hasSearchData());
  console.log("actualSearchData", props.searchData);
  return (
    <div
      className="SearchResultsPopup__main context-menu-fade-in"
      onClick={handleOverlayClick}
    >
      <div className="SearchResultsPopup__context-menu slight-round-corners">
        {hasSearchData() === false && <EmptyResultCard />}
        {hasSearchData() === true &&
          props.searchData?.journals &&
          props.searchData.journals.length > 0 &&
          renderJournalResults(
            props.searchData.journals,
            props.searchData.queryString
          )}
        {hasSearchData() === true &&
          props.searchData?.journalEntries &&
          props.searchData.journalEntries?.length > 0 &&
          renderJournalEntryResults(
            props.searchData?.journalEntries,
            props.searchData.queryString
          )}
      </div>
    </div>
  );
}

export default SearchResultsPopup;
