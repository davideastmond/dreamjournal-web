import { TextField } from "@mui/material";
import { textAreaStyling } from "../../styling/text-styling";
import React, { useState } from "react";

interface NewJournalEntryBodyTextProps {
  onTextChange: (text: string) => void;
}
function NewJournalEntryBodyText(props: NewJournalEntryBodyTextProps) {
  const [journalEntryText, setJournalEntryText] = useState<string | null>(null);
  const handleTextInputChanged = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setJournalEntryText(event.target.value);
    props.onTextChange(event.target.value);
  };
  return (
    <div className="JournalEntryText__multilineText">
      <header>
        <div>Write your journal entry</div>
      </header>
      <TextField
        sx={textAreaStyling}
        autoFocus
        margin="dense"
        id="journalEntryText"
        multiline
        type="text"
        label="Text"
        fullWidth
        focused
        variant="filled"
        onChange={handleTextInputChanged}
        value={journalEntryText}
        rows={6}
      />
    </div>
  );
}

export default NewJournalEntryBodyText;
