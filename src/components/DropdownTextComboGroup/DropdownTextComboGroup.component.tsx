import { FormControl, NativeSelect, TextField } from "@mui/material";
import { useState, useRef } from "react";
import { TSecurityQuestionTemplate } from "../../services/authentication/authentication.types";

interface IDropdownTextComboGroupProps {
  defaultValue?: string;
  inputLabel: string;
  textLabel: string;
  nativeSelectProps: {
    name: string;
    id: string;
  };
  textInputProps: {
    id: string;
    name: string;
  };
  identifier: string;
  onDataChanged?: (data: any) => void;
  items: TSecurityQuestionTemplate[];
}

const DropdownTextComboGroup = (props: IDropdownTextComboGroupProps) => {
  const [changeDisabled, setChangeDisabled] = useState<boolean>(true);
  const currentRefData = useRef<any>(null);

  const handleTextInputChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    currentRefData.current = {
      ...currentRefData.current,
      id: props.identifier,
      response: event.target.value,
    };
    props.onDataChanged && props.onDataChanged(currentRefData.current);
  };

  const handleNativeSelectDropDownChange = (
    event: React.FormEvent<HTMLSelectElement>
  ) => {
    currentRefData.current = {
      ...currentRefData.current,
      selectedQuestionId:
        event.currentTarget.options[event.currentTarget.selectedIndex].value,
      selectedQuestionPrompt:
        event.currentTarget.options[event.currentTarget.selectedIndex].text,
      id: props.identifier,
    };
    setChangeDisabled(false);
    props.onDataChanged && props.onDataChanged(currentRefData.current);
  };

  return (
    <>
      <FormControl fullWidth>
        <label
          className="security-question-label"
          htmlFor={props.nativeSelectProps.name}
        >
          {props.inputLabel}
        </label>
        <NativeSelect
          defaultValue={props.defaultValue}
          onChange={handleNativeSelectDropDownChange}
          inputProps={{
            name: props.nativeSelectProps.name,
            id: props.nativeSelectProps.id,
          }}
        >
          <option aria-label="None" value="" disabled selected>
            -- Please select --
          </option>
          {props.items &&
            props.items.map((question) => (
              <option value={question.id}>{question.prompt}</option>
            ))}
        </NativeSelect>
        <TextField
          label={props.textLabel}
          name={props.textInputProps.name}
          id={props.textInputProps.id}
          onChange={handleTextInputChange}
          disabled={changeDisabled}
        />
      </FormControl>
    </>
  );
};

export default DropdownTextComboGroup;
