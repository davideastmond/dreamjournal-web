import { Dialog, DialogTitle, DialogContent, DialogContentText, TextField, DialogActions, Button } from "@mui/material";

interface IRegistrationModalProps {
  open: boolean;
  onDismiss: ()=> void;
}

function RegistrationModal (props:IRegistrationModalProps) {
  return (
  <div>
    <Dialog open={props.open} onClose={props.onDismiss}>
      <DialogTitle>Create new account</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Enter your details
        </DialogContentText>
        <TextField
          required
          autoFocus
          margin="dense"
          id="email"
          label="Email"
          type="email"
          fullWidth
          variant="filled"
        />
        <TextField
          required
          autoFocus
          id="firstName"
          label="First Name"
          fullWidth
        />
        <TextField
          required
          autoFocus
          id="lastName"
          label="Last Name"
          fullWidth
        />
        <TextField
          required
          autoFocus
          margin="dense"
          id="password1"
          label="Password"
          type="password"
          fullWidth
          variant="filled"
        />
        <TextField
          required
          autoFocus
          margin="dense"
          id="password2"
          label="Confirm Password"
          type="password"
          fullWidth
          variant="filled"
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={props.onDismiss}>Cancel</Button>
        <Button color="success" onClick={props.onDismiss}>Register</Button>
      </DialogActions> 
    </Dialog>
  </div>
  )
}

export default RegistrationModal;
