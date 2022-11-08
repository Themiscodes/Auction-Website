import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 600,
  bgcolor: 'background.paper',
  border: '2px solid lightBlue',
  boxShadow: 24,
  p: 4,
};

export default function ApprovalModal() {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <div>
      <Button onClick={handleOpen}>Open modal</Button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h5" component="h2">
            Application Received
          </Typography>
          <img className='approval_photo' src='https://codenex.in/wp-content/uploads/2019/01/appdevelopment.png' />
          <Typography variant="h6" id="modal-modal-description" sx={{ mt: 2 }}>
            You'll be able to use our services as soon as you have been approved!
          </Typography>
        </Box>
      </Modal>
    </div>
  );
}
