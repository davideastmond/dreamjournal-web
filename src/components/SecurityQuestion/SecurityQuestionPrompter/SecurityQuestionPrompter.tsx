import { Button, TextField } from "@mui/material";
import { useState } from "react";
import { TSecurityQuestionTemplate } from "../../../services/authentication/authentication.types";
import "./style.css";
interface ISecurityQuestionPrompterProps {
  data: { isSet: boolean; questions: TSecurityQuestionTemplate[] };
  onSubmit?: (data: any) => void; // POIJ type this
  submitButtonVisible?: boolean;
  editButtonVisible?: boolean;
  defaultMode?: "readonly" | "answer";
  onEditButtonClick?: () => void;
}

/**
 * Readonly mode will show the question prompt and a redacted password answer
 */
function SecurityQuestionPrompter(props: ISecurityQuestionPrompterProps) {
  const [mode, setMode] = useState<"readonly" | "answer" | null>(
    props.defaultMode ?? "readonly"
  );
  return props.data && props.data.questions ? (
    <div className="SecurityQuestionPrompt__main">
      <div className="q-one-main">
        <header className="q-prompt">{props.data.questions[0].prompt}</header>
        {mode === "readonly" && (
          <p className="q-answer">[ Your response 1st Question ]</p>
        )}
        {mode === "answer" && (
          <TextField name="q0_answer" id="q0_answer"></TextField>
        )}
      </div>
      <div className="q-two-main">
        <header className="q-prompt">{props.data.questions[1].prompt}</header>
        {mode === "readonly" && (
          <p className="q-answer">[ Your response 2nd Question ]</p>
        )}
        {mode === "answer" && (
          <TextField name="q1_answer" id="q1_answer"></TextField>
        )}
      </div>
      <div className="q-three-main">
        <header className="q-prompt">{props.data.questions[2].prompt}</header>
        {mode === "readonly" && (
          <p className="q-answer">[ Your response 3rd Question ]</p>
        )}
        {mode === "answer" && (
          <TextField name="q2_answer" id="q2_answer"></TextField>
        )}
      </div>
      <footer>
        {props.editButtonVisible && (
          <div>
            <Button onClick={props.onEditButtonClick}>Edit</Button>
          </div>
        )}
        {props.submitButtonVisible && <Button>Submit</Button>}
      </footer>
    </div>
  ) : (
    <>Empty</>
  );
}

export default SecurityQuestionPrompter;
