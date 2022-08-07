import {
  Button,
  List,
  ListItem,
  ListItemText,
  styled,
  Typography,
} from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { TJournal } from "../../services/journal/journal.types";
import AddIcon from "@mui/icons-material/Add";
import "./style.css";
import { pallet } from "../../pallets";

interface IJournalListProps {
  journals: TJournal[];
}

const StyledAddNewJournalButton = styled(Button)((props) => ({
  backgroundColor: pallet.redWine,
  [props.theme.breakpoints.down("sm")]: {
    display: "none",
  },
}));

const StyledAddIcon = styled(AddIcon)((props) => ({
  color: pallet.redWine,
  [props.theme.breakpoints.up("sm")]: {
    display: "none",
  },
  "&:hover": {
    cursor: "pointer",
  },
}));

const StyledHeader = styled("header")((props) => ({
  [props.theme.breakpoints.down("sm")]: {
    display: "flex",
    justifyContent: "space-evenly",
  },
}));

const StyledList = styled(List)(() => ({
  marginLeft: "20%",
  marginRight: "20%",
}));

function JournalList(props: IJournalListProps) {
  const handleListItemClick = ({ journalId }: { journalId: string }) => {
    navigate(`/journals/${journalId}`, { replace: true });
  };
  const navigate = useNavigate();
  return (
    <div className="JournaList__Main">
      <StyledHeader className="JournalList__Main__div top-margin-buffer">
        <Typography
          id="journalsTitle"
          variant="h5"
          sx={{
            color: "white",
          }}
        >
          Journals
        </Typography>
        <div className="NewJournals__Controls">
          <StyledAddNewJournalButton variant="outlined">
            <Link to="/new_journal">New Journal</Link>
          </StyledAddNewJournalButton>
          <StyledAddIcon color="primary">
            <Link to="/new_journal">New Journal</Link>
          </StyledAddIcon>
        </div>
      </StyledHeader>
      <StyledList dense={true}>
        {props.journals &&
          props.journals.length > 0 &&
          props.journals.map((journalItem) => (
            <ListItem key={journalItem._id}>
              <ListItemText
                primary={journalItem.title}
                onClick={() =>
                  handleListItemClick({ journalId: journalItem._id })
                }
              />
            </ListItem>
          ))}
        {(!props.journals || props.journals.length === 0) && (
          <ListItem>
            <ListItemText primary="No journals">No Journals</ListItemText>
          </ListItem>
        )}
      </StyledList>
    </div>
  );
}

export default JournalList;
