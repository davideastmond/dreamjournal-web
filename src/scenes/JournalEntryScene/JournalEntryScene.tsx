import { useSearchParams } from "react-router-dom";

function JournalEntryScene() {
  const [searchParams] = useSearchParams();
  const journalId = searchParams.get("journalId");
  const journalEntryId = searchParams.get("journalEntryId");

  return (
    <div>
      <p> Journal entry scene context</p>
    </div>
  );
}

export default JournalEntryScene;
