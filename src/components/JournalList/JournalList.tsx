import { List, ListItem, ListItemText, Typography } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { TJournal } from "../../services/journal/journal.types";
import "./style.css";

interface IJournalListProps {
  journals: TJournal[];
}
function JournaList(props: IJournalListProps) {
  const handleListItemClick = ({ journalId }: { journalId: string }) => {
    console.log(journalId);
    //window.location.href = `/journals/$${journalId}`
    navigate(`/journals/${journalId}`, { replace: true });
  };
  const navigate = useNavigate();
  return (
    <div className="JournaList__Main">
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
        <div className="warning-color cursor-hover">
          <Link to="/new_journal">+ New Journal</Link>
        </div>
      </div>
      <List dense={true}>
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
      </List>
    </div>
  );
}

export default JournaList;
