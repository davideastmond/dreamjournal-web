import { shallowEqual, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { TFAComponent } from "../../components/TFAComponent";
import { selectSessionUser } from "../../reducers/app-slice";
import { submitVerifyTFA } from "../../services/authentication/authentication.security.tfa.service";

function TwoFactorAuthVerifyScene() {
  const location = useLocation() as any;
  const sessionUser = useSelector(selectSessionUser, shallowEqual);
  const token = location.state.token || "";

  const handleTfaVerifyConfirm = async ({
    tfaToken,
    authCode,
  }: {
    tfaToken: string;
    authCode: string;
  }) => {
    if (sessionUser && sessionUser._id) {
      await submitVerifyTFA({
        userId: sessionUser._id,
        authCode,
        tfaToken,
      });
    } else {
      // Show some kind of error re: session user not being defined
      console.error("We don't have a defined session");
    }
  };
  return <TFAComponent token={token} onConfirmClick={handleTfaVerifyConfirm} />;
}

export default TwoFactorAuthVerifyScene;
