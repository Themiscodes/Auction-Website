import React from 'react'
import './Search.css'
import ReactPaginate from 'react-paginate';
import axios from 'axios';
import {useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import CategoriesSelect from './CategoriesSelect';
import Title from '../Typography/Title';
import Header from '../Typography/Header';
import Detail from '../Typography/Detail';

// Material UI components
import { Typography } from '@mui/material';
import PetsIcon from '@mui/icons-material/Pets';
import ComputerIcon from '@mui/icons-material/Computer';
import CheckroomIcon from '@mui/icons-material/Checkroom';
import SnowboardingIcon from '@mui/icons-material/Snowboarding';
import ColorLensIcon from '@mui/icons-material/ColorLens';
import TwoWheelerIcon from '@mui/icons-material/TwoWheeler';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import HandymanIcon from '@mui/icons-material/Handyman';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

function Auctions() {
  
    const [itemList, setItemList] = useState([]);
    const [complete, setComplete] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState({});
    let navigate = useNavigate();

    useEffect(()=>{
        setItemList([]);
        setComplete(false);
        
        // if no category selected bring everything
        if (Object.keys(selectedCategory).length <=0 ){
            axios.get(`https://localhost:33123/items`).then((res)=>{
                setItemList(res.data);
                setComplete(true);
            });
        }
        else{

            axios.get(`https://localhost:33123/items/categories/${selectedCategory.id}`).then((res)=>{
                setItemList(res.data);
                setComplete(true);
            });
        }

    }, [selectedCategory]);

    // Pagination Information
    const [pageNumber, setPageNumber] = useState(0);
    const [itemsPerPage, setItemsPerPage] = useState(9);

    const handleChangeRows = (event) => {
      setItemsPerPage(event.target.value);
    };

    const visitedPages = pageNumber * itemsPerPage;
    const pageCount = Math.ceil(itemList.length / itemsPerPage);

    // Displaying the items of this particular page
    const displayItems = itemList.slice( visitedPages, visitedPages + itemsPerPage ).map((value, key)=>{
      return <div className='item' key={key} onClick={()=>{navigate(`/item/${value.id}`)}}> 
              <div className='name'>{value.name} </div>
              <div className='body'>
                  <img className='lando_image' src={value.coverPhoto} alt="coverphoto" />
              </div>
              <div className='footer gradient-custom'>
                  <div > {value.location}, {value.country}</div> 
                  <div style={{ color: '#14b6e3' }}> {value.currently} € &nbsp;&nbsp;</div>
              </div>
              </div>
    });
    
    const changePage = ({selected}) => {
        setPageNumber(selected);
    };

  return (
    <> 
    
      {  Object.keys(selectedCategory).length > 0  ?
        <Title title={selectedCategory.name} />
        :
        <Title title={"Shop by Category"} />
      }
        
      <div className="search">
        <div className="container" style={{
            marginTop: 3,
          }}>
          <Header text={<ComputerIcon style={{ color: '#00C9FF'}} />}  />
          <Header text={<PhotoCameraIcon style={{ color: '#00C9FF'}} />} />
          <Header text={<HandymanIcon style={{ color: '#00C9FF'}} />} />
          <Header text={<PetsIcon style={{ color: '#00C9FF'}} />} />
          <CategoriesSelect setSelectedCategory={setSelectedCategory} />
          <Header text={<ColorLensIcon style={{ color: '#00C9FF'}} />} />
          <Header text={<SnowboardingIcon style={{ color: '#00C9FF'}} />} />
          <Header text={<TwoWheelerIcon style={{ color: '#00C9FF'}} />} />
          <Header text={<CheckroomIcon style={{ color: '#00C9FF'}} />} />
        </div>

        <div className="search">

          { itemList.length===0 && complete &&
            <>
            <div className='container' style={{
              marginTop: 20,
            }}>
            
              <Typography sx={{fontFamily: 'Futura'}} variant="h4">
                              no auctions found
                      </Typography>
                      </div>
              <img src='https://indususedcars.com/assets/theme/images/no_result_found.png' alt="coverphoto" />
              <Header text={`Unfortunately there are no current listings for ${selectedCategory.name}`} />
              </>
          }

          { itemList.length===0 && !complete &&
            <>
            <div className='container' style={{
              marginTop: 10,
            }}>
              <Typography sx={{fontFamily: 'Futura'}} variant="h4">
                              Loading
                      </Typography>       
                      </div>
                      <img alt="coverphoto" src='https://i.pinimg.com/originals/f2/9f/02/f29f025c9ff5297e8083c52b01f1a709.gif' />
              </>
          }


        { itemList.length!==0 && (
          
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
           
              <div className="container">
              
                {/* Items per page */}
                  <Detail text={<div> 
                    <Box sx={{ minWidth: 100 }}>
                      <FormControl fullWidth>
                        <InputLabel id="demo-simple-select-label">Items/Page</InputLabel>
                        <Select
                          labelId="demo-simple-select-label"
                          id="demo-simple-select"
                          value={itemsPerPage}
                          label="items"
                          onChange={handleChangeRows}
                          variant="standard"
                        >
                          <MenuItem value={9}>9</MenuItem>
                          <MenuItem value={18}>18</MenuItem>
                          <MenuItem value={27}>27</MenuItem>
                        </Select>
                      </FormControl>
                    </Box>
                  </div>} />
                  </div>
          </div>)
        }
        </div>
    </div>

    </>
  )
}

export default Auctions