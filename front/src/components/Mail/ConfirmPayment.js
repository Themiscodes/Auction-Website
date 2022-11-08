import * as React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import axios from 'axios';
import Rating from '../Modals/Rating';

// For the material modal
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 480,
    bgcolor: 'background.paper',
    borderRadius: 6,
    boxShadow: 24,
    p: 4,
  };


export default function ConfirmPayment(props) {
  const [open, setOpen] = React.useState(false);

  const [valueC, setValueC] = React.useState(2.5);

  const handleClickOpen = () => {
    setOpen(true);
  };

    // These here are for the Modal that displays awaiting approval
    const [openModal, setOpenModal] = React.useState(false);

    const handleCloseModal = () => {
        setOpenModal(false);
        window.location.reload();
    }
  

  const handleClose = () => {
    setValueC(2.5);
    setOpen(false);
  };

  const handleConfirm = () => {
    setOpen(false);

    var rating =0.5;
    if (valueC!==null){
      rating = valueC;
    }

    const body ={
        bidderId: props.mail.bidderId,
        bidderRating: rating,
    }

    const head={ headers:{
            accessToken: localStorage.getItem("accessToken")
        }
    }

    axios.post(`https://localhost:33123/mail/confirmpayment/${props.mail.id}`, body, head).then((res)=>{
    });

    setValueC(2.5); 
    setOpenModal(true);
    
  }

  return (

    <div>
      <button className="buttonitoMail" onClick={handleClickOpen}> Confirm Payment</button>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title" style={{
              fontFamily: 'Futura',
              
          }}>
          {"How was your experience with the buyer?"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            <Rating valueC={valueC} setValueC={setValueC} />
          </DialogContentText>
        </DialogContent>
        <DialogActions>
        <button className="buttonitoReverse" onClick={handleClose}>Cancel</button>
          <button className="buttonito"  onClick={handleConfirm} autoFocus>Confirm</button>
        </DialogActions>
      </Dialog>

      <Modal
            open={openModal}
            onClose={handleCloseModal}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
          <Box sx={style}>
          <Typography id="modal-modal-title" variant="h4" >
              Thank you for your Feedback!
          </Typography>
          <img alt="FeedbackPhoto" className='feedback_photo' src='https://cdni.iconscout.com/illustration/premium/thumb/candidate-rating-and-review-2537380-2146476.png' />
          <Typography variant="h6" id="modal-modal-description" sx={{ mt: 2 }}>
              Aside from rating you can also give further feedback directly to the buyer! Your opinion is important!</Typography>
          </Box>
        </Modal>
    </div>
  );
}
