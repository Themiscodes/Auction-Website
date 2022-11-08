import React from 'react'
import axios from 'axios';
import {useEffect, useState, useContext} from 'react';
import {AuthContext} from '../AuthContext';
import MessageChat from './MessageChat';
import Detail from '../Typography/Detail';
import ReactPaginate from 'react-paginate';
import Header from '../Typography/Header'

// Material UI components
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Typography from '@mui/material/Typography';
import ListItemButton from '@mui/material/ListItemButton';
import { Grid, Rating } from '@mui/material';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import CardGiftcardIcon from '@mui/icons-material/CardGiftcard';

export default function MailPurchases() {

  const [mailList, setMailList] = useState([]);
  const [chatDisplayed, setChatDisplayed] = useState([]);
  const [clickedMail, setClickedMail] = useState({});
  const [clicked, setClicked] = useState(false);
  const {authState} = useContext(AuthContext);

  useEffect(()=>{

    const head={ headers:{
        accessToken: localStorage.getItem("accessToken"),
      }
    }

      axios.get(`https://localhost:33123/mail/bidder/${authState.id}`, head).then((res)=>{
        setMailList(res.data);
      });

  // eslint-disable-next-line
  }, []);


  const displayChat = (name) =>{

    const head={ headers:{
        accessToken: localStorage.getItem("accessToken"),
        mailId: name.id,
      }
    }

    for (var i = 0 ; i< mailList.length ; i++ ){
      if( name.id === mailList[i].id){
        setClickedMail(mailList[i]);
      }
    }
    
    axios.get(`https://localhost:33123/mail/seller/chat/${authState.id}`, head).then((res)=>{
        setChatDisplayed(res.data);
    });

    setClicked(true);
  }


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

      <ListItemButton alignItems="flex-start" name={value} onClick={()=>{displayChat(value)}} >
        <ListItemAvatar >
          <CardGiftcardIcon style={{color:'teal', fontSize: 35}} />
        </ListItemAvatar>
        <ListItemText
          primary={value.itemName}
          secondary={
              <>

              {   !value.arrived ?
                    <Header text={ <div style={{
                    // display: 'flex',
                    alignItems: 'center',
                    textAlign: 'center',
                    // flexWrap: 'wrap',
                    }}>
                    Awaiting Arrival
                  </div>} />
                  :  
                  <>
                  <Header text={ <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    textAlign: 'center',
                    flexWrap: 'wrap',
                    }}>
                    You rated the seller: &nbsp;
                  <Rating name="read-only" value={value.sellerRating} readOnly precision={0.5}/>
                  </div>} />
                  </>
              }
              {   !value.payed ?
                    <Header text={ <div style={{
                    alignItems: 'center',
                    textAlign: 'center',
                    }}>
                    Awaiting Payment
                  </div>} />
                  :  
                  <>
                  <Header text={ <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    textAlign: 'center',
                    flexWrap: 'wrap',
                    }}>
                    The seller rated you: &nbsp;
                  <Rating name="read-only" value={value.bidderRating} readOnly precision={0.5}/>
                  </div>} />
                  </>
              }

              </> 
          } 
        />
      </ListItemButton>
      <Divider variant="inset" component="li" />
      </div>
      );
  });

  const changePage = ({selected}) => {
      setPageNumber(selected);
  };

  return (
    <>
    { mailList.length ===0 && 
          <Box
          sx={{
            mx: 'auto',
            p: 3,
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
      <Typography variant="h2" gutterBottom>no purchases yet</Typography>
      </Box>
      }
    <Grid container spacing={1}>
        <Grid item xs={4} > 
          <List sx={{ width: '100%', maxWidth: 400, bgcolor: 'background.paper', paddingLeft: 6  }}>
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
                <InputLabel id="demo-simple-select-label">Items per Page</InputLabel>
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
            <MessageChat messages={chatDisplayed} mail={clickedMail} type="purchases" />
          } 
        </Grid>
      </Grid>
    </>
  );
}
