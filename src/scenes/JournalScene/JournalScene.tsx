import { InputAdornment, TextField, Typography } from "@mui/material";
import React, { useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";
import { selectJournalById } from "../../reducers/journal-slice";
import EditIcon from "@mui/icons-material/Edit";
import ArrowLeftIcon from "@mui/icons-material/ArrowLeft";
import "./style.css";
import { getFormattedDate } from "../../utils/string-helpers";
import { JournalEntriesList } from "../../components/JournalEntriesList";
import { NotFound404 } from "../NotFound404";
const textAreaStyling = {
  "& .MuiInputBase-input": {
    color: "white",
  },
  "& .MuiOutlinedInput-root": {
    borderColor: "white",
    borderLeftStyle: "solid",
    borderRightStyle: "solid",
    borderWidth: "1px",
    color: "white",
  },
  "& .MuiTextField-root": {
    marginTop: "20",
  },
};

function JournalScene() {
  const { journalId } = useParams();
  const navigate = useNavigate();
  const journalContext = useSelector(
    selectJournalById(journalId!),
    shallowEqual
  );
  const [journalTitleText, setJournalTitleText] = useState<string>(
    journalContext?.title || ""
  );
  const [journalDescription, setJournaDescription] = useState<string>(
    journalContext?.description || ""
  );
  const [journalTags, setJournalTags] = useState<string>(
    journalContext?.tags ? journalContext.tags.join(",") : ""
  );

  console.log(journalContext);
  const handleTextInputChanged = (
    event: React.InputHTMLAttributes<HTMLInputElement>
  ) => {};

  return journalContext ? (
    <div className="JournalContext__main">
      <div className="JournalContext__main__backToJournals">
        <Link to="/home">
          <Typography>
            <ArrowLeftIcon />
            Journals
          </Typography>
        </Link>
      </div>
      <header className="JournalContext__main__Header">
        <div className="JournalContext__main__titleHeader">
          <Typography variant="h5">{journalContext?.title}</Typography>
        </div>
        <TextField
          sx={textAreaStyling}
          autoFocus
          margin="dense"
          id="journalTitle"
          type="text"
          label="Title"
          fullWidth
          focused
          variant="filled"
          onChange={handleTextInputChanged}
          value={journalTitleText}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <EditIcon htmlColor="white" />
              </InputAdornment>
            ),
          }}
        />
        <TextField
          sx={textAreaStyling}
          autoFocus
          margin="dense"
          id="journalDescription"
          type="text"
          label="Description"
          fullWidth
          focused
          variant="filled"
          onChange={handleTextInputChanged}
          value={journalDescription}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <EditIcon htmlColor="white" />
              </InputAdornment>
            ),
          }}
        />
        <div className="JournalContext__main__updateDateSection">
          <TextField
            label="Created"
            sx={textAreaStyling}
            focused
            variant="filled"
            value={getFormattedDate({
              dateString: journalContext?.createdAt.toString()!,
            })}
          />
          <TextField
            label="Last updated"
            sx={textAreaStyling}
            focused
            variant="filled"
            value={getFormattedDate({
              dateString: journalContext?.updatedAt.toString()!,
            })}
          />
          <TextField
            label="id"
            sx={textAreaStyling}
            focused
            variant="filled"
            value={journalContext?._id}
          />
        </div>
        <div className="JournalContext__tags-enclosure">
          <TextField
            sx={textAreaStyling}
            autoFocus
            margin="dense"
            id="journalTags"
            type="text"
            label="Tags"
            fullWidth
            focused
            variant="filled"
            onChange={handleTextInputChanged}
            value={journalTags}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <EditIcon htmlColor="white" />
                </InputAdornment>
              ),
            }}
          />
        </div>
      </header>
      <section className="JournalEntries__main__body">
        <JournalEntriesList
          entries={
            journalContext && journalContext.journalEntries
              ? journalContext.journalEntries
              : []
          }
        />
      </section>
    </div>
  ) : (
    <NotFound404 />
  );
}
export default JournalScene;
