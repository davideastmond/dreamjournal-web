import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  TextField,
  DialogActions,
  Button,
} from "@mui/material";
import { useState } from "react";
import { registerUser } from "../../services/authentication/authentication.service";
import { validateRegistrationData } from "./validators/registration-validator";

interface IRegistrationModalProps {
  open: boolean;
  onDismiss: () => void;
  onSuccessDismiss: (message?: string) => void;
}

function RegistrationModal(props: IRegistrationModalProps) {
  const [registrationEmail, setRegistrationEmail] = useState<string>("");
  const [registrationFirstName, setRegistrationFirstName] =
    useState<string>("");
  const [registrationLastName, setRegistrationLastName] = useState<string>("");
  const [registrationPassword1, setRegistrationPassword1] =
    useState<string>("");
  const [registrationPassword2, setRegistrationPassword2] =
    useState<string>("");

  const [emailErrorState, setEmailErrorState] = useState<boolean>(false);
  const [firstNameErrorState, setFirstNameErrorState] =
    useState<boolean>(false);
  const [lastNameErrorState, setLastNameErrorState] = useState<boolean>(false);
  const [password1ErrorState, setPassword1ErrorState] =
    useState<boolean>(false);
  const [password2ErrorState, setPassword2ErrorState] =
    useState<boolean>(false);

  const [emailErrorText, setEmailErrorText] = useState<string>("");
  const [firstNameErrorText, setFirstNameErrorText] = useState<string>("");
  const [lastNameErrorText, setLastNameErrorText] = useState<string>("");
  const [password1ErrorText, setPassword1ErrorText] = useState<string>("");
  const [password2ErrorText, setPassword2ErrorText] = useState<string>("");

  const [registrationAttemptErrorState, setRegistrationAttemptErrorState] =
    useState<boolean>(false);
  const [registrationAttemptErrorText, setRegistrationAttemptErrorText] =
    useState<string>("");
  const handleInputsChanged = (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    const { id, value } = event.target;
    switch (id) {
      case "email":
        setRegistrationEmail(value);

        break;
      case "firstName":
        setRegistrationFirstName(value);
        break;
      case "lastName":
        setRegistrationLastName(value);
        break;
      case "password1":
        setRegistrationPassword1(value);
        break;
      case "password2":
        setRegistrationPassword2(value);
        break;
    }
  };

  const clearErrorState = () => {
    setEmailErrorState(false);
    setFirstNameErrorState(false);
    setLastNameErrorState(false);
    setPassword1ErrorState(false);
    setPassword2ErrorState(false);
    setRegistrationAttemptErrorState(false);

    setEmailErrorText("");
    setFirstNameErrorText("");
    setLastNameErrorText("");
    setPassword1ErrorText("");
    setPassword2ErrorText("");
    setRegistrationAttemptErrorText("");
  };

  const handleSubmitRegistrationRequest = async () => {
    clearErrorState();
    validateRegistrationData({
      email: registrationEmail,
      firstName: registrationFirstName,
      lastName: registrationLastName,
      password1: registrationPassword1,
      password2: registrationPassword2,
      onSuccess: async () => {
        await registerUser({
          email: registrationEmail,
          firstName: registrationFirstName,
          lastName: registrationLastName,
          plainTextPassword: registrationPassword1,
          onSuccess: () => {
            props.onDismiss();
          },
          onError: (message?: string) => {
            setRegistrationAttemptErrorState(true);
            setRegistrationAttemptErrorText(
              message || "Encountered an error: unable to log in"
            );
          },
        });
      },
      onFail: ({ field, message }: { field: string; message: string }) => {
        switch (field) {
          case "email":
            setEmailErrorText(message);
            setEmailErrorState(true);
            break;
          case "firstName":
            setFirstNameErrorText(message);
            setFirstNameErrorState(true);
            break;
          case "lastName":
            setLastNameErrorText(message);
            setLastNameErrorState(true);
            break;
          case "password1":
            setPassword1ErrorText(message);
            setPassword1ErrorState(true);
            break;
          case "password2":
            setPassword2ErrorText(message);
            setPassword2ErrorState(true);
            break;
        }
      },
    });
  };
  return (
    <div>
      <Dialog open={props.open} onClose={props.onDismiss}>
        <DialogTitle>Create new account</DialogTitle>
        <DialogContent>
          <DialogContentText>Enter your details</DialogContentText>
          <TextField
            required
            autoFocus
            id="email"
            label="Email"
            type="email"
            fullWidth
            onChange={handleInputsChanged}
            error={emailErrorState}
            helperText={emailErrorText}
          />
          <TextField
            required
            autoFocus
            id="firstName"
            label="First Name"
            fullWidth
            onChange={handleInputsChanged}
            error={firstNameErrorState}
            helperText={firstNameErrorText}
          />
          <TextField
            required
            autoFocus
            id="lastName"
            label="Last Name"
            fullWidth
            onChange={handleInputsChanged}
            error={lastNameErrorState}
            helperText={lastNameErrorText}
          />
          <TextField
            required
            autoFocus
            margin="dense"
            id="password1"
            label="Password"
            type="password"
            fullWidth
            onChange={handleInputsChanged}
            error={password1ErrorState}
            helperText={password1ErrorText}
          />
          <TextField
            required
            autoFocus
            id="password2"
            label="Confirm Password"
            type="password"
            fullWidth
            onChange={handleInputsChanged}
            error={password2ErrorState}
            helperText={password2ErrorText}
          />
          {registrationAttemptErrorState && (
            <DialogContentText color="error">
              {registrationAttemptErrorText}
            </DialogContentText>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={props.onDismiss}>Cancel</Button>
          <Button color="success" onClick={handleSubmitRegistrationRequest}>
            Register
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default RegistrationModal;
