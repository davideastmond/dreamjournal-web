import { TextField, TextFieldProps, styled } from "@mui/material";
import { pallet } from "../../styling/pallets";

const StyledTextField = styled(TextField)<TextFieldProps>(() => ({
  "&&& input": {
    height: "0",
    width: "100%",
    color: pallet.skyBlue,
    fontWeight: "300",
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
}));

type TStyledTextFieldComponentProps = {
  customStyles?: any;
  textFieldType?: "password" | "text";
} & TextFieldProps;

function StyledTextFieldComponent(props: TStyledTextFieldComponentProps) {
  return (
    <StyledTextField
      {...props}
      sx={{ ...props.customStyles }}
      type={props.textFieldType}
    />
  );
}

export default StyledTextFieldComponent;
