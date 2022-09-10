import { Box, styled } from "@mui/material";
import { shallowEqual, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { JournalEntriesList } from "../../components/JournalEntriesList";
import { StyledButtonComponent } from "../../components/StyledButton";
import { StyledHeaderComponent } from "../../components/StyledHeader";
import { selectJournalById } from "../../reducers/journal-slice";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

function JournalEntryListScene() {
  const navigate = useNavigate();
  const { journalId } = useParams();

  const handleNavigateToNewJournalEntry = () => {
    journalContext && navigate(`/journals/${journalContext?._id}/new`);
  };
  const journalContext = useSelector(
    selectJournalById(journalId!),
    shallowEqual
  );

  const StyledJournalEntriesListBoxContainer = styled(Box)((props) => ({
    [props.theme.breakpoints.up("md")]: {
      marginLeft: "20%",
      marginRight: "20%",
    },
  }));
  return (
    <Box pt={2}>
      <div className="JournalContext__main__backToJournals">
        <div className="cursor-hover" onClick={() => navigate(-1)}>
          <ArrowBackIcon
            sx={{
              padding: "10px",
            }}
          />
        </div>
        <StyledButtonComponent
          textLabel="New Entry"
          onClick={handleNavigateToNewJournalEntry}
        />
      </div>
      <StyledHeaderComponent
        text={journalContext?.title || "Journal Entry"}
        sizeVariant="h4"
      />
      <StyledHeaderComponent text={"Entries list"} sizeVariant="h6" />
      <StyledJournalEntriesListBoxContainer>
        <JournalEntriesList
          entries={
            journalContext && journalContext.journalEntries
              ? journalContext.journalEntries
              : []
          }
        />
      </StyledJournalEntriesListBoxContainer>
    </Box>
  );
}

export default JournalEntryListScene;
