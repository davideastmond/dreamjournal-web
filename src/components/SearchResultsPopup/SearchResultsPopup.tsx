import "./style.css";

interface ISearchResultsPopupProps {
  onClickAway: () => void;
}
export function SearchResultsPopup(props: ISearchResultsPopupProps) {
  const handleOverlayClick = (event: any) => {
    event.stopPropagation();
    console.log(event.target);
    props.onClickAway && props.onClickAway();
  };
  return (
    <div className="SearchResultsPopup__main" onClick={handleOverlayClick}>
      <div className="SearchResultsPopup__context-menu">
        <p>test</p>
      </div>
    </div>
  );
}

export default SearchResultsPopup;
