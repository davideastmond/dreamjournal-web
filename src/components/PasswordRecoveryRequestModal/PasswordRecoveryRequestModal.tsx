import { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  FormControl,
  TextField,
  DialogActions,
  Button,
  Typography,
  Alert,
} from "@mui/material";
import { DATE_CONSTANTS } from "../../definitions";
import { CustomDatePicker } from "../CustomDatePicker";
import { Spinner } from "../Spinner";
import dayjs from "dayjs";
import { isEmailValid } from "../../utils/string-helpers";
import { requestPasswordRecovery } from "../../services/authentication/authentication.security.service";
import { StyledButtonComponent } from "../StyledButton";
import { pallet } from "../../styling/pallets";

interface IPasswordRecoveryRequestModalProps {
  open: boolean;
  onDismiss: () => void;
}
function PasswordRecoveryRequestModal(
  props: IPasswordRecoveryRequestModalProps
) {
  const [submitInProgress, setSubmitInProgress] = useState<boolean>(false);
  const [emailErrorText, setEmailErrorText] = useState<string | null>(null);
  const [emailErrorState, setEmailErrorState] = useState<boolean>(false);
  const [recoverEmail, setRecoverEmail] = useState<string | null>(null);
  const [dateOfBirthValue, setDateOfBirthValue] = useState<any>(null);
  const [dobErrorState, setDobErrorState] = useState<boolean>(false);
  const [dobErrorText, setDobErrorText] = useState<string>("");
  const [requestErrorState, setRequestErrorState] = useState<boolean>(false);
  const [requestErrorMessage, setRequestErrorMessage] = useState<string>("");
  const [requestCompleted, setRequestCompleted] = useState<boolean>(false);

  const [successfulSubmit, setSuccessFullSubmit] = useState<boolean>(false);
  const handleLostPasswordRequest = async () => {
    resetErrorStates();

    // Send the dob and email in post request
    if (!recoverEmail) {
      setEmailErrorState(true);
      setEmailErrorText("Enter a valid e-mail address");
      return;
    }
    if (!isEmailValid({ email: recoverEmail })) {
      setEmailErrorState(true);
      setEmailErrorText("Enter a valid e-mail address");
      return;
    }
    if (!dayjs(dateOfBirthValue, "MMM-DD-YYYY", true).isValid()) {
      setDobErrorState(true);
      setDobErrorText(
        "Please enter a valid date of birth in the correct format"
      );
      return;
    }
    setSubmitInProgress(true);
    // Send request after sending validation
    const dob = dateOfBirthValue.$d.toISOString();
    try {
      await requestPasswordRecovery({
        email: recoverEmail,
        dateOfBirth: dob,
      });
      // Trigger the success message, force user to close the modal.
      setSuccessFullSubmit(true);
      setRequestCompleted(true);
      setSubmitInProgress(false);
    } catch (exception: any) {
      setSuccessFullSubmit(false);
      setRequestErrorState(true);
      setRequestErrorMessage(
        `There was a problem completing this request: ${exception.message}`
      );
      setRequestCompleted(false);
      setSubmitInProgress(false);
    }
  };
  const resetErrorStates = () => {
    setEmailErrorState(false);
    setDobErrorState(false);
    setRequestErrorMessage("");
    setRequestErrorState(false);
    setSubmitInProgress(false);
    setSuccessFullSubmit(false);
  };
  return (
    <Dialog open={props.open} onClose={props.onDismiss}>
      {submitInProgress && <Spinner />}
      <DialogTitle sx={{ textAlign: "center", marginBottom: "5px" }}>
        Recovery
      </DialogTitle>
      <DialogContent>
        <div style={{ marginBottom: "5px" }}>
          <Typography>Enter your e-mail address and date of birth</Typography>
        </div>
        <FormControl sx={{ width: "100%" }}>
          <TextField
            required
            autoFocus
            id="email"
            label="Enter your e-mail"
            type="email"
            margin="dense"
            fullWidth
            onChange={(e: any) => setRecoverEmail(e.target.value)}
            error={emailErrorState}
            helperText={emailErrorText}
            disabled={submitInProgress || successfulSubmit}
          />
          <CustomDatePicker
            onDateChange={setDateOfBirthValue}
            disableFuture
            isError={dobErrorState}
            errorText={dobErrorText}
            label="Enter your date of birth"
            maxDate={DATE_CONSTANTS.ADULT_AGE as any}
            readOnly
            disabled={submitInProgress || successfulSubmit}
          />
        </FormControl>
        {successfulSubmit && (
          <div>
            <Typography>
              Check your e-mail for a link to reset your password 😁
            </Typography>
            <StyledButtonComponent
              textLabel="Close"
              fillColor={pallet.aquaBlueGreen}
              fontColor={pallet.white}
              onClick={() => props.onDismiss()}
            />
          </div>
        )}
      </DialogContent>
      <DialogActions>
        <Button
          onClick={props.onDismiss}
          disabled={submitInProgress || requestCompleted}
        >
          Cancel
        </Button>
        <Button
          color="success"
          onClick={handleLostPasswordRequest}
          disabled={submitInProgress || requestCompleted}
        >
          Submit
        </Button>
      </DialogActions>
      {requestErrorState && (
        <Alert color="error">
          {"The system is unable to validate this request. Please try again"}
        </Alert>
      )}
    </Dialog>
  );
}

export default PasswordRecoveryRequestModal;
