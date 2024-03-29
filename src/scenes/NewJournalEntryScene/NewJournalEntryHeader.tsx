import React, { useState } from "react";
import { CustomDatePicker } from "../../components/CustomDatePicker";
import { StyledTextFieldComponent } from "../../components/StyledTextField";
import { textAreaStyling } from "../../styling/text-styling";

interface NewJournalEntryHeaderProps {
  onHeaderDataChanged: (
    type: "title" | "description" | "tags" | "journalEntryDate",
    text: string
  ) => void;
}

function NewJournalEntryHeader(props: NewJournalEntryHeaderProps) {
  const [journalEntryTitle, setJournalEntryTitle] = useState<string>("");
  const [journalEntryTags, setJournalEntryTags] = useState<string>("");
  const [journalEntryDateValue, setJournalEntryDateValue] = useState<any>(null);
  const [journalEntryDescription, setJournalEntryDescription] =
    useState<string>("");

  const handleTextInputChanged = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const htmlElement = event.target.id;
    const targetValue = event.target.value;
    switch (htmlElement) {
      case "journalEntryTitle":
        setJournalEntryTitle(targetValue);
        props.onHeaderDataChanged("title", targetValue);
        break;
      case "journalEntryDescription":
        setJournalEntryDescription(targetValue);
        props.onHeaderDataChanged("description", targetValue);
        break;
      case "journalEntryTags":
        setJournalEntryTags(targetValue);
        props.onHeaderDataChanged("tags", targetValue);
        break;
    }
  };

  const handleJournalEntryDateChange = (value: any) => {
    // POIJ this needs validation
    setJournalEntryDateValue(value);
    props.onHeaderDataChanged("journalEntryDate", value);
  };
  return (
    <div className="NewJournalEntry__header__main">
      <header>
        <StyledTextFieldComponent
          sx={textAreaStyling}
          margin="dense"
          id="journalEntryTitle"
          type="text"
          label="Title"
          fullWidth
          focused
          onChange={handleTextInputChanged}
          value={journalEntryTitle}
          required
        />
        <StyledTextFieldComponent
          sx={textAreaStyling}
          margin="dense"
          id="journalEntryDescription"
          type="text"
          label="Description"
          fullWidth
          focused
          onChange={handleTextInputChanged}
          value={journalEntryDescription}
          required
        />
        <div className="JournalEntryContext__tags-enclosure">
          <StyledTextFieldComponent
            sx={textAreaStyling}
            margin="dense"
            id="journalEntryTags"
            type="text"
            label="Tags"
            fullWidth
            focused
            onChange={handleTextInputChanged}
            value={journalEntryTags}
          />
        </div>
        <div style={{ marginTop: "5px" }}>
          <CustomDatePicker
            label="Date"
            disableFuture
            lightText
            onDateChange={handleJournalEntryDateChange}
            readOnly
          />
        </div>
      </header>
    </div>
  );
}

export default NewJournalEntryHeader;
