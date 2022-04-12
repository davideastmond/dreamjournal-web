import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";

interface IJournalTagTableProps {
  data: { [keyof: string]: number };
}
function JournalTagTable(props: IJournalTagTableProps) {
  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: "100vw" }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell align="right">Tag</TableCell>
            <TableCell align="right">Occurrence count</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {props.data &&
            Object.entries(props.data).map((tagEntry) => (
              <TableRow
                key={tagEntry[0]}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell align="right">{tagEntry[0]}</TableCell>
                <TableCell align="right">{tagEntry[1]}</TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
export { JournalTagTable };
