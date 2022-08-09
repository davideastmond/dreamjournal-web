import { Button, styled } from "@mui/material";
import { pallet } from "../../styling/pallets";

const StyledButton = styled(Button)<IStyledButtonProps>(
  ({ theme, ...props }) => ({
    backgroundColor: `${props.fillColor}`,
    color: `${props.fontColor || pallet.white}`,
  })
);

interface IStyledButtonProps {
  textLabel: string;
  fontColor?: string;
  fillColor?: string;
  onClick?: () => void;
  variant?: "text" | "outlined" | "contained";
  customStyles?: any;
}
function StyledButtonComponent(props: IStyledButtonProps) {
  return (
    <StyledButton
      {...{ ...props }}
      onClick={props.onClick}
      variant={props.variant}
      sx={{ ...props.customStyles }}
    >
      {props.textLabel}
    </StyledButton>
  );
}

export default StyledButtonComponent;
