import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import TextField from "@mui/material/TextField";
import { useState } from "react";
import { logInUser } from "../../services/authentication/authentication.service";
import { Spinner } from "../Spinner";

import "./login-modal-style.css";
import { validateLoginData } from "./validators/login-validator";
interface ILoginModalProps {
  open: boolean;
  onDismiss: () => void;
  onSuccessfulLogin: () => void;
}

function LoginModal(props: ILoginModalProps) {
  const [loginEmail, setLoginEmail] = useState<string>("");
  const [loginPassword, setLoginPassword] = useState<string>("");

  const [hasLoginEmailError, setHasLoginEmailError] = useState<boolean>(false);
  const [hasLoginPasswordError, setHasLoginPasswordError] =
    useState<boolean>(false);

  const [loginEmailError, setLoginEmailError] = useState<string>("");
  const [loginPasswordError, setLoginPasswordError] = useState<string>("");

  const [hasLoginAttemptError, setHasLoginAttemptError] =
    useState<boolean>(false);
  const [loginAttemptErrorMessage, setLoginAttemptErrorMessage] =
    useState<string>("");

  const [loginInProgress, setLoginInProgress] = useState<boolean>(false);
  const handleTextInputChanged = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { id, value } = event.target;
    if (id === "email") {
      setLoginEmail(value);
    } else if (id === "filled-password") {
      setLoginPassword(value);
    }
  };

  const clearErrors = () => {
    setHasLoginEmailError(false);
    setLoginEmailError("");
    setHasLoginPasswordError(false);
    setLoginPasswordError("");
    setHasLoginAttemptError(false);
    setLoginAttemptErrorMessage("");
    setLoginInProgress(false);
  };
  const handleSubmitLogin = async () => {
    clearErrors();
    setLoginInProgress(true);
    validateLoginData({
      email: loginEmail,
      password: loginPassword,
      onSuccess: async () => {
        try {
          await logInUser({
            email: loginEmail,
            password: loginPassword,
          });
          props.onSuccessfulLogin();
        } catch (err: any) {
          setHasLoginAttemptError(true);
          setLoginInProgress(false);
          setLoginAttemptErrorMessage(err.message);
        }
      },
      onFail: ({ field, message }: { field: string; message: string }) => {
        setLoginInProgress(false);
        switch (field) {
          case "email":
            setHasLoginEmailError(true);
            setLoginEmailError(message);
            break;
          case "password":
            setHasLoginPasswordError(true);
            setLoginPasswordError(message);
        }
      },
    });
  };
  return (
    <Dialog open={props.open} onClose={props.onDismiss}>
      {loginInProgress && <Spinner />}
      <DialogTitle>Sign In</DialogTitle>
      <DialogContent>
        <form>
          <DialogContentText>Enter your details</DialogContentText>
          <TextField
            required
            autoFocus
            margin="dense"
            id="email"
            label="Email"
            type="email"
            fullWidth
            variant="filled"
            onChange={handleTextInputChanged}
            error={hasLoginEmailError}
            helperText={loginEmailError}
            autoComplete="email username"
          />
          <TextField
            required
            autoFocus
            margin="dense"
            id="filled-password"
            label="Password"
            type="password"
            fullWidth
            variant="filled"
            onChange={handleTextInputChanged}
            error={hasLoginPasswordError}
            helperText={loginPasswordError}
            autoComplete="password"
          />
          {hasLoginAttemptError && (
            <DialogContentText color="error">
              {loginAttemptErrorMessage}
            </DialogContentText>
          )}
        </form>
      </DialogContent>
      <DialogActions>
        <Button onClick={props.onDismiss} disabled={loginInProgress}>
          Cancel
        </Button>
        <Button onClick={handleSubmitLogin} disabled={loginInProgress}>
          Go
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default LoginModal;
