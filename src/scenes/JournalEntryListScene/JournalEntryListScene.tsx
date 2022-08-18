import { shallowEqual, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { JournalEntriesList } from "../../components/JournalEntriesList";
import { selectJournalById } from "../../reducers/journal-slice";

interface IJournalEntryListSceneProps {}

function JournalEntryListScene(props: IJournalEntryListSceneProps) {
  const navigate = useNavigate();
  const { journalId } = useParams();

  const handleNavigateToNewJournalEntry = () => {
    journalContext && navigate(`/journals/${journalContext?._id}/new`);
  };
  const journalContext = useSelector(
    selectJournalById(journalId!),
    shallowEqual
  );
  return (
    <JournalEntriesList
      entries={
        journalContext && journalContext.journalEntries
          ? journalContext.journalEntries
          : []
      }
      onClickAddNewJournalEntry={handleNavigateToNewJournalEntry}
    />
  );
}

export default JournalEntryListScene;
