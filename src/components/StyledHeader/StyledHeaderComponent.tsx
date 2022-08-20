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
  customClassNames?: string;
  headerEnclosureStylings?: { [keyof: string]: string };
}
function StyledHeaderComponent(props: IStyledHeaderComponentProps) {
  return (
    <StyledHeader
      className={`${props.customClassNames || ""} JournalList__Main__div`}
      sx={props.headerEnclosureStylings}
    >
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
