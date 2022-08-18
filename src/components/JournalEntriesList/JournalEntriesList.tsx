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

import { StyledButtonComponent } from "../StyledButton";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { styled } from "@mui/material";
interface IJournalEntriesListProps {
  entries: TJournalEntry[];
  onClickAddNewJournalEntry?: (journalContextId?: string) => void;
}

const StyledHeaderCell = styled(TableCell)(() => ({
  "&.MuiTableCell-root": {
    borderBottom: "unset",
    fontSize: "20px",
  },
}));

const StyledCellData = styled(TableCell)(() => ({
  "&.MuiTableCell-root": {
    borderBottomWidth: "0.5px",
  },
}));

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
          onClick={handleAddNewJournalEntry}
        />
      </div>
      <TableContainer component={Paper} sx={{ marginTop: "10px" }}>
        <Table sx={{ backgroundColor: "black" }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <StyledHeaderCell
                align="left"
                sx={{ ...cellStyling, ...boldFontWeight }}
              >
                Entry Title
              </StyledHeaderCell>
              <StyledHeaderCell
                align="left"
                sx={{ ...cellStyling, ...boldFontWeight }}
              >
                Last Updated
              </StyledHeaderCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {props.entries.length > 0 &&
              props.entries.map((entry) => (
                <TableRow
                  key={entry._id}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <StyledCellData
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
                  </StyledCellData>
                  <StyledCellData align="left" sx={cellStyling}>
                    {getFormattedDate({
                      dateString: entry.updatedAt?.toString()!,
                    })}
                  </StyledCellData>
                </TableRow>
              ))}
            {props.entries.length === 0 && (
              <StyledCellData align="left" sx={{ color: "white" }}>
                Empty{" "}
              </StyledCellData>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}

export default JournalEntriesList;
