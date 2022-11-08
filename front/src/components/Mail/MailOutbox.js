import React from 'react'
import axios from 'axios';
import {useEffect, useState, useContext} from 'react';
import {AuthContext} from '../AuthContext';
import MessageCard from './MessageCard';

// MUI components
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Typography from '@mui/material/Typography';
import ReactPaginate from 'react-paginate';
import AccountBox from '@mui/icons-material/AccountBox';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Detail from '../Typography/Detail';
import DeleteIcon from '@mui/icons-material/Delete';
import ListItemButton from '@mui/material/ListItemButton';
import { Grid } from '@mui/material';

export default function MailOutbox() {

  const [mailList, setMailList] = useState([]);
  const [messageDisplayed, setMessageDisplayed] = useState({});
  const [clicked, setClicked] = useState(false);
  const [newDeleted, setNewDeleted] = useState(false);
  const {authState} = useContext(AuthContext);

  useEffect(()=>{

      const head={ headers:{
          accessToken: localStorage.getItem("accessToken"),
        }
      }

      axios.get(`https://localhost:33123/mail/outbox/${authState.id}`, head).then((res)=>{
        setMailList(res.data.slice(0).reverse());
      });

  // eslint-disable-next-line
  }, [newDeleted]);

  // To limit the amount of characters from the body
  const certainChars =(str)=>{
    if(str.length > 75) {
      str = str.substring(0,72);
      str += '...';
    }
    return str;
  };

  const displayMessage = (name) =>{
      axios.get(`https://localhost:33123/auth/fetchy/${name.senderId}`).then((respo)=>{
              name.name = respo.data.name;
              name.surname = respo.data.surname;

              setMessageDisplayed(name);
              setClicked(true);
      });
  }

  const deleteMessage = (name) =>{

        axios.put(`https://localhost:33123/mail/message/deleteoutbox/${name.id}`).then((res)=>{
        });
        let mails = [...mailList];

        for (var i=0;i<mailList.length;i++){
          if (mailList[i].id===name.id){
            let mail = {...mails[i]};
            mail.deletedOutbox = true;
            mails[1] = mail;
            setMailList(mails);
          }
        }
        
        if( newDeleted){
          setNewDeleted(false);
        }
        else{
          setNewDeleted(true);
        }

  };


  // Pagination Information
  const [pageNumber, setPageNumber] = useState(0);
  const [mailPerPage, setMailPerPage] = useState(6);

  const handleChangeRows = (event) => {
    setMailPerPage(event.target.value);
  };

  const visitedPages = pageNumber * mailPerPage;
  const pageCount = Math.ceil(mailList.length / mailPerPage);

  // Displaying the items of this particular page
  const displayMail = mailList.slice( visitedPages, visitedPages + mailPerPage ).map((value, key)=>{
    return (
      <div >
      <ListItemButton alignItems="flex-start" name={value} onClick={()=>{displayMessage(value)}} >
        <ListItemAvatar >
          <AccountBox  style={{color:'teal', fontSize: 35}} />
          {/* // <Avatar alt={value.senderSurname} src="/static/images/avatar/1.jpg" /> */}
        </ListItemAvatar>
        <ListItemText
          primary={value.title}
          secondary={
            <React.Fragment>
              <Typography
                sx={{ display: 'inline' }}
                component="span"
                variant="body2"
                color="text.primary"
              >
                {value.recipientSurname}, {value.recipientName}
              </Typography>
              {` — ${certainChars(value.body)}`}
            </React.Fragment>
          }
        />
          <DeleteIcon  style={{ color: 'teal' }} sx={{ width: 20, height: 20 }} onClick={()=>{deleteMessage(value)}} />
      </ListItemButton>
      <Divider variant="inset" component="li" />
      </div>
      );
    }
  );
  
  const changePage = ({selected}) => {
      setPageNumber(selected);
  };

  return (
    <Grid container spacing={1} >
      <Grid item xs={4} > 
        <List sx={{ width: '100%', maxWidth: 400, bgcolor: 'background.paper' , paddingLeft: 6 }}>
          {displayMail}
        </List>

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
        {/* Mail per page */}
        <div style={{width:140, paddingLeft:40}}>
        <Detail text={<div> 
          <Box sx={{ minWidth: 50 }}>
            <FormControl fullWidth>
              <InputLabel id="demo-simple-select-label">Mail per Page</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={mailPerPage}
                label="mail"
                onChange={handleChangeRows}
                variant="standard"
              >
                <MenuItem value={6}>6</MenuItem>
                <MenuItem value={9}>9</MenuItem>
                <MenuItem value={12}>12</MenuItem>
                <MenuItem value={24}>24</MenuItem>
                <MenuItem value={48}>48</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </div>} />
        </div>
      </Grid>
      <Grid item xs={0.4} >

      </Grid>
      <Grid item xs={7.6} >
        { clicked &&
          <MessageCard message={messageDisplayed} type="outbox" />
        } 
      </Grid>
    </Grid>
  );
}
