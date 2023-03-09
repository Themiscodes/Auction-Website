import React, { useEffect, useState, useContext } from 'react'
import { Link} from 'react-router-dom';
import {AuthContext } from './AuthContext'
import Logout from './Login/Logout';
import Badge from '@mui/material/Badge';
import MailIcon from '@mui/icons-material/Mail';
import axios from 'axios';

// The navigatior bar
function Navbar(props) {
  
  const {authState} = useContext(AuthContext);
  const [gotMail, setGotMail] = useState(0);

  useEffect(()=>{

    axios.get(`https://localhost:33123/mail/newmailcount/${authState.id}`).then((respi)=>{

      if(respi.data.count===0){
            setGotMail(0);
        }
        else {
          setGotMail(respi.data.count);

        }
        console.log(respi.data.count);

        }).catch((error) => {
      });

  });

  return (
    <div>

      <div className="navbar gradient-custom">
            
        {!authState.status ? (<> 
          
          {props.clicked==="home" ?
              <Link style={{ color: 'rgba(0, 0, 0, 0.36)' }} to="/">Home</Link>
              :
              <Link style={{ color: 'white' }} to="/">Home</Link>
            }
          {props.clicked==="login" ?
              <Link style={{ color: 'rgba(0, 0, 0, 0.36)' }} to="/login">Login/Register</Link>
              :
              <Link style={{ color: 'white' }} to="/login">Login/Register</Link>
            }
          {props.clicked==="auctions" ?
              <Link style={{ color: 'rgba(0, 0, 0, 0.36)' }} to="/auctions">Auctions</Link>
              :
              <Link style={{ color: 'white' }} to="/auctions">Auctions</Link>
            }
          {/* {props.clicked==="search" ?
              <Link style={{ color: 'rgba(0, 0, 0, 0.36)' }} to="/search">Search&nbsp;&nbsp;&nbsp;</Link>
              :
              <Link style={{ color: 'white' }} to="/search">Search&nbsp;&nbsp;&nbsp;</Link>
            } */}
        </>)
        :
          (<>
        
          {/* Admin won't be able to post an item, but to modify the users */}
          { ! (authState.username==="admin") ? (<> 
      
            {props.clicked==="mail" ?
              <div style={{ marginTop:6 }}>
                <Link style={{ color: 'rgba(0, 0, 0, 0.36)' }} to="/mail"><MailIcon color="white" /></Link>  
              </div>
              :
              <>
              { (gotMail!==0) ?
                <Link style={{ color: 'white' }} to="/mail"> 
                <Badge badgeContent={gotMail} color="info">
                <MailIcon color="white" />
                </Badge>
                </Link>  
                :
                <div style={{ marginTop:6 }}>
                <Link style={{ color: 'white' }} to="/mail"><MailIcon color="white" /></Link>  
                </div>
              }
              </>
            }
            

            {props.clicked==="home" ?
              <Link style={{ color: 'rgba(0, 0, 0, 0.36)' }} to="/">Home</Link>
              :
              <Link style={{ color: 'white' }} to="/">Home</Link>
            }

            {props.clicked==="createitem" ?
              <Link style={{ color: 'rgba(0, 0, 0, 0.36)' }} to="/createitem">Create</Link>
              :
              <Link style={{ color: 'white' }} to="/createitem">Create</Link>
            }

          </>)
          :
          (<> 
            {props.clicked==="users" ?
              <Link style={{ color: 'rgba(0, 0, 0, 0.36)' }} to="/users">Users</Link>
              :
              <Link style={{ color: 'white' }} to="/users">Users</Link>
            }
            {props.clicked==="addcategory" ?
              <Link style={{ color: 'rgba(0, 0, 0, 0.36)' }} to="/addcategory">Categories</Link>
              :
              <Link style={{ color: 'white' }} to="/addcategory">Categories</Link>
            }
            {/* {props.clicked==="export" ?
              <Link style={{ color: 'rgba(0, 0, 0, 0.36)' }} to="/export">Export</Link>
              :
              <Link style={{ color: 'white' }} to="/export">Export</Link>
            } */}
            </>)
          }
          
          {props.clicked==="auctions" ?
              <Link style={{ color:'rgba(0, 0, 0, 0.36)' }} to="/auctions">Auctions</Link>
              :
              <Link style={{ color: 'white' }} to="/auctions">Auctions</Link>
            }
          {/* {props.clicked==="search" ?
              <Link style={{ color: 'rgba(0, 0, 0, 0.36)' }} to="/search">Search&nbsp;&nbsp;&nbsp;</Link>
              :
              <Link style={{ color: 'white' }} to="/search">Search&nbsp;&nbsp;&nbsp;</Link>
            } */}
          <div className ="loggedInContainer"> 
              
            <div className ="h1" style={{ color: 'white' }}>&nbsp;Signed in as {authState.username} </div>
            <Logout />
          </div>
          </>)
        }   
            
      </div>
    </div>
  )
}

export default Navbar
