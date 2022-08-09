import { TextField, TextFieldProps, styled } from "@mui/material";

const StyledTextField = styled(TextField)(() => ({
  "& .MuiOutlinedInput-input": {
    color: "white",
  },
  "&& .MuiInputBase-root": {
    marginBottom: "20px",
  },
}));

type TStyledTextFieldComponentProps = {
  customStyles?: any;
} & TextFieldProps;
function StyledTextFieldComponent(props: TStyledTextFieldComponentProps) {
  return <StyledTextField {...props} sx={{ ...props.customStyles }} />;
}

export default StyledTextFieldComponent;
