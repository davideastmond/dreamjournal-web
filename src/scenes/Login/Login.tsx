
import Button from "@mui/material/Button"
import LoginIcon from '@mui/icons-material/Login';
import AppRegistrationIcon from '@mui/icons-material/AppRegistration';
import AppLogo from "./app-logo.svg"
import "./login-style.css"
function Login() {
  return (
    <div className="Scene Login__Main white-bkg bkg-dimensions">
      <div className="Login__Main__body flex flex-direction-column flex-top-margin">
        <div className="Login__Main__logo-group">
          <img className="Login__Main__app-logo" src={AppLogo} alt="Oneiro" />
        </div>
        <div className="Login__Main__control-group">
          <div className="control">
            <Button variant="contained" startIcon={<LoginIcon />}  >
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
  </div>)
}

export default Login;
