import { Grid } from "@mui/material";
import { styled } from "@mui/material/styles";
import { StyledTextFieldComponent } from "../../../../components/StyledTextField";
import { pallet } from "../../../../styling/pallets";
import { StyledGridItem } from "../styled-grid-item";

const StyledItem = styled(StyledGridItem)((props) => ({
  color: pallet.eggShellWhite,
  backgroundColor: pallet.black,
  border: `1px solid ${pallet.eggShellWhite}`,
}));

const GridRow = ({
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
            <StyledTextFieldComponent
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

export default GridRow;
