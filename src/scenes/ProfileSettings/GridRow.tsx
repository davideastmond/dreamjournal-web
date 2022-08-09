import { Grid, TextField } from "@mui/material";
import { TextFieldProps } from "@mui/material/TextField";
import { styled } from "@mui/material/styles";
import { Item } from "./Item";
import { pallet } from "../../styling/pallets";

const StyledItem = styled(Item)((props) => ({
  color: pallet.eggShellWhite,
  backgroundColor: pallet.black,
  border: `1px solid ${pallet.eggShellWhite}`,
}));

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

export const GridRow = ({
  canEdit,
  label,
  contentData,
  onEdit,
  idTag,
  component,
}: {
  canEdit: boolean;
  label: string;
  contentData?: string;
  onEdit?: (value: string) => void;
  idTag?: string;
  component?: JSX.Element;
}) => {
  const handleOnTextInputChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    onEdit && onEdit(event.target.value);
  };

  return (
    <>
      <Grid item xs={6}>
        <StyledItem>{label}</StyledItem>
      </Grid>
      {canEdit ? (
        <Grid item xs={6}>
          {component ? (
            component
          ) : (
            <StyledTextField
              variant="outlined"
              label={label}
              value={contentData}
              onChange={handleOnTextInputChange}
              id={idTag}
            />
          )}
        </Grid>
      ) : (
        <Grid item xs={6}>
          <StyledItem>{contentData}</StyledItem>
        </Grid>
      )}
    </>
  );
};
