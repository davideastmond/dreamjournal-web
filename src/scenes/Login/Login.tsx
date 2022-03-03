
import Button from "@mui/material/Button"
import LoginIcon from '@mui/icons-material/Login';
import AppRegistrationIcon from '@mui/icons-material/AppRegistration';
import AppLogo from "./app-logo.svg"
import "./login-style.css"
import { useState } from "react";
import LoginModal from "../../components/login-modal";
function Login() {
  const [modalOpen, setModalOpen] = useState<boolean>(false)
  const handleOpenLoginModal = () => {
    setModalOpen(true);
  }

  return (
    <div className="Scene Login__Main white-bkg bkg-dimensions">
      <div className="Login__Main__body flex flex-direction-column flex-top-margin">
        <div className="Login__Main__logo-group">
          <img className="Login__Main__app-logo" src={AppLogo} alt="Oneiro" />
        </div>
        <div className="Login__Main__control-group">
          <div className="control">
            <Button variant="contained" startIcon={<LoginIcon />} onClick={handleOpenLoginModal}  >
              Sign in
            </Button >
          </div>
          <div className="control">
            <Button variant="contained" startIcon={<AppRegistrationIcon />} >
              Sign up
            </Button >
          </div>
        </div>
      </div>
      <section className="Login__Main__app-blurb top-margin-buffer">
        <div className="Login__Main__app-blurb__text red-text flex-text-padding black-bkg font-size-24px">
          Log, track and journal all aspects of your dreams.
        </div>
        <div className="Login__Main__app-blurb__text red-text flex-text-padding black-bkg font-size-24px">
          Tag and track trends.
        </div>
        <div className="Login__Main__app-blurb__text red-text flex-text-padding black-bkg font-size-24px">
          Integration with popular sleep trackers.
        </div>
        <div className="Login__Main__app-blurb__text red-text flex-text-padding black-bkg font-size-24px">
          Achieve your goals and rest easier.
        </div>
      </section>
      { modalOpen && (
        <LoginModal open={modalOpen} onDismiss={()=> setModalOpen(false)} />
      )}
    </div>)
}

export default Login;
