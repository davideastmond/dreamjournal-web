import { TextField, TextFieldProps, styled } from "@mui/material";
import { pallet } from "../../styling/pallets";

const StyledTextField = styled(TextField)<TStyledTextFieldComponentProps>(
  ({ ...props }) => ({
    "&&& input": {
      height: "0",
      width: "100%",
      color: pallet.skyBlue,
      fontWeight: "300",
      ...props.customInputStyles,
    },
    "&.MuiTextField-root": {
      width: "100%",
    },
    "& .MuiOutlinedInput-notchedOutline": {
      borderColor: pallet.eggShellWhite,
    },
    "&&& .MuiOutlinedInput-root": {
      "&:hover fieldset": {
        borderColor: pallet.eggShellWhite,
      },
    },
    "&&& .MuiFormLabel-root": {
      color: pallet.eggShellWhite,
    },
    "& .MuiInputBase-inputMultiline": {
      color: pallet.skyBlue,
    },
  })
);

type TStyledTextFieldComponentProps = {
  customStyles?: any;
  customInputStyles?: any;
  textFieldType?: "password" | "text";
  onKeyDown?: (e: any) => void;
} & TextFieldProps;

function StyledTextFieldComponent(props: TStyledTextFieldComponentProps) {
  return (
    <StyledTextField
      {...props}
      sx={{ ...props.customStyles }}
      type={props.textFieldType}
      onKeyDown={props.onKeyDown}
    />
  );
}

export default StyledTextFieldComponent;
