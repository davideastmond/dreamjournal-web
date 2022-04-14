import {
  TSearchResults,
  TJournalMatchInstance,
  MatchingCriteria,
} from "../../services/search/search.types";
import { SearchResultCard } from "./components/SearchResultCard";
import "./style.css";

interface ISearchResultsPopupProps {
  onClickAway: () => void;
  searchData: TSearchResults;
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
  journalMatches: TJournalMatchInstance[]
): JSX.Element[] {
  return journalMatches.map((journalMatch) => {
    if (journalMatch.matchedBy === MatchingCriteria.JournalTags) {
      return <SearchResultCard kind={"tag"} data={journalMatch} />;
    } else {
      return <SearchResultCard kind={"journal"} data={journalMatch} />;
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
      props.searchData.journalEntries.length === 0 &&
      props.searchData.journals.length === 0
    )
      return false;
    return true;
  };

  return (
    <div className="SearchResultsPopup__main" onClick={handleOverlayClick}>
      <div className="SearchResultsPopup__context-menu">
        {/* <SearchResultCard kind="journal" key={2} />
        <SearchResultCard kind="journalEntry" key={1}  />
        <SearchResultCard kind="tag" key={0}  /> */}
        {hasSearchData() === false && <EmptyResultCard />}
        {hasSearchData() &&
          props.searchData.journals.length > 0 &&
          renderJournalResults(props.searchData.journals)}
      </div>
    </div>
  );
}

export default SearchResultsPopup;
