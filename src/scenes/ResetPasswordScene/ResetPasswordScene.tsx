import { Alert, styled, Typography } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Spinner } from "../../components/Spinner";
import { StyledButtonComponent } from "../../components/StyledButton";
import { StyledTextFieldComponent } from "../../components/StyledTextField";
import {
  authenticatePasswordRecoveryRequest,
  sendPasswordResetData,
} from "../../services/authentication/authentication.security.service";
import { pallet } from "../../styling/pallets";
import { isPasswordValid } from "../../utils/validators/validators";

const bottomSpacing = {
  marginBottom: "10px",
};

const StyledDiv = styled("div")(({ ...props }) => ({
  marginLeft: "20%",
  marginRight: "20%",
}));

function PasswordResetScene() {
  const [searchParams] = useSearchParams();
  const [password1ErrorState, setPassword1ErrorState] = useState(false);
  const [password2ErrorState, setPassword2ErrorState] = useState(false);

  const [password1ErrorText, setPassword1ErrorText] = useState<string | null>(
    null
  );
  const [password2ErrorText, setPassword2ErrorText] = useState<string | null>(
    null
  );
  const [isInitiallyLoading, setIsInitiallyLoading] = useState(true);

  const [hasSubmitError, setHasSubmitError] = useState<boolean>(false);
  const [submitErrorText, setSubmitErrorText] = useState<string>("");
  const passwordInputData = useRef<any>({});
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isComplete, setIsComplete] = useState<boolean>(false);
  const navigate = useNavigate();

  // Handle inputs changed in a ref
  const handleInputsChanged = (event: React.ChangeEvent<HTMLInputElement>) => {
    passwordInputData.current = {
      ...passwordInputData.current,
      [event.target.id]: event.target.value,
    };
    console.log(passwordInputData.current);
  };

  const handleSubmitResetPassword = async () => {
    resetErrors();
    // Need to validate password
    if (!passwordInputData.current) return;

    const passwordValid = isPasswordValid({
      password1: passwordInputData.current["password1"],
      password2: passwordInputData.current["password2"],
      onFail: ({ field, message }) => {
        // do something
        setSubmitErrorText(`${message}`);
        setHasSubmitError(true);
      },
    });
    // Check for acceptance token. If it's undefined, fail this process
    const acceptanceToken = sessionStorage.getItem("acceptanceToken");
    if (
      !acceptanceToken ||
      acceptanceToken === "undefined" ||
      acceptanceToken === "null"
    ) {
      setHasSubmitError(true);
      setSubmitErrorText(
        "This request could not be completed due to invalid acceptance token"
      );
      return;
    }

    if (passwordValid) {
      // Submit data including the token
      const encryptedToken = searchParams.get("token");
      if (encryptedToken) {
        try {
          await sendPasswordResetData({
            encryptedToken,
            acceptanceToken,
            plainTextPassword: passwordInputData.current["password1"],
          });
          // If this is successful,
          setIsComplete(true);
        } catch (err: any) {
          // Catch some error
          setHasSubmitError(true);
          setSubmitErrorText(
            `This request could not be completed: ${err.message}`
          );
        }
      }
    }
  };

  const resetErrors = () => {
    setHasSubmitError(false);
    setSubmitErrorText("");
  };
  useEffect(() => {
    const authenticateRecoveryRequest = async () => {
      const encryptedToken = searchParams.get("token");
      if (encryptedToken) {
        // If this request works, we should get an acceptance token ( a raw unencrypted UUID)
        // Let's save to state. Or sessionStorage?
        try {
          const responseData = await authenticatePasswordRecoveryRequest(
            encryptedToken
          );
          // We should set sessionStorage with the acceptance token
          sessionStorage.setItem(
            "acceptanceToken",
            responseData.acceptanceToken
          );
          setIsInitiallyLoading(false);
        } catch (err: any) {
          navigate("/error"); // POIJ fix
          console.error(err.message, "should navigate due to error");
        }
      } else {
        console.info("something else");
        navigate("/");
      }
    };
    authenticateRecoveryRequest();
  }, []);
  /**
   * When this scene loads, we need need to send the hashed token to the server and validate it
   * if it's valid we let this page load. If not we either send to splash or show an error page.
   * We'll show an error page if the server doesn't respond, or responds with an error
   */
  /**
   * We'll ask user for their password and confirmation
   */

  if (isInitiallyLoading) {
    return (
      <>
        <Spinner />
      </>
    );
  } else {
    return (
      <StyledDiv>
        <header>
          <Typography>Enter a new password</Typography>
        </header>
        {!isComplete && (
          <>
            <form>
              <StyledTextFieldComponent
                required
                autoFocus
                margin="dense"
                id="password1"
                label="Enter a password"
                type="password"
                inputProps={{
                  type: "password",
                }}
                autoComplete={"new-password"}
                fullWidth
                onChange={handleInputsChanged}
                error={password1ErrorState}
                helperText={password1ErrorText}
                customStyles={bottomSpacing}
                disabled={isSubmitting}
                customInputStyles={{
                  height: "1rem",
                }}
              />
              <StyledTextFieldComponent
                required
                autoFocus
                id="password2"
                label="Confirm Password"
                type="password"
                fullWidth
                onChange={handleInputsChanged}
                error={password2ErrorState}
                helperText={password2ErrorText}
                autoComplete={"re-enter-new-password"}
                disabled={isSubmitting}
                inputProps={{
                  type: "password",
                }}
                customStyles={bottomSpacing}
                customInputStyles={{
                  height: "1rem",
                }}
              />
              `
            </form>
            <footer>
              <StyledButtonComponent
                textLabel="Submit"
                onClick={handleSubmitResetPassword}
                disabled={isSubmitting}
              />
              <StyledButtonComponent
                textLabel="Cancel"
                fillColor={pallet.lightSalmon}
                fontColor={pallet.white}
                onClick={() => {
                  navigate("/");
                }}
                disabled={isSubmitting}
              />
              <div
                className="ResetPassword_ErrorSection"
                style={{ marginTop: "10px" }}
              >
                {hasSubmitError && (
                  <Alert color="error">{submitErrorText}</Alert>
                )}
              </div>
            </footer>
          </>
        )}
        {isComplete && (
          <div className="confirmation">
            <Typography>This has been updated.</Typography>
            <Typography>
              Click <a href="/">here</a> to log in with your updated credentials
            </Typography>
          </div>
        )}
      </StyledDiv>
    );
  }
}

export default PasswordResetScene;
