import React, { useEffect, useState, useContext } from 'react';
import {useNavigate, useParams} from 'react-router-dom';
import axios from 'axios';
import {AuthContext} from '../components/AuthContext';
import Title from '../components/Typography/Title';
import Header from '../components/Typography/Header';
import DisplayCoordinates from '../components/Maps/DisplayCoordinates';
import Detail from '../components/Typography/Detail';
import HeaderNormal from '../components/Typography/HeaderNormal';
import ReactPaginate from 'react-paginate';
import ConvertDMS from '../components/Maps/ConvertDMS';

// Material UI components
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import NotInterestedIcon from '@mui/icons-material/NotInterested';
import PointOfSaleSharpIcon from '@mui/icons-material/PointOfSaleSharp';
import ShoppingBagSharpIcon from '@mui/icons-material/ShoppingBagSharp';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIphoneIcon from '@mui/icons-material/PhoneIphone';
import AssuredWorkloadIcon from '@mui/icons-material/AssuredWorkload';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import {Rating} from '@mui/material';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { Grid } from '@mui/material';
import Divider from '@mui/material/Divider';
import Modal from '@mui/material/Modal';

// Modals style
const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 600,
  bgcolor: 'background.paper',
  border: '2px solid lightBlue',
  borderRadius: 6,
  boxShadow: 24,
  p: 4,
};

function Profile() {

    let navigate=useNavigate();
    let {id} = useParams();
    const [userInfo, setUserInfo]= useState({});
    const [myItems, setMyItems] = useState([]);

    const [coordinates, setCoordinates] = useState([]);

    const {authState} = useContext(AuthContext);

    useEffect(()=>{
            axios.get(`https://localhost:33123/auth/fetchyall/${id}`).then((response)=>{
                if(response.data.message){
                    console.log(response.data.message);
                    navigate('/');
                }
                else{
            
                    setUserInfo(response.data);

                    if (response.data.latitudeLongitude!==null){
                        setCoordinates(response.data.latitudeLongitude.coordinates);
                    }

                    axios.get(`https://localhost:33123/items/fetchByUser/${id}`).then((res)=>{
                        const available = res.data.filter((value)=>{
                            return (value.state==='AVAILABLE' );
                        });
                        setMyItems(available);
        
                    }).catch((error) => {
                        console.log(error);
                        navigate('/');
                    });
                }
            }).catch((error) => {
                console.log(error);
                navigate('/');
            });
    }, [id, navigate]);


    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);


    const handleApprove =()=>{

        if (authState.username==="admin"){

                var approvedl = [];
                approvedl.push(userInfo.id);
                const head={ headers:{
                        accessToken: localStorage.getItem("accessToken")
                    }
                }
                axios.put("https://localhost:33123/auth/approve", approvedl, head).then((res)=>{
                    if (res.data.error){
                        alert("There was an error!");
                    }
                });

                // Change to approved so the changes are shown in the ui as well dynamically
                setUserInfo({...userInfo, approved: true});

        }
        handleClose();
        
      }

    // Pagination Information
    const [pageNumber, setPageNumber] = useState(0);
    const itemsPerPage = 6;
    const visitedPages = pageNumber * itemsPerPage;
    const pageCount = Math.ceil(myItems.length / itemsPerPage);

    // Displaying the items of this particular page
    const displayItems = myItems.slice( visitedPages, visitedPages + itemsPerPage ).map((value, key)=>{
            return <div className='item' onClick={()=>{navigate(`/item/${value.id}`)}}> 
                    <div className='name'>{value.name} </div>
                    <div className='body'>
                        <img className='lando_image' src={value.coverPhoto} alt="product" />
                    </div>
                    <div className='footer gradient-custom'>
                        <div > {value.location}, {value.country}</div> 
                        <div style={{ color: '#14b6e3' }}> {value.currently} € &nbsp;&nbsp;</div>
                    </div>
                    </div>
            ;
    });
    

    const changePage = ({selected}) => {
        setPageNumber(selected);
    };


  return (
    <>

        <div className='container'>
            <Title title={`${userInfo.name} ${userInfo.surname}`} />
        </div>

        <Grid container spacing={2}>
            <Grid item xs={10}> 
                <div className="searchInputs">
                    <Title title={`${userInfo.username}`} />
                    { userInfo.approved ? 
                        <CheckCircleIcon style={{ color: 'teal' }} sx={{ width: 20, height: 32 }}/>
                        :
                        <NotInterestedIcon style={{ color: 'teal' }} sx={{ width: 20, height: 32 }}/>
                    }
                </div>
                <div className="searchInputs">
                    
                    <Header text={<div style={{
                            display: 'flex',
                            alignItems: 'center',
                            textAlign: 'center',
                            flexWrap: 'wrap',
                            }}>
                        <LocationOnIcon />
                        {userInfo.location}, {userInfo.country}
                        </div>} />

                
                    <Header text={ <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            textAlign: 'center',
                            flexWrap: 'wrap',
                            }}>
                        <PointOfSaleSharpIcon />
                        { userInfo.saleCount ? 
                        (   <>&nbsp;Seller Rating: {userInfo.sellerRating} &nbsp; Average: &nbsp;
                            <Rating name="read-only" value= {userInfo.sellerRating/userInfo.saleCount } readOnly precision={0.5}/>
                            </>
                        )
                        :
                        (   <>&nbsp;No Sales Yet
                            </>
                        )
                        } 
                        </div>} 
                    />

                    <Header text={ <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            textAlign: 'center',
                            flexWrap: 'wrap',
                            }}>
                        <ShoppingBagSharpIcon />
                        { userInfo.buyCount ? 
                        (<>
                        &nbsp;Bidder Rating: {userInfo.bidderRating} &nbsp; Average: &nbsp;
                        <Rating name="read-only" value={userInfo.bidderRating/userInfo.buyCount } readOnly precision={0.5}/>
                        </>)
                        :
                        (<>
                        &nbsp;No Purchases Yet
                        </>
                        )
                        }
                        </div>} 
                    />

                </div>

            </Grid>

            
            </Grid>
            {/* Admin will be able to see all the user information */}
            { authState.username === 'admin' &&
                <>

        <Grid container spacing={2}>
            <Grid item xs={10}> 
                
                
                <div className="searchInputs">
                    
                    <Header text={<div style={{
                            display: 'flex',
                            alignItems: 'center',
                            textAlign: 'center',
                            flexWrap: 'wrap',
                            }}>
                        <EmailIcon />&nbsp;
                        {userInfo.email}
                        </div>} />
                        <Header text={<div style={{
                            display: 'flex',
                            alignItems: 'center',
                            textAlign: 'center',
                            flexWrap: 'wrap',
                            }}>
                        <PhoneIphoneIcon />&nbsp;
                        {userInfo.telephone}
                        </div>} />
                        <Header text={<div style={{
                            display: 'flex',
                            alignItems: 'center',
                            textAlign: 'center',
                            flexWrap: 'wrap',
                            }}>
                        <AssuredWorkloadIcon />&nbsp;
                        {userInfo.taxnumber}
                        </div>} />

                </div>

            </Grid>

            
        </Grid>

        { Object.keys(coordinates).length > 0 &&
            <Detail text={<div>
                        {userInfo.username}'s Location on the Map
                        <DisplayCoordinates lat={coordinates[0]} lng={coordinates[1]} />
                        {ConvertDMS(coordinates[0], coordinates[1])}
                </div>}
            />
        }
            
            { !userInfo.approved &&
                            <>
                            <Header text={`${userInfo.username} hasn't been approved yet.`} />
                            <button className='buttonito' onClick={handleOpen}>
                            Approve
                            </button>
                            </>
                        }
            </>
        }
        <Divider />
        <br />

        { myItems.length!==0 && (
            <>
                <Detail text={`${userInfo.username}'s Auctions`} />
                <div className="container">
                    
                    {/* Display Items Paginated */}
                    {displayItems}
                        
                    {/* The pagination */}
                    <ReactPaginate 
                        previousLabel={"<"}
                        nextLabel={">"}
                        pageCount={pageCount}
                        onPageChange={changePage}
                        containerClassName={"paginationButtons"}
                        previousLinkClassName={"previousButton"}
                        nextLinkClassName={"nextButton"}
                        disabledClassName={"paginationDisabled"}
                        activeClassName={"paginationActive"}
                    />

                </div> 
            </>)
        }

        <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
        >
        <Box sx={style}>
        <Typography id="modal-modal-title" variant="h5" component="h2">
    Approve {userInfo.username}?
        </Typography>
        {/* <HeaderNormal text="You can't reverse this action" /> */}
        <button className="buttonitoReverse" onClick={handleClose}>Cancel</button>
        <button className="buttonito"  onClick={handleApprove} autoFocus>Confirm</button>
        </Box>
        </Modal>

    </>

  )
}

export default Profile;
