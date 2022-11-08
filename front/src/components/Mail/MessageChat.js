import * as React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import InfoIcon from '@mui/icons-material/Info';
import MessageIcon from '@mui/icons-material/Message';
import MessageCard from './MessageCard';
import { useContext} from 'react';
import {AuthContext} from '../AuthContext';
import ConfirmPayment from './ConfirmPayment';
import ConfirmArrival from './ConfirmArrival';
import ReactPaginate from 'react-paginate';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

// Mui components
import { Grid } from '@mui/material';
import TextField from '@mui/material/TextField';
import Modal from '@mui/material/Modal';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

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

export default function MessageChat(props) {

  const {authState} = useContext(AuthContext);

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


  let navigate = useNavigate();

  const goToItemPage =()=>{
    navigate(`/item/${props.mail.itemId}`);
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

      var recipient = props.mail.sellerId;
      var sender = props.mail.bidderId;

      // if on sales simply reverse their roles
      if (props.type === "sales"){
        recipient = props.mail.bidderId;
        sender = props.mail.sellerId;
      }

      const body ={
            recipientId: recipient,
            MailId: props.mail.id,
            title: titulo,
            body: messagio,
      }

      const head={ headers:{
              accessToken: localStorage.getItem("accessToken")
          }
      }

      axios.post(`https://localhost:33123/mail/message/${sender}`, body, head).then((res)=>{

          if (res.data.error){
              alert(res.data.error);
          }
      });

      handleClickAlert();
      handleClose();
    }
      
  }

  // Pagination Information
  const [pageNumber, setPageNumber] = React.useState(0);
  const mailPerPage = 6;

  const visitedPages = pageNumber * mailPerPage;
  const pageCount = Math.ceil(props.messages.length / mailPerPage);

  // Displaying the items of this particular page
  const displayMessages = props.messages.slice( visitedPages, visitedPages + mailPerPage ).map((value, key)=>{
      return (<>
      <Grid item >
        { value.senderId===authState.id ?
          <MessageCard message={value} type="chatMe"  />
          :
          <MessageCard message={value} type ="chatThem" />
        }
      </Grid>
      </>)
  });
  
  const changePage = ({selected}) => {
      setPageNumber(selected);
  };

  return (
    <div className="profileContainer">
      <Box
        sx={{
          mx: 'auto',
          m: 1,
          bgcolor: (theme) =>
            theme.palette.mode === 'dark' ? '#101010' : 'grey.50',
          color: (theme) =>
            theme.palette.mode === 'dark' ? 'grey.300' : 'grey.800',
          border: '1px solid',
          borderColor: (theme) =>
            theme.palette.mode === 'dark' ? 'grey.800' : 'grey.300',
          borderRadius: 2,
          textAlign: 'center',
        }}
      >
        <Typography sx={{ m: 1 }}variant="h4" >{props.mail.itemName}</Typography>
        { !props.mail.payed && props.type === "sales" &&
          <ConfirmPayment mail={props.mail} confirmation={props.confirmation} />
        }
        { !props.mail.arrived && props.type === "purchases" &&
          <ConfirmArrival mail={props.mail} confirmation={props.confirmation} />
        }
      </Box>
          
    <Grid container direction={"column"} spacing={1.25}  >

      {displayMessages}

      {/* The pagination */}
      <ReactPaginate 
        previousLabel={"<"}
        nextLabel={">"}
        pageCount={pageCount}
        onPageChange={changePage}
        containerClassName={"paginationButtonsMail"}
        previousLinkClassName={"previousButtonMail"}
        nextLinkClassName={"nextButtonMail"}
        disabledClassName={"paginationDisabledMail"}
        activeClassName={"paginationActiveMail"}
      />
    </Grid>

    <Grid container spacing={2}>
      <Grid item xs={4}>
        { props.type === "sales" ? 
          <button className="buttonitoMail" style={{
                  display: 'flex',
                  alignItems: 'center',
                  textAlign: 'center',
                  flexWrap: 'wrap',
                  width: '151px',
              }} onClick={handleOpen}>
              &nbsp; Message Buyer &nbsp;<MessageIcon />
          </button>
        :
        <button className="buttonitoMail" style={{
                display: 'flex',
                alignItems: 'center',
                textAlign: 'center',
                flexWrap: 'wrap',
                width: '151px',
            }} onClick={handleOpen}>
        &nbsp; Message Seller &nbsp;<MessageIcon />
        </button>
      }
        
      </Grid>
      <Grid item xs={8}>
        <button className="buttonitoInfoMail" style={{
              display: 'flex',
              alignItems: 'center',
              textAlign: 'center',
              flexWrap: 'wrap',
              width: '151px',
          }} onClick={()=>goToItemPage()}>
      &nbsp; Item Information&nbsp; <InfoIcon />
      </button>
      </Grid>
    </Grid>

    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
      >
      <Box sx={style} >

      <Grid container direction={"column"} spacing={1.65}>
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
