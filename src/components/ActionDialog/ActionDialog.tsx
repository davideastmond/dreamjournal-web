import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";

interface IActionDialogProps {
  promptText: string;
  onActionConfirmed: () => void;
  onDismiss: () => void;
  open: boolean;
  buttonOptions: JSX.Element[];
}

function ActionDialog(props: IActionDialogProps) {
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
          {props.buttonOptions.map((buttonOption) => buttonOption)}
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default ActionDialog;
