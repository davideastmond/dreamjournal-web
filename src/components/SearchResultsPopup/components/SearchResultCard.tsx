import JournalIcon from "@mui/icons-material/Book";
import JournalEntryIcon from "@mui/icons-material/Article";
import TagIcon from "@mui/icons-material/Tag";
import {
  TJournalEntryMatchInstance,
  TJournalMatchInstance,
} from "../../../services/search/search.types";

type TIconType = "journal" | "journalEntry" | "tag";

interface ISearchResultCardProps {
  kind: TIconType;
  data: TJournalEntryMatchInstance | TJournalMatchInstance;
}

const getIconType = (kind: TIconType) => {
  switch (kind) {
    case "journal":
      return <JournalIcon color="success" />;
    case "journalEntry":
      return <JournalEntryIcon />;
    case "tag":
      return <TagIcon />;
  }
};
export function SearchResultCard(props: ISearchResultCardProps) {
  return (
    <div className="ResultPanel__Main">
      <div className="ResultPanel__Main__Flex flex">
        <section className="ResultPanel__search__panelIcon">
          {getIconType(props.kind)}
        </section>
      </div>
    </div>
  );
}
