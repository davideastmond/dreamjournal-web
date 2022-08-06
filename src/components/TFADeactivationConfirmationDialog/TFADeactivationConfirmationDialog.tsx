import {
  Alert,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  styled,
  TextField,
} from "@mui/material";
import { useEffect, useState } from "react";
import { cancelTFA } from "../../services/user/user.service";

interface ITFADeactivationConfirmationDialog {
  open: boolean;
  sessionUserId: string;
  onDialogCancel: () => void;
  onSuccess: () => void;
}

const StyledDiv = styled("div")({
  color: "black",
  fontFamily: "Roboto",
  marginBottom: "1rem",
});

const StyledTextField = styled(TextField)({
  width: "100%",
});
const TFADeactivationConfirmationDialog = (
  props: ITFADeactivationConfirmationDialog
) => {
  const [pwd, setPwd] = useState<string | null>(null);
  const [actionButtonDisabled, setActionButtonDisabled] =
    useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const handlePwdInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPwd(event.target.value);
  };

  const handleCancelTFA = async () => {
    setActionButtonDisabled(true);
    setErrorMessage(null);
    try {
      const res = await cancelTFA({
        userId: props.sessionUserId,
        plainTextPassword: pwd || "",
      });
      if (res.status === "ok") {
        props.onSuccess();
      } else {
        setActionButtonDisabled(false);
        setErrorMessage("Error, we can't do this.");
      }
    } catch (exception: any) {
      setActionButtonDisabled(false);
      setErrorMessage(exception.message || "Error, we can't do this.");
    }
  };

  const clearErrorMessages = () => {
    setErrorMessage(null);
    props.onDialogCancel();
  };

  useEffect(() => {
    setErrorMessage(null);
  }, []);
  return (
    <Dialog
      sx={{ "& .MuiDialog-paper": { width: "90%", maxHeight: 435 } }}
      maxWidth="xs"
      open={props.open}
    >
      <DialogTitle>Disable two-factor authentication</DialogTitle>
      <DialogContent>
        <StyledDiv>
          Disable this feature by entering your password and clicking `confirm`
        </StyledDiv>
        <div className="tfaTextFieldSection">
          <StyledTextField
            label="Enter Password"
            type="password"
            variant="outlined"
            onChange={handlePwdInputChange}
          />
        </div>
      </DialogContent>
      <DialogActions>
        <Button
          autoFocus
          onClick={clearErrorMessages}
          disabled={actionButtonDisabled}
        >
          Cancel
        </Button>
        <Button onClick={handleCancelTFA}>Confirm</Button>
      </DialogActions>
      {errorMessage && (
        <Alert variant="filled" severity="error">
          {errorMessage}
        </Alert>
      )}
    </Dialog>
  );
};

export default TFADeactivationConfirmationDialog;
