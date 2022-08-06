import { Button, FormControl, NativeSelect, TextField } from "@mui/material";
import React, { useRef, useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import { selectPossibleSecurityQuestions } from "../../../reducers/app-slice";
import { TSecurityQuestionTemplate } from "../../../services/authentication/authentication.types";
import "./style.css";
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

interface ISecurityQuestionSelector {
  onSaveSubmit?: (data: any) => void;
  onCancelClicked: () => void;
  existingQuestions?: string[];
}

type TQuestionResponseType = {
  id: string;
  selectedQuestionId: string;
  selectedQuestionPrompt: string;
  response: string;
};

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

function SecurityQuestionSelector(props: ISecurityQuestionSelector) {
  const qData = useRef<any>({});
  const [canSubmit, setCanSubmit] = useState<boolean>(false);
  const securityQuestions = useSelector(
    selectPossibleSecurityQuestions,
    shallowEqual
  );
  const [submissionError, setSubmissionError] = useState<string | null>(null);
  const handleGroupDataChanged = (data: any) => {
    qData.current = {
      ...qData.current,
      [data.id]: {
        ...data,
      },
    };
    setCanSubmit(isDataReadyToBeSubmitted(qData.current));
    setSubmissionError(null);
  };

  const handleSubmitSave = () => {
    if (!areAllQuestionsSelectedUnique(qData.current)) {
      setSubmissionError("Choose three different security questions");
      return;
    }
    props.onSaveSubmit && props.onSaveSubmit(qData.current);
  };

  const isDataReadyToBeSubmitted = (data: any): boolean => {
    const questionObjectResponses: [string, TQuestionResponseType][] =
      Object.entries(data);
    const checksForProperResponses =
      questionObjectResponses.length === 3 &&
      questionObjectResponses.every(
        (element) => !!("selectedQuestionId" in element[1])
      ) &&
      questionObjectResponses.every(
        (element) => !!("selectedQuestionPrompt" in element[1])
      ) &&
      questionObjectResponses.every((element) => !!("response" in element[1]));
    if (!checksForProperResponses) return false;

    let fndError = false;
    for (let questionResponse of questionObjectResponses) {
      if (
        questionResponse[1].selectedQuestionId === "" ||
        !questionResponse[1].selectedQuestionId
      )
        fndError = true;
      if (
        questionResponse[1].selectedQuestionPrompt === "" ||
        !questionResponse[1].selectedQuestionPrompt
      )
        fndError = true;
      if (questionResponse[1].response === "" || !questionResponse[1].response)
        fndError = true;
    }
    if (fndError) return false;
    return true;
  };

  const areAllQuestionsSelectedUnique = (data: any): boolean => {
    const questionObjectResponses: [string, TQuestionResponseType][] =
      Object.entries(data);
    const obj: any = {};
    questionObjectResponses.forEach((res) => {
      obj[`${res[1].selectedQuestionId}`] = 0;
    });
    return Object.keys(obj).length === 3;
  };

  const handleSubmitCancel = () => {
    // Do something
    props.onCancelClicked();
  };
  return (
    <div>
      {props.existingQuestions && (
        <div className="current-questions-box center-width top-margin-buffer responsive-padding">
          <header className="black-text bold">Your current questions</header>
          {props.existingQuestions.map((q) => (
            <div className="charcoal-text">{q}</div>
          ))}
        </div>
      )}
      <header>
        {props.existingQuestions ? (
          <div>
            <p className="black-text">Update your security questions</p>
          </div>
        ) : (
          <div>
            <p className="black-text">
              Select password recovery security questions
            </p>
          </div>
        )}
      </header>
      <DropdownTextComboGroup
        inputLabel="Security Question 1"
        textLabel="Answer for Security question 1"
        nativeSelectProps={{
          id: "qone",
          name: "qone",
        }}
        textInputProps={{
          id: "textone",
          name: "textone",
        }}
        identifier={"q0"}
        onDataChanged={handleGroupDataChanged}
        items={securityQuestions}
      />
      <DropdownTextComboGroup
        inputLabel="Security Question 2"
        textLabel="Answer for Security question 2"
        nativeSelectProps={{
          id: "qtwo",
          name: "qtwo",
        }}
        textInputProps={{
          id: "texttwo",
          name: "texttwo",
        }}
        identifier={"q1"}
        onDataChanged={handleGroupDataChanged}
        items={securityQuestions}
      />
      <DropdownTextComboGroup
        inputLabel="Security Question 3"
        textLabel="Answer for Security question 3"
        nativeSelectProps={{
          id: "qthree",
          name: "qthree",
        }}
        textInputProps={{
          id: "textthree",
          name: "textthree",
        }}
        identifier={"q2"}
        onDataChanged={handleGroupDataChanged}
        items={securityQuestions}
      />
      <footer>
        {submissionError && (
          <div>
            <p className="warning-color">{submissionError}</p>
          </div>
        )}
        <Button
          variant="outlined"
          onClick={handleSubmitSave}
          disabled={!canSubmit}
        >
          Save
        </Button>
        <Button variant="outlined" onClick={handleSubmitCancel}>
          Cancel
        </Button>
      </footer>
    </div>
  );
}

export default SecurityQuestionSelector;
