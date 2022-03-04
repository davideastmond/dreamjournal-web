
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';

import "./login-modal-style.css";
interface ILoginModalProps {
  open: boolean;
  onDismiss: ()=> void;
}

function LoginModal (props: ILoginModalProps) {
  return (
    <div>
      <Dialog open={props.open} onClose={props.onDismiss}>
        <DialogTitle>Sign In</DialogTitle>
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
            margin="dense"
            id="filled-password"
            label="Password"
            type="password"
            fullWidth
            variant="filled"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={props.onDismiss}>Cancel</Button>
          <Button onClick={props.onDismiss}>Go</Button>
        </DialogActions> 
      </Dialog>
    </div>
  )
}

export default LoginModal;
