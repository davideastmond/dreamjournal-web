import { styled } from "@mui/material";
import { useRef, useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import { selectPossibleSecurityQuestions } from "../../../reducers/app-slice";
import { pallet } from "../../../styling/pallets";
import { DropdownTextComboGroup } from "../../DropdownTextComboGroup";
import { StyledButtonComponent } from "../../StyledButton";
import { StyledHeaderComponent } from "../../StyledHeader";
import "./style.css";

const StyledDropdownTextComboGroup = styled(DropdownTextComboGroup)(
  (props) => ({
    "&&& .MuiInputBase-input": {
      backgroundColor: "white",
    },
  })
);

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
    <div className="security-question-selector-enclosure">
      {props.existingQuestions && (
        <div className="current-questions-box center-width top-margin-buffer responsive-padding">
          <StyledHeaderComponent
            customClassNames="black-text bold"
            text="Your current questions"
            sizeVariant="h6"
          />
          {props.existingQuestions.map((q) => (
            <div style={{ color: pallet.greyDark4 }}>{q}</div>
          ))}
        </div>
      )}
      <header>
        {props.existingQuestions ? (
          <StyledHeaderComponent
            text="Update your security questions"
            sizeVariant="h6"
          />
        ) : (
          <div>
            <p className="black-text">
              Select password recovery security questions
            </p>
          </div>
        )}
      </header>
      <StyledDropdownTextComboGroup
        inputLabel="Security Question 1"
        textLabel="Answer for Security question 1"
        nativeSelectProps={{
          id: "qone",
          name: "qone",
          styles: { backgroundColor: pallet.eggShellWhite },
        }}
        textInputProps={{
          id: "textone",
          name: "textone",
        }}
        identifier={"q0"}
        onDataChanged={handleGroupDataChanged}
        items={securityQuestions}
      />
      <StyledDropdownTextComboGroup
        inputLabel="Security Question 2"
        textLabel="Answer for Security question 2"
        nativeSelectProps={{
          id: "qtwo",
          name: "qtwo",
          styles: { backgroundColor: pallet.eggShellWhite },
        }}
        textInputProps={{
          id: "texttwo",
          name: "texttwo",
        }}
        identifier={"q1"}
        onDataChanged={handleGroupDataChanged}
        items={securityQuestions}
      />
      <StyledDropdownTextComboGroup
        inputLabel="Security Question 3"
        textLabel="Answer for Security question 3"
        nativeSelectProps={{
          id: "qthree",
          name: "qthree",
          styles: { backgroundColor: pallet.eggShellWhite },
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
        <StyledButtonComponent
          textLabel="Save"
          variant="outlined"
          onClick={handleSubmitSave}
          disabled={!canSubmit}
          customStyles={{ backgroundColor: pallet.aquaBlueGreen }}
        />
        <StyledButtonComponent
          textLabel="Cancel"
          variant="outlined"
          customStyles={{
            backgroundColor: pallet.darkSalmon,
            marginLeft: "10px",
          }}
          onClick={handleSubmitCancel}
        />
      </footer>
    </div>
  );
}

export default SecurityQuestionSelector;
