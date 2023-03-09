import React, {useContext,useEffect, useState} from 'react';
import {AuthContext} from '../components/AuthContext';
import {useNavigate, Link} from 'react-router-dom';
import axios from 'axios';
import {Rating} from '@mui/material';
import MarkEmailUnreadIcon from '@mui/icons-material/MarkEmailUnread';
import MarkunreadIcon from '@mui/icons-material/Markunread';
import PointOfSaleSharpIcon from '@mui/icons-material/PointOfSaleSharp';
import {Grid} from '@mui/material';
import ShoppingBagSharpIcon from '@mui/icons-material/ShoppingBagSharp';
import Recommendations from '../components/Modals/Recommendations';
import Header from '../components/Typography/Header';
import Title from '../components/Typography/Title';
import FilterItems from '../components/Searching/FilterItems';

function Dashboard() {

    const {authState} = useContext(AuthContext);
    let navigate=useNavigate();
    let id = authState.id;
    const [userInfo, setUserInfo]= useState({});
    const [myItems, setMyItems] = useState([]);
    const [myPastItems, setMyPastItems] = useState([]);
    const [myWatchlist, setMyWatchlist] = useState([]);
    const [gotMail, setGotMail] = useState(false);

    useEffect(()=>{

            axios.get(`https://localhost:33123/auth/fetchyall/${id}`).then((response)=>{
                if(response.data.message){
                      console.log(response.data.message);
                      navigate('/');
                }
                else{
            
                    setUserInfo(response.data);

                    // check if they have mail
                    axios.get(`https://localhost:33123/mail/newmail/${id}`).then((respi)=>{

                        if(respi.data.gotmail===true){
                            setGotMail(true);
                         }
                    }).catch((error) => {});

                    axios.get(`https://localhost:33123/items/fetchByUser/${id}`).then((res)=>{
                        
                        const available = res.data.filter((value)=>{
                            return (value.state==='EXPECTED' || value.state==='AVAILABLE' );
                        });
                        const past = res.data.filter((value)=>{
                            return (value.state==='PURCHASED' || value.state==='EXPIRED' );
                        });
                  
                        setMyItems(available);
                        setMyPastItems(past);
        
                        }).catch((error) => {
                            navigate('/');
                    });

                    axios.get(`https://localhost:33123/items/mywatchlist/${id}`).then((resbidy)=>{
                        setMyWatchlist(resbidy.data);
                    }).catch((error) => {
                        navigate('/');
                    });

                }
            }).catch((error) => {
                console.log(error);
                navigate('/');
            });
            
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[gotMail]);

    return (
        <div>
            
            <div className='container'>
                <Title title={`${userInfo.name} ${userInfo.surname}`} />
            </div>

            <Grid container spacing={2}>

                <Grid item xs={10}> 
                    <div className="searchInputs">
                        <Title title={`${userInfo.username}`} />
                    </div>

                    <div className="searchInputs">

                        <Header text={`${userInfo.location}, ${userInfo.country}`} />
                        
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
                <Grid item xs={2}>
                    { !gotMail ? (<> 
                        <Link style={{ color: 'white' }} to="/mail"> 
                        <button className='buttonito' style={{
                            display: 'flex',
                            alignItems: 'center',
                            textAlign: 'center',
                            flexWrap: 'wrap',
                            width: '139px',
                        }}>
                        <MarkunreadIcon style={{ color: 'white' }} />&nbsp; All Caught Up!
                        </button>
                        </Link>   
                        </>)
                        :
                        (<> 
                        <Link style={{ color: 'black' }} to="/mail"> 
                        <button className='buttonitoInfo' style={{
                        display: 'flex',
                        alignItems: 'center',
                        textAlign: 'center',
                        flexWrap: 'wrap',
                        width: '150px',
                    }}>
                        <MarkEmailUnreadIcon style={{ color: 'white' }} />&nbsp; You've Got Mail!
                        </button>
                        </Link>   
                        </>)
                    }
                </Grid>
            </Grid>


            <Recommendations />
            <div className="profileContainer">
                <div className="informationSection">


                    <div className='container'>

                        <Title title={"Active Auctions"} />
                    
                        </div>
                    
                        { myItems.length!==0 ? 
                            <div className='container'>
                                <Header text="The catalogue of your current listings" />
                            </div>
                            :
                            <div className='container'>
                                <Header text="No current listings, start selling by clicking below" />
                            </div>
                        }

                    <div className='container'>

                        <div className='container'>
                            <FilterItems items={myItems} />
                        </div>
                    
                    </div>

                    <div className='container'>
                        <button className="buttonito" onClick={ ()=> {navigate('/createitem')}}>CREATE A NEW AUCTION</button>
                    </div>

                    <br />
                    <div className='container'>
                        <Title title={"Watchlist"} />
                    </div>

                    { myWatchlist.length!==0 ? 
                    <div className='container'>
                        <Header text="Keep track of the items you're bidding on" />
                    </div>
                    :
                    <div className='container'>
                        <Header text="When you bid on an auction it will appear here" />
                    </div>
                    }
                    <div className='container'>
                        <FilterItems items={myWatchlist} /> 
                    </div>

                    <br />
                    <div className='container'>                    
                        <Title title={"Past Auctions"} />
                    </div>

                    { myPastItems.length!==0 ? 
                        <div className='container'>
                            {/* <Header text="Go through the history of your listings" /> */}
                        </div>
                    :
                        <div className='container'>
                            <Header text="You have currently no past listings" />
                        </div>
                    }

                    <div className='container'>
                        <FilterItems items={myPastItems} /> 
                    </div>
                    
                </div>
        

            </div>

        </div>
    )
}

export default Dashboard
