import React, { useContext } from 'react';
import {useNavigate} from 'react-router-dom';
import {AuthContext} from '../AuthContext';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogTitle from '@mui/material/DialogTitle';

// Logout window implemented with a dialog box
function Logout() {

  let navigate = useNavigate();
  const {setAuthState} = useContext(AuthContext);
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const logout = () => {
      localStorage.removeItem("accessToken");
      setAuthState({
          username: "", 
          id: 0, 
          status:false 
      });
      setOpen(false);
      navigate('/');
  }

  return (
    <div>
      <button onClick={handleClickOpen} > Logout</button> 

      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title" style={{
              fontFamily: 'Futura',
          }}>
          {"Are you sure you want to sign out?"}
        </DialogTitle>
        <DialogActions>
            <button className="buttonitoReverse" onClick={handleClose}>Cancel123</button>
            <button className="buttonito"  onClick={logout} autoFocus>Confirm</button>
        </DialogActions>
      </Dialog>

    </div>
  )
}

export default Logout
