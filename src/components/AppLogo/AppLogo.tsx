import AppLogoSVG from "../../scenes/Splash/app-logo.svg";
import "./style.css";
function AppLogo() {
  return (
    <div>
      <img className="AppLogo" src={AppLogoSVG} alt="Oneiro App Logo" />
    </div>
  );
}

export default AppLogo;
