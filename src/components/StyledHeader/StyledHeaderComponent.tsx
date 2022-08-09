import { Typography, styled } from "@mui/material";
import { pallet } from "../../styling/pallets";

const StyledHeader = styled("header")((props) => ({
  [props.theme.breakpoints.down("sm")]: {
    display: "flex",
    justifyContent: "space-evenly",
    alignItems: "center",
  },
}));

interface IStyledHeaderComponentProps {
  text: string;
  children?: JSX.Element | JSX.Element[];
  sizeVariant?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
}
function StyledHeaderComponent(props: IStyledHeaderComponentProps) {
  return (
    <StyledHeader className="JournalList__Main__div top-margin-buffer">
      <Typography
        id="journalsTitle"
        variant={props.sizeVariant || "h3"}
        sx={{
          color: pallet.darkSalmon,
          fontFamily: `"Rozha One", serif`,
        }}
      >
        {props.text}
      </Typography>
      {props.children}
    </StyledHeader>
  );
}

export default StyledHeaderComponent;