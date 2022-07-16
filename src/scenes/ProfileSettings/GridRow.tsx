import { Grid, TextField } from "@mui/material";
import { Item } from "./Item";

export const GridRow = ({
  canEdit,
  label,
  contentData,
  onEdit,
  idTag,
}: {
  canEdit: boolean;
  label: string;
  contentData?: string;
  onEdit?: (value: string) => void;
  idTag?: string;
}) => {
  const handleOnTextInputChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    onEdit && onEdit(event.target.value);
  };

  return (
    <>
      <Grid item xs={6}>
        <Item>{label}</Item>
      </Grid>
      {canEdit ? (
        <Grid item xs={6}>
          <Item>
            <TextField
              variant="outlined"
              value={contentData}
              onChange={handleOnTextInputChange}
              id={idTag}
            />
          </Item>
        </Grid>
      ) : (
        <Grid item xs={6}>
          <Item>{contentData}</Item>
        </Grid>
      )}
    </>
  );
};
