import * as React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import {Button} from '@mui/material';
import Title from '../Typography/Title';
import Header from '../Typography/Header';

const columns = [
    { field: 'name', headerName: 'Name', width: 180},
    { field: 'currently', headerName: 'Current Bid', type: 'number', width: 90},
    { field: 'number_of_bids', headerName: 'Bids', type: 'number', width: 40},
    { field: 'buy_price', headerName: 'Buying Price', type: 'number', width: 100},
    { field: 'location', headerName: 'Location', width: 150},
    { field: 'country', headerName: 'Country', width: 150 },
    { field: 'description', headerName: 'Description', width: 160 },
    { field: 'ends', headerName: 'Ending On', width: 165, type: 'dateTime', valueFormatter: params => 
    (new Date(params?.value).toLocaleString('en-GB'))},
]

export default function Filter() {

  const [itemList, setItemList] = useState([]);
  let navigate = useNavigate();

  useEffect(()=>{
      axios.get("https://localhost:33123/items").then((res)=>{
      setItemList(res.data);
      });
  }, []);

  // This to go to the item
  const handleOnCellClick = (params) => {
    for (var item=0;item<itemList.length;item++){
        if(itemList[item].id===params.id){
            navigate(`/item/${itemList[item].id}`);
        }
    }
  };


  return (
    <div style={{     minHeight: '90vh', width: '100%',
            backgroundImage: `url("https://localhost:33123/images/background.png")`,
            backgroundRepeat: 'repeat',
            }}>
      <div className="container" >
    
    
        <Title title="Active Auctions" />
      </div> 
      
      <div className="container" >

        <Header text="Filter, Sort and Search from the Menu. Click to go to the auction page" />
      <div className='container'>


          <div style={{ height: '100%', width: '100%' }}>
            <div style={{ height: 579, width: 1050, backgroundColor: 'white' }}>
              <DataGrid
                rows={itemList}
                columns={columns}
                pageSize={9}
                rowsPerPageOptions={[9]}
                disableSelectionOnClick
                onCellClick={handleOnCellClick}
              />
            </div>

            <Button variant="text"  sx={{
              mx: 'auto',
              height: 64,
              p: 1,
              m: 1,
              color: '#00C9FF',
              '&:hover': {
                backgroundColor: '#00C9FF',
                color: 'white',
              },
              bgcolor: (theme) =>
              theme.palette.mode === 'dark' ? '#101010' : 'grey.50',
              border: '1px solid',
              borderColor: (theme) =>
              theme.palette.mode === 'dark' ? 'grey.800' : 'grey.300',
              borderRadius: 2,
              textAlign: 'center',
              fontFamily: 'Futura',
              }}
              onClick={()=>{navigate('/search')}}>GALLERY VIEW
            </Button>

          </div>
        </div>
      </div>
    </div>
  );
}
