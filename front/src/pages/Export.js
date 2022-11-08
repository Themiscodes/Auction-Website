import React, {useContext,useEffect, useState} from 'react';
import {AuthContext} from '../components/AuthContext';
import axios from 'axios';
import { Download } from '../components/Admin/Download';
import { DownloadXML } from '../components/Admin/DownloadXML';
import Title from '../components/Typography/Title';
import Header from '../components/Typography/Header';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';

// Grid columns
const columns = [
  { field: 'name', headerName: 'Name', width: 180},
  { field: 'currently', headerName: 'Currently', type: 'number', width: 70},
  { field: 'number_of_bids', headerName: 'Bids', type: 'number', width: 40},
  { field: 'buy_price', headerName: 'Buying Price', type: 'number', width: 100},
  { field: 'location', headerName: 'Location', width: 150},
  { field: 'country', headerName: 'Country', width: 150 },
  { field: 'description', headerName: 'Description', width: 160 },
  { field: 'ends', headerName: 'Ending On', width: 165, type: 'dateTime', valueFormatter: params => 
  (new Date(params?.value).toLocaleString('en-GB'))},
  { field: 'state', headerName: 'State', width: 100},
]

// Functional component for the Exports in CSV, XML or JSON
export default function Export() {

  const {authState} = useContext(AuthContext);    
  const [itemList, setItemList] = useState([]);

  // Get all the items from the backend
  useEffect(()=>{

      const head= { headers:{
            accessToken: localStorage.getItem("accessToken"),
            username: authState.username,
        }
      }

      axios.get("https://localhost:33123/items/admin/", head).then((res)=>{
        setItemList(res.data);
      });

  }, [authState.username]);

  return (

    <div style = {{ minHeight: '90vh', width: '100%', backgroundRepeat: 'repeat',
                    backgroundImage: `url("https://localhost:33123/images/background.png")`,
    }}>
    
      {/* Firstly the page headers */}
      <div className='container'>
        <Title title="Export Auction Data" />
      </div>

      <div className="container" >
        <Header text="Select specific or download all auction data in the format you desire" />
      </div>

      {/* The grid with the displayed information about the items */}
      <div className='container' style={{ height: '100%', width: '100%' }}>
        <div style={{ height: 600, width: 1200, backgroundColor: 'white' }}>
          <DataGrid
            rows={itemList}
            columns={columns}
            pageSize={8}
            rowsPerPageOptions={[8]}
            checkboxSelection
            components={{
              Toolbar: GridToolbar,
            }}
          />
        </div>
      </div>

      {/* The two buttons to download in the corresponding format */}
      <div className='container'>
        <Download username={authState.username} />
        <DownloadXML username={authState.username} />
      </div>

    </div>

  );
}
