import { TJournalEntry } from "../../services/journal/journal.types";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { getFormattedDate } from "../../utils/string-helpers";
import { useNavigate } from "react-router-dom";
import "./style.css";
import AddIcon from "@mui/icons-material/Add";
interface IJournalEntriesListProps {
  entries: TJournalEntry[];
  onClickAddNewJournalEntry?: (journalContextId?: string) => void;
}

const cellStyling = { color: "white" };
const boldFontWeight = { fontWeight: "bold" };
function JournalEntriesList(props: IJournalEntriesListProps) {
  const navigate = useNavigate();
  const handleJournalEntryCellClicked = ({
    journalContextId,
    journalEntryId,
  }: {
    journalContextId: string;
    journalEntryId: string;
  }) => {
    navigate(
      `/data?journalId=${journalContextId}&journalEntryId=${journalEntryId}`,
      { replace: true }
    );
  };
  const handleAddNewJournalEntry = () => {
    props.onClickAddNewJournalEntry && props.onClickAddNewJournalEntry();
  };
  return (
    <div>
      <header>
        <div className="cursor-hover" onClick={handleAddNewJournalEntry}>
          <AddIcon color="primary" />
          New entry
        </div>
      </header>
      <TableContainer component={Paper} sx={{ marginTop: "10px" }}>
        <Table sx={{ backgroundColor: "black" }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell
                align="left"
                sx={{ ...cellStyling, ...boldFontWeight }}
              >
                {" "}
                Entry Title{" "}
              </TableCell>
              <TableCell
                align="left"
                sx={{ ...cellStyling, ...boldFontWeight }}
              >
                {" "}
                Last Updated{" "}
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {props.entries.length > 0 &&
              props.entries.map((entry) => (
                <TableRow
                  key={entry._id}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell
                    align="left"
                    sx={cellStyling}
                    onClick={() =>
                      handleJournalEntryCellClicked({
                        journalContextId: entry.parentJournalId,
                        journalEntryId: entry._id,
                      })
                    }
                  >
                    {entry.title}
                  </TableCell>
                  <TableCell align="left" sx={cellStyling}>
                    {getFormattedDate({
                      dateString: entry.updatedAt?.toString()!,
                    })}
                  </TableCell>
                </TableRow>
              ))}
            {props.entries.length === 0 && (
              <TableCell align="left">Empty </TableCell>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}

export default JournalEntriesList;
