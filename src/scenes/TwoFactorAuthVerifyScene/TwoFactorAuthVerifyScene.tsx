import { Alert } from "@mui/material";
import { useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { TFAComponent } from "../../components/TFAComponent";
import { selectSessionUser } from "../../reducers/app-slice";
import { submitVerifyTFA } from "../../services/authentication/authentication.security.tfa.service";

function TwoFactorAuthVerifyScene() {
  const location = useLocation() as any;
  const sessionUser = useSelector(selectSessionUser, shallowEqual);
  const token = location.state.token || "";
  const isEnrolling = location.state.isEnrolling || false;
  const [hasError, setHasError] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const getError = () => {
    return <Alert severity="error">{errorMessage}</Alert>;
  };

  const handleTfaVerifyConfirm = async ({
    tfaToken,
    authCode,
  }: {
    tfaToken: string;
    authCode: string;
  }) => {
    if (sessionUser && sessionUser._id) {
      try {
        await submitVerifyTFA({
          userId: sessionUser._id,
          authCode,
          tfaToken,
          isEnrolling,
        });

        // We need to do some navigation - it may depend on the context
      } catch (exception: any) {
        setHasError(true);
        setErrorMessage(exception.toString());
      }
    }
  };
  return (
    <>
      <TFAComponent
        token={token}
        onConfirmClick={handleTfaVerifyConfirm}
        errorElement={hasError ? [getError()] : []}
      />
    </>
  );
}

export default TwoFactorAuthVerifyScene;
