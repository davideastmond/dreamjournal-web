import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
} from "@mui/material";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";

interface IActionDialogProps {
  promptText: string;
  onActionConfirmed: () => void;
  onDismiss: () => void;
  open: boolean;
  type: "delete";
}

function ActionDialog(props: IActionDialogProps) {
  const handleConfirmAction = () => {
    props.onActionConfirmed();
  };

  const handleClose = () => {
    props.onDismiss();
  };

  return (
    <div className="ActionDialog__main">
      <Dialog
        open={props.open}
        onClose={props.onDismiss}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Please confirm this action"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {props.promptText}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <IconButton onClick={handleConfirmAction} autoFocus color="error">
            {props.type === "delete" && <DeleteForeverIcon />}
            OK
          </IconButton>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default ActionDialog;
