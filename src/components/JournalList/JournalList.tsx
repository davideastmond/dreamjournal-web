import {
  Button,
  IconButton,
  List,
  ListItem,
  ListItemText,
  styled,
} from "@mui/material";
import JournalBookMarkIcon from "@mui/icons-material/CollectionsBookmark";
import { Link, useNavigate } from "react-router-dom";
import { TJournal } from "../../services/journal/journal.types";
import AddIcon from "@mui/icons-material/Add";
import { pallet } from "../../styling/pallets";
import { StyledHeaderComponent } from "../StyledHeader";

interface IJournalListProps {
  journals: TJournal[];
}

const StyledAddNewJournalButton = styled(Button)((props) => ({
  backgroundColor: pallet.redWine,
  [props.theme.breakpoints.down("sm")]: {
    display: "none",
  },
}));

const StyledAddIconButton = styled(IconButton)((props) => ({
  color: pallet.redWine,
  [props.theme.breakpoints.up("sm")]: {
    display: "none",
  },
  "&:hover": {
    cursor: "pointer",
    color: pallet.eggShellWhite,
    backgroundColor: pallet.redWine,
  },
  paddingTop: "5px",
  border: "1px solid",
  borderRadius: "20%",
}));

const StyledList = styled(List)(() => ({
  marginLeft: "20%",
  marginRight: "20%",
}));

const StyledListItemText = styled(ListItemText)((props) => ({
  color: pallet.eggShellWhite,
  marginLeft: "10px",
  [props.theme.breakpoints.down("sm")]: {
    "&& .MuiTypography-root": {
      fontSize: "1rem",
    },
  },
  "& .MuiTypography-root": {
    fontSize: "1.5rem",
  },
}));

const StyledJournalBookMarkIcon = styled(JournalBookMarkIcon)(() => ({
  color: pallet.lightSalmon,
}));

const StyledListItem = styled(ListItem)(() => ({
  "&:hover": {
    cursor: "pointer",
  },
}));

function JournalList(props: IJournalListProps) {
  const handleListItemClick = ({ journalId }: { journalId: string }) => {
    navigate(`/journals/${journalId}`, { replace: true });
  };
  const navigate = useNavigate();

  const generateAddJournalButtons = () => {
    return (
      <div className="NewJournals__Controls">
        <StyledAddNewJournalButton variant="outlined">
          <Link to="/new_journal">New Journal</Link>
        </StyledAddNewJournalButton>
        <StyledAddIconButton color="primary">
          <Link to="/new_journal">
            <AddIcon />
          </Link>
        </StyledAddIconButton>
      </div>
    );
  };
  return (
    <div className="JournaList__Main">
      <StyledHeaderComponent text="Your journals">
        {generateAddJournalButtons()}
      </StyledHeaderComponent>
      <StyledList dense={true}>
        {props.journals &&
          props.journals.length > 0 &&
          props.journals.map((journalItem) => (
            <StyledListItem key={journalItem._id}>
              <StyledJournalBookMarkIcon />
              <StyledListItemText
                primary={journalItem.title}
                onClick={() =>
                  handleListItemClick({ journalId: journalItem._id })
                }
              />
            </StyledListItem>
          ))}
        {(!props.journals || props.journals.length === 0) && (
          <ListItem>
            <ListItemText primary="No journals">
              You don't have any journals
            </ListItemText>
          </ListItem>
        )}
      </StyledList>
    </div>
  );
}

export default JournalList;
