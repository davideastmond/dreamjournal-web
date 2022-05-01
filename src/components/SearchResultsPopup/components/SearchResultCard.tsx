import JournalIcon from "@mui/icons-material/Book";
import JournalEntryIcon from "@mui/icons-material/Article";
import TagIcon from "@mui/icons-material/Tag";
import {
  TJournalEntryMatchInstance,
  TJournalMatchInstance,
  MatchingCriteria,
} from "../../../services/search/search.types";
import { getStringExcerpt } from "../../../utils/string-helpers";
import "./style.css";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectJournalById } from "../../../reducers/journal-slice";

type TIconType = "journal" | "journalEntry" | "tag";

interface ISearchResultCardProps {
  kind: TIconType;
  queryString: string;
  data: TJournalEntryMatchInstance | TJournalMatchInstance;
}

const getIconType = (kind: TIconType) => {
  switch (kind) {
    case "journal":
      return <JournalIcon color="success" />;
    case "journalEntry":
      return <JournalEntryIcon color="success" />;
    case "tag":
      return <TagIcon color="success" />;
  }
};
export function SearchResultCard(props: ISearchResultCardProps) {
  const navigate = useNavigate();

  const parentJournal = useSelector(
    selectJournalById(
      (props.data as TJournalEntryMatchInstance).journalEntry?.parentJournalId
    )
  );

  const mapSearchResultContentToResultType = {
    [MatchingCriteria.JournalTitle.toString()]:
      (props.data as TJournalMatchInstance).journal?.title! || "",
    [MatchingCriteria.JournalDescription.toString()]:
      (props.data as TJournalMatchInstance).journal?.description! || "",
    [MatchingCriteria.JournalTags.toString()]: `${props.queryString} in ${(
      props.data as TJournalMatchInstance
    ).journal?.title!}`,

    [MatchingCriteria.JournalEntryTitle.toString()]:
      (props.data as TJournalEntryMatchInstance).journalEntry?.title! || "",
    [MatchingCriteria.JournalEntryDescription.toString()]:
      (props.data as TJournalEntryMatchInstance).journalEntry?.description! ||
      "",
    [MatchingCriteria.JournalEntryText.toString()]:
      (props.data as TJournalEntryMatchInstance).journalEntry?.text! || "",
    [MatchingCriteria.JournalEntryTags.toString()]: `${props.queryString} in ${
      (props.data as TJournalEntryMatchInstance).journalEntry?.title
    } from ${parentJournal?.title || "a journal"}`,
    [MatchingCriteria.Default.toString()]:
      (props.data as TJournalMatchInstance).journal?.title! || "default match",
  };

  const getStringExcerptType = () => {
    if ((props.data as TJournalMatchInstance).journal)
      return getStringExcerpt({
        keyword: props.queryString,
        content:
          mapSearchResultContentToResultType[
            (props.data as TJournalMatchInstance).matchedBy
          ],
      });
    if ((props.data as TJournalEntryMatchInstance).journalEntry)
      return getStringExcerpt({
        keyword: props.queryString,
        content:
          mapSearchResultContentToResultType[
            (props.data as TJournalEntryMatchInstance).matchedBy
          ],
      });
  };

  const handleResultPanelClick = () => {
    const journalMatch = props.data as TJournalMatchInstance;
    const journalEntryMatch = props.data as TJournalEntryMatchInstance;

    if (journalMatch && journalMatch.journal && journalMatch.journal._id) {
      navigate(`/journals/${journalMatch.journal._id}`);
      return;
    }

    if (
      journalEntryMatch &&
      journalEntryMatch.journalEntry &&
      journalEntryMatch.journalEntry._id &&
      journalEntryMatch.journalEntry.parentJournalId
    ) {
      navigate(
        `/data?journalId=${journalEntryMatch.journalEntry.parentJournalId}&journalEntryId=${journalEntryMatch.journalEntry._id}`,
        { replace: true }
      );
    }
  };
  return (
    <div className="ResultPanel__Main" onClick={handleResultPanelClick}>
      <div className="ResultPanel__Main__Flex flex">
        <section className="ResultPanel__search__panelIcon align-center">
          {getIconType(props.kind)}
        </section>
        <section>
          <p className="font-color-black">{getStringExcerptType()}</p>
        </section>
      </div>
    </div>
  );
}
