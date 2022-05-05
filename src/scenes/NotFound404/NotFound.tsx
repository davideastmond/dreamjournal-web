import { Box, Typography } from "@mui/material";
import { Link } from "react-router-dom";
import AppLogo from "../Splash/app-logo.svg";

export function NotFound404() {
  return (
    <div>
      <Link to="/">
        <div className="Login__Main__logo-group">
          <img className="Login__Main__app-logo" src={AppLogo} alt="Oneiro" />
        </div>
      </Link>
      <Box>
        <Typography
          variant="h3"
          sx={{
            color: "#e74c32",
            width: "100%",
            maxWidth: 500,
          }}
        >
          There was an issue loading this page
        </Typography>
        <Typography
          variant="h6"
          sx={{
            color: "#e74c32",
            width: "100%",
            maxWidth: 500,
          }}
        >
          If you tweaked a URL, you may have to go back and refresh.
        </Typography>
      </Box>
    </div>
  );
}

export default NotFound404;
