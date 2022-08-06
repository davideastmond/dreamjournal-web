import { Grid, TextField } from "@mui/material";
import { TextFieldProps } from "@mui/material/TextField";
import { styled } from "@mui/material/styles";
import { Item } from "./Item";

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

  const StyledTextField = styled(TextField)<TextFieldProps>(() => ({
    "&&& input": {
      height: "0",
      width: "100%",
    },
    "&.MuiTextField-root": {
      width: "100%",
    },
  }));

  return (
    <>
      <Grid item xs={6}>
        <Item>{label}</Item>
      </Grid>
      {canEdit ? (
        <Grid item xs={6}>
          {component ? (
            component
          ) : (
            <StyledTextField
              variant="outlined"
              value={contentData}
              onChange={handleOnTextInputChange}
              id={idTag}
            />
          )}
        </Grid>
      ) : (
        <Grid item xs={6}>
          <Item>{contentData}</Item>
        </Grid>
      )}
    </>
  );
};
