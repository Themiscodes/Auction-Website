import React from 'react'
import './Search.css'
import ReactPaginate from 'react-paginate';
import axios from 'axios';
import {useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import CategoriesSelect from './CategoriesSelect';
import ApplyFilters from './ApplyFilters';
import Title from '../Typography/Title';
import Header from '../Typography/Header';
import Detail from '../Typography/Detail';

// MUI components
import { Typography } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';
import ClearAllIcon from '@mui/icons-material/ClearAll';
import {Button} from '@mui/material';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

function FilterCategories() {
  
    const [finalList, setFinalList] = useState([]);
    const [filteredList, setFilteredList] = useState([]);
    const [itemList, setItemList] = useState([]);
    const [wordText, setWordText] = useState("");
    const [wordBar, setWordBar] = useState("");
    const [complete, setComplete] = useState(false);

    // for the price range
    const [superMax, setSuperMax] = useState(100);
    const [priceRange, setPriceRange] = React.useState([0, superMax]);
    const [location, setLocation] = React.useState("");
    const [country, setCountry] = React.useState([]);

    const [selectedFilters, setSelectedFilters] = React.useState([]);

    const [selectedCategory, setSelectedCategory] = useState({});

    let navigate = useNavigate();

    useEffect(()=>{
        
        // if no category selected bring everything
        if (Object.keys(selectedCategory).length <=0 ){
            axios.get(`https://localhost:33123/items`).then((res)=>{
                for (var i=0;i< res.data.length ; i++){
                    if(res.data[i].currently>superMax){
                        setSuperMax(res.data[i].currently);
                    }
                }
                setItemList(res.data);
                setFinalList(res.data);
                setComplete(true);
            });
        }
        else{
            
            setWordText("");
            setSelectedFilters([]);
            setLocation("");
            setCountry("");
            setPriceRange([0, superMax]);
            axios.get(`https://localhost:33123/items/categories/${selectedCategory.id}`).then((res)=>{
                setItemList(res.data);
                setFinalList(res.data);
                setComplete(true);
                for (var i=0;i< res.data.length ; i++){
                    if(res.data[i].currently>superMax){
                        setSuperMax(res.data[i].currently);
                    }
                }
            });
        }

        // eslint-disable-next-line 
    }, [selectedCategory]);

    useEffect(()=>{

        var newFilteredData = finalList.filter((value)=>{
          return (value.currently>=priceRange[0] && value.currently<=priceRange[1] );
        });
        if (location!==""){
          newFilteredData = newFilteredData.filter((value)=>{
            return ( value.location===location );
          });
        }
        if (Object.keys(country).length >0){
          newFilteredData = newFilteredData.filter((value)=>{
            return ( value.country===country );
          });
        }

        setFinalList(newFilteredData);

        // eslint-disable-next-line 
    }, [priceRange, location, country]);

    const filterSearch = ( event ) =>{

      const searchText = event.target.value;
      setWordBar(searchText);
      const newFilteredData = finalList.filter((value)=>{
        return (value.name.toLowerCase().includes(searchText.toLowerCase()) ||
        value.description.toLowerCase().includes(searchText.toLowerCase()) );
      });
      if (searchText===""){
        setFilteredList([]);
      }
      else{
        setFilteredList(newFilteredData);
      }
    
    }


    const finalSearch = (e) =>{
      if (e.key === 'Enter') {
        setWordText(wordBar);
        setFinalList(filteredList);
        clearPressed();
      }
    }

    const clearPressed = () =>{
      setFilteredList([]);
      setWordBar("");
    }

    const clearFilters = () =>{
      setFinalList(itemList);
      setWordText("");
      setSelectedFilters([]);
      setLocation("");
      setCountry("");
      setPriceRange([0, superMax]);
      setSelectedCategory({});
    }

    // Pagination Information
    const [pageNumber, setPageNumber] = useState(0);
    const [itemsPerPage, setItemsPerPage] = useState(9);


    // const itemsPerPage = 9;
    const visitedPages = pageNumber * itemsPerPage;
    const pageCount = Math.ceil(finalList.length / itemsPerPage);

    // Displaying the items of this particular page
    const displayItems = finalList.slice( visitedPages, visitedPages + itemsPerPage ).map((value, key)=>{
      return <div className='item' onClick={()=>{navigate(`/item/${value.id}`)}}> 
              <div className='name'>{value.name} </div>
              <div className='body'>
                  <img className='lando_image' alt="cover" src={value.coverPhoto} />
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

    const handleChangeRows = (event) => {
      setItemsPerPage(event.target.value);
    };

  return (
    <>

  <Title title="Search Auctions" />
    <div className="search">
    <br /> 

        {/* Here the three choises for filtering */}
        <div className="searchInputs">

          {/* The category selection */}
          <CategoriesSelect setSelectedCategory={setSelectedCategory} />

          {/* The search bar */}
          <input type="text" placeholder="Type to search..." value={wordBar} onChange={filterSearch} onKeyDown={finalSearch}/>
          <div className="searchIcon">
            {filteredList.length ===0 ?
              <SearchIcon id="clearBtn" onClick={finalSearch}/>
                : 
              <ClearIcon  id="clearBtn" onClick={clearPressed} />
            }
          </div>

          {/* The filters for price, location and country */}
          <ApplyFilters max={superMax} setPriceRange={setPriceRange} setSelectedFilters={setSelectedFilters} setLocation={setLocation} setCountry={setCountry} />
        
        </div>

        {/* Here displaying the applied filters */}
        <div className="searchInputs">
 
          {  Object.keys(selectedCategory).length > 0  &&
            <Header text={selectedCategory.name} />
          }
          
          { Object.keys(selectedFilters).length > 0 && location!=="" &&
              <Header text={location} />
          }
          { Object.keys(selectedFilters).length > 0 && Object.keys(country).length > 0 &&
            <Header text={country} />
          }

          { Object.keys(selectedFilters).length > 0 && selectedFilters[3]!=="" &&
            <Header text={`Price Range: ${priceRange[0]}$ - ${priceRange[1]}$`} />
          }
              
          {  Object.keys(wordText).length > 0  &&
            <Header text={wordText} />
          }
            
          { (Object.keys(selectedFilters).length > 0  || Object.keys(selectedCategory).length > 0 || Object.keys(wordText).length > 0)&&
            <button className='buttonitoReverse' 
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      textAlign: 'center',
                      flexWrap: 'wrap',
                      width: '114px',
                      height: '28px',
                    }}
                    onClick={()=>{clearFilters()}} > Clear Filters&nbsp;<ClearAllIcon  id="clearBtn"/>
            </button>
          }

        </div>
          
        {/* These are the temporary results while searching on the bar */}
        { filteredList.length!==0 &&
          <div className="searchResult">
                {filteredList.map((value, key)=>{

                // eslint-disable-next-line 
                return (<a className='searchItem' onClick={()=>{navigate(`/item/${value.id}`)}} > 
                        <p>{value.name}  {value.currently} € </p>
                        </a>
                );
                })}
          </div> 
        }

        </div>

        <div className="search">

        { finalList.length===0 && complete &&
          <>
          <div className='container' style={{
            marginTop: 20,
          }}>
            <Typography sx={{fontFamily: 'Futura'}} variant="h4">
                            no auctions found
                    </Typography>
                    </div>
            <img alt="nothing" src='https://indususedcars.com/assets/theme/images/no_result_found.png' />
            <Header text="Clear your search criteria and broaden your search" />
            </>
        }

          { finalList.length===0 && !complete &&
            <>
            <div className='container' style={{
              marginTop: 10,
            }}>
              <Typography sx={{fontFamily: 'Futura'}} variant="h4">
                              Loading
                      </Typography>       
                      </div>
                      <img alt="Loading" src='https://i.pinimg.com/originals/f2/9f/02/f29f025c9ff5297e8083c52b01f1a709.gif' />
              </>
          }


        { finalList.length!==0 && (
          <>
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
              fontFamily: 'Futura'
              }}
              onClick={()=>{navigate('/filter')}}>Table View</Button>

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
                      <MenuItem value={9} >9</MenuItem>
                      <MenuItem value={18}>18</MenuItem>
                      <MenuItem value={27}>27</MenuItem>
                    </Select>
                  </FormControl>
                </Box>
              </div>} />


            </div>
          </>)
        }

    </div>

    </>
  )
}

export default FilterCategories