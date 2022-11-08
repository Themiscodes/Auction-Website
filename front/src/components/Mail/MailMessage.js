import * as React from 'react';
import TextField from '@mui/material/TextField';
import axios from 'axios';
import {useEffect, useState, useContext} from 'react';
import {AuthContext} from '../AuthContext';

// Material UI components
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Grid from '@mui/material/Grid';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

export default function MailMessage() {

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

  const handleClose = () => {
    setTitulo("");
    setMessagio("");
    window.location.reload();
  }

  const [titulo, setTitulo] = React.useState("");
  const [messagio, setMessagio] = React.useState("");

  const handleTextFieldTitle = (data) => {
    setTitulo(data.target.value);
  }

  const handleTextFieldBody = (data) => {
    setMessagio(data.target.value);
  }

  const [personContact, setPersonContact] = React.useState({});
  const [mails, setMails] = useState([]);
  const [auctions, setAuctions] = useState([]);
  const [auctionContact, setAuctionContact] = React.useState({});

  const messageSend = () =>{

    if ( Object.keys(personContact).length === 0 ){
      setErrorMessage("You haven't selected a recipient!");
      handleClickAlertError();
    }
    else if ( Object.keys(auctionContact).length === 0 ){
      setErrorMessage("You haven't selected an auction!");
      handleClickAlertError();
    }
    else if (titulo===""){
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
            recipientId: personContact.contactId,
            MailId: auctionContact.id,
            title: titulo,
            body: messagio,
      }

      const head={ headers:{
              accessToken: localStorage.getItem("accessToken")
          }
      }
      axios.post(`https://localhost:33123/mail/message/${authState.id}`, body, head).then((res)=>{
          if (res.data.error){
            setErrorMessage(res.data.error);
            handleClickAlertError();
          }
      });
      handleClickAlert();
      handleClose();
    }
      
  }

  const handleChange = (event) => {
    const {
      target: { value },
    } = event;
    setPersonContact(value);

    const head={ headers:{
      accessToken: localStorage.getItem("accessToken"),
      otherId: value.contactId,
      }
    }

    axios.get(`https://localhost:33123/mail/auctions/${authState.id}`, head).then((res)=>{
      console.log(res.data);
      setAuctions(res.data);
      
    });    

  };

  const handleChangeAuction = (event) => {
    
    const {
      target: { value },
    } = event;
    setAuctionContact(value);

  };

useEffect(()=>{
  const head={ headers:{
        accessToken: localStorage.getItem("accessToken"),
    }
  }

  axios.get(`https://localhost:33123/mail/contacts/${authState.id}`, head).then((res)=>{
    console.log(res.data);
    setMails(res.data);

  });

  // eslint-disable-next-line
}, []);

  return (

    <>
     <div >
      <br />
      <Grid container direction={"column"} spacing={1.35} sx={{ bgcolor: 'background.paper'}}>

      <Grid container direction={"row"} spacing={1.35}>
        <Grid item>
      <FormControl sx={{ m: 4, width: 320 }}>
          <InputLabel id="demo-multiple-name-label">Name</InputLabel>
          <Select
            labelId="demo-multiple-name-label"
            id="demo-multiple-name"
            // commenting this out so you can only send it to one
            // multiple
            value={personContact}
            onChange={handleChange}
            input={<OutlinedInput label="Name" />}
            MenuProps={MenuProps}
          >
            {mails.map((name) => (
              <MenuItem
                key={name}
                value={name}
                // style={getStyles(name, personContact, theme)}
              >
                {name.contactUsername} ({name.contactSurname}, {name.contactName})
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        </Grid>
        <Grid item>
        <FormControl sx={{ m: 4, width: 320 }}>
          <InputLabel id="demo-multiple-name-label">Auction</InputLabel>
          <Select
            labelId="demo-multiple-name-label"
            id="demo-multiple-name"
            // commenting this out so you can only send it to one
            // multiple
            value={auctionContact}
            onChange={handleChangeAuction}
            input={<OutlinedInput label="Name" />}
            MenuProps={MenuProps}
          >
            {auctions.map((name) => (
              <MenuItem
                key={name}
                value={name}
              >
                {name.itemName}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        </Grid>
        </Grid>
        <Grid item>
        <TextField 
            // value={titulo} 
            name = "title"
            onChange={handleTextFieldTitle}
            fullWidth
            id="outlined-multiline-static"
            label="Title"
            multiline
            rows={1}
            // defaultValue=""
          />
        </Grid>
        {/* <br /> */}
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
        {/* </Box> */}

        <br />
        <br />
          <br />
          <br />
          <br />

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


    </>
  );
}
