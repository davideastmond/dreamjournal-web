import { styled, Box } from "@mui/material";

const StyledBoxContainer = styled(Box)((props) => ({
  [props.theme.breakpoints.up("md")]: {
    marginLeft: "20%",
    marginRight: "20%",
  },
}));

export default StyledBoxContainer;
