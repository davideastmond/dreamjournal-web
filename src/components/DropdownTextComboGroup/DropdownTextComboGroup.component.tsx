import { FormControl, NativeSelect } from "@mui/material";
import { useState, useRef } from "react";
import { StyledTextFieldComponent } from "../StyledTextField";
// import { TSecurityQuestionTemplate } from "../../services/authentication/authentication.types";

interface IDropdownTextComboGroupProps<T> {
  defaultValue?: string;
  inputLabel: string;
  textLabel: string;
  nativeSelectProps: {
    name: string;
    id: string;
    styles?: any;
  };
  textInputProps: {
    id: string;
    name: string;
    styles?: any;
  };
  identifier: string;
  onDataChanged?: (data: any) => void;
  items: T[]; // POIJ
}

const DropdownTextComboGroup = <T extends { id: string; prompt: string }>(
  props: IDropdownTextComboGroupProps<T>
) => {
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
        <label htmlFor={props.nativeSelectProps.name}>{props.inputLabel}</label>
        <NativeSelect
          defaultValue={props.defaultValue}
          onChange={handleNativeSelectDropDownChange}
          sx={{ ...props.nativeSelectProps.styles }}
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
        <StyledTextFieldComponent
          label={props.textLabel}
          name={props.textInputProps.name}
          id={props.textInputProps.id}
          onChange={handleTextInputChange}
          disabled={changeDisabled}
          fullWidth
          focused
          customStyles={{
            marginTop: "20px",
            marginBottom: "20px",
          }}
        />
      </FormControl>
    </>
  );
};

export default DropdownTextComboGroup;
