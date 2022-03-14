import { Button } from "@mui/material";
import LoginIcon from "@mui/icons-material/Login";
import AppRegistrationIcon from "@mui/icons-material/AppRegistration";
import AppLogo from "./app-logo.svg";
import "./splash-style.css";
import { useState } from "react";
import LoginModal from "../../components/login-modal";
import RegistrationModal from "../../components/registration-modal";
import { verifyActiveSession } from "../../services/authentication/authentication.service";
import { useDispatch } from "react-redux";
import {
  getHasActiveSessionAsync,
  getSessionUserAsync,
} from "../../reducers/app-slice";
function Splash() {
  const [loginModalOpen, setLoginModalOpen] = useState<boolean>(false);
  const [registrationModalOpen, setRegistrationModalOpen] =
    useState<boolean>(false);
  const dispatch = useDispatch();

  const handleOpenLoginModal = () => {
    setLoginModalOpen(true);
  };

  const handleOpenRegisterModal = () => {
    setRegistrationModalOpen(true);
  };

  const handleRegistrationSuccess = () => {
    console.log("Registration is successful");
    setRegistrationModalOpen(false);
  };

  const handleSuccessfulLogin = () => {
    console.log("Login is successful");
    dispatch(getHasActiveSessionAsync());
    dispatch(getSessionUserAsync());
    setLoginModalOpen(false);
  };

  const handleTestSession = async () => {
    const res = await verifyActiveSession();
    console.log("res session", res);
  };

  return (
    <div className="Scene Login__Main bkg-dimensions">
      <div className="Login__Main__body flex flex-direction-column flex-top-margin">
        <div className="Login__Main__logo-group">
          <img className="Login__Main__app-logo" src={AppLogo} alt="Oneiro" />
        </div>
        <div className="Login__Main__control-group">
          <div className="control">
            <Button
              variant="contained"
              startIcon={<LoginIcon />}
              onClick={handleOpenLoginModal}
            >
              Sign in
            </Button>
          </div>
          <div className="control">
            <Button
              variant="contained"
              startIcon={<AppRegistrationIcon />}
              onClick={handleOpenRegisterModal}
            >
              New Account
            </Button>
          </div>
          <div className="control">
            <Button variant="contained" onClick={handleTestSession}>
              Test Session
            </Button>
          </div>
        </div>
      </div>
      <section className="Login__Main__app-blurb">
        <div className="Login__Main__app-blurb__group splash-flex">
          <div className="Login__Main__app-blurb__text sky-blue-text flex-text-padding light-salmon-bkg font-size-24px full-flex-basis">
            Log, track and journal all aspects of your dreams.
          </div>
          <div className="Login__Main__app-blurb__text red-text flex-text-padding sky-blue-bkg font-size-24px full-flex-basis">
            Tag and track trends.
          </div>
        </div>
        <div className="Login__Main__app-blurb__group splash-flex">
          <div className="Login__Main__app-blurb__text red-text flex-text-padding black-bkg font-size-24px full-flex-basis">
            Integration with popular sleep trackers.
          </div>
          <div className="Login__Main__app-blurb__text sky-blue-text flex-text-padding light-salmon-bkg font-size-24px full-flex-basis">
            Achieve your goals and rest easier.
          </div>
        </div>
      </section>
      {loginModalOpen && (
        <LoginModal
          open={loginModalOpen}
          onDismiss={() => setLoginModalOpen(false)}
          onSuccessfulLogin={handleSuccessfulLogin}
        />
      )}
      {registrationModalOpen && (
        <RegistrationModal
          open={registrationModalOpen}
          onDismiss={() => setRegistrationModalOpen(false)}
          onSuccessDismiss={handleRegistrationSuccess}
        />
      )}
    </div>
  );
}

export default Splash;
