import React, { useState } from "react";
import { StyledCheckBox } from "../../components/StyledCheckBox";
import { StyledHeaderComponent } from "../../components/StyledHeader";
import { StyledTextFieldComponent } from "../../components/StyledTextField";

interface NewJournalEntryBody {
  onTextChange: (text: string) => void;
  onLucidCheckBoxChanged?: (checked: boolean) => void;
}
function NewJournalEntryBody(props: NewJournalEntryBody) {
  const [journalEntryText, setJournalEntryText] = useState<string | null>(null);

  const handleTextInputChanged = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setJournalEntryText(event.target.value);
    props.onTextChange(event.target.value);
  };

  const handleLucidCheckboxChange = (checked: boolean) => {
    props.onLucidCheckBoxChanged && props.onLucidCheckBoxChanged(checked);
  };
  return (
    <div className="JournalEntryText__multilineText">
      {/* Lucid checkbox */}
      <div style={{ marginTop: "10px" }}>
        <StyledCheckBox
          label="Lucid"
          onChange={handleLucidCheckboxChange as any}
        />
      </div>
      <StyledHeaderComponent
        text="Entry text"
        sizeVariant="h5"
        headerEnclosureStylings={{
          marginTop: "10px",
          marginBottom: "10px",
        }}
      />
      <StyledTextFieldComponent
        id="journalEntryText"
        multiline
        type="text"
        label="Text"
        focused
        fullWidth
        onChange={handleTextInputChanged}
        value={journalEntryText}
        rows={6}
      />
    </div>
  );
}

export default NewJournalEntryBody;
