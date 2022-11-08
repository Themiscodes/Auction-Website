import * as React from 'react';
import axios from 'axios';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import ReplyIcon from '@mui/icons-material/Reply';
import TextField from '@mui/material/TextField';
import Modal from '@mui/material/Modal';
import Grid from '@mui/material/Grid';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

// Styling for the box
const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 600,
  bgcolor: 'background.paper',
  borderRadius: 6,
  boxShadow: 24,
  p: 4,
};

export default function MessageCard(props) {

  // For the alert
  const [openAlert, setOpenAlert] = React.useState(false);
  const [errorMessage, setErrorMessage ]= React.useState("");

  const handleClickAlert = () => {
    setOpenAlert(true);
  };

  const handleCloseAlert = (event, reason) => {
    setOpenAlert(false);
  };

  // for the error alert
  const [openAlertError, setOpenAlertError] = React.useState(false);

  const handleClickAlertError = () => {
    setOpenAlertError(true);
  };

  const handleCloseAlertError = (event, reason) => {
    setOpenAlertError(false);
  };

  // for sending a message
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setTitulo("");
    setMessagio("");
    setOpen(false);
  }

  const [titulo, setTitulo] = React.useState("");
  const [messagio, setMessagio] = React.useState("");

  const handleTextFieldTitle = (data) => {
    setTitulo(data.target.value);
  }

  const handleTextFieldBody = (data) => {
    setMessagio(data.target.value);
  }

  const messageSend = () =>{
    if (titulo===""){
      setErrorMessage("Cannot send mail with an empty title.");
      handleClickAlertError();
    }
    else if (titulo.length>100){
      setErrorMessage("Title has to be max 100 characters long.");
      handleClickAlertError();
    }
    else if (messagio===""){
      setErrorMessage("Cannot send mail with an empty message.")
      handleClickAlertError();
    }
    else if (messagio.length>4000) {
      setErrorMessage("The message you're trying to send is too large.")
      handleClickAlertError();
    }
    else {

      const body ={
            recipientId: props.message.senderId,
            MailId: props.message.MailId,
            title: titulo,
            body: messagio,
      }

      const head={ headers:{
              accessToken: localStorage.getItem("accessToken")
          }
      }
      axios.post(`https://localhost:33123/mail/message/${props.message.recipientId}`, body, head).then((res)=>{
          if (res.data.error){
              alert(res.data.error);
          }
      });

      handleClickAlert();
      handleClose();
    }
  }

  return (
    <div style={{marginTop:9, marginLeft:5}}>
      <Card sx={{ minWidth: 275, maxWidth: 580, backgroundColor: props.type==='chatMe' ? 'rgb(200, 243, 223)':'background.paper' }}>
      <CardContent>
        {((props.type==='inbox')|| (props.type==='outbox') ) &&
          <Typography sx={{ mb: 1.5 }} color="text.secondary">
          { (new Date(props.message.timeSent).toLocaleString('en-GB'))}
          </Typography> 
        }
        <Typography variant='h6' component="div" >
            {props.message.title} 
        </Typography>
        {(props.type==='outbox') ?
          <Typography sx={{ fontSize: 12 }} color="text.secondary" gutterBottom>
              Sent to: {props.message.recipientName} {props.message.recipientSurname}
          </Typography>
        :
        <Typography sx={{ fontSize: 12 }} color="text.secondary" gutterBottom>
            {props.message.senderName} {props.message.senderSurname}
        </Typography>
        }
          
        <Typography variant="body2" component="div">
        {props.message.body}
        </Typography>
        
      </CardContent>
      { props.type==='inbox' &&
        <CardActions>
          <Button size="small" style={{ color: 'teal' }} onClick={()=>{handleOpen()}}><ReplyIcon />&nbsp;Reply</Button>
        </CardActions>
      }
    </Card>

    <Modal
    open={open}
    onClose={handleClose}
    aria-labelledby="modal-modal-title"
    aria-describedby="modal-modal-description"
    >
    <Box sx={style} >

    <Grid container direction={"column"} spacing={1.65}>
      <Grid item>
        <Typography id="modal-modal-title" variant="h6" component="h2">
          Replying to {props.message.name} {props.message.surname}
        </Typography>
      </Grid>
      <Grid item>
      <Typography variant="body1" id="modal-modal-description" component="h2">
      - {props.message.body}
      </Typography>
      </Grid>
      <Grid item>
      <TextField 
          name = "title"
          onChange={handleTextFieldTitle}
          fullWidth
          id="outlined-multiline-static"
          label="Title"
          multiline
          rows={1}
        />
       </Grid>
      <Grid item>
      <TextField 
          fullWidth
          onChange={handleTextFieldBody}
          id="outlined-multiline-static"
          label="Type here"
          multiline
          rows={14}
          defaultValue=""
        />
        </Grid>
      </Grid>
        <button className='buttonitoMail' onClick={()=>{messageSend()}}>Send</button>
    </Box>
    </Modal>

    {/* message alert */}
    <Snackbar open={openAlert} autoHideDuration={6000} onClose={handleCloseAlert}>
      <Alert onClose={handleCloseAlert} severity="success" sx={{ width: '100%' }}>
        Your message has been sent!
      </Alert>
    </Snackbar>

    {/* error message alert */}
    <Snackbar open={openAlertError} autoHideDuration={6000} onClose={handleCloseAlertError}>
      <Alert onClose={handleCloseAlertError} severity="warning" sx={{ width: '100%' }}>
        {errorMessage}
      </Alert>
    </Snackbar>

    </div>
  );
}