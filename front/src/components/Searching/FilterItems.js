import React from 'react'
import './Search.css'
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';
import ReactPaginate from 'react-paginate';
import {useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import ApplyFilters from './ApplyFilters';
import Header from '../Typography/Header';
import Detail from '../Typography/Detail';

// Material UI components
import RemoveShoppingCartSharpIcon from '@mui/icons-material/RemoveShoppingCartSharp';
import ShoppingCartSharpIcon from '@mui/icons-material/ShoppingCartSharp';
import DoneOutlineSharpIcon from '@mui/icons-material/DoneOutlineSharp';
import AccessTimeFilledSharpIcon from '@mui/icons-material/AccessTimeFilledSharp';
import ClearAllIcon from '@mui/icons-material/ClearAll';

function FilterItems(props) {
  
    const [finalList, setFinalList] = useState([]);
    const [filteredList, setFilteredList] = useState([]);
    const [itemList, setItemList] = useState([]);
    const [wordText, setWordText] = useState("");
    const [wordBar, setWordBar] = useState("");

    // for the price range
    const [superMax, setSuperMax] = useState(100);
    const [priceRange, setPriceRange] = React.useState([0, superMax]);
    const [location, setLocation] = React.useState("");
    const [country, setCountry] = React.useState([]);

    const [selectedFilters, setSelectedFilters] = React.useState([]);

    let navigate = useNavigate();

    useEffect(()=>{
        
        for (var i=0;i< props.items.length ; i++){
            if(props.items[i].currently>superMax){
                setSuperMax(props.items[i].currently);
            }
        }
        setItemList(props.items);
        setFinalList(props.items);

        // eslint-disable-next-line
    }, [props.items]);

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
    }

    // Pagination Information
    const [pageNumber, setPageNumber] = useState(0);
    const itemsPerPage = 3;
    const visitedPages = pageNumber * itemsPerPage;
    const pageCount = Math.ceil(finalList.length / itemsPerPage);

    // Displaying the items of this particular page
    const displayItems = finalList.slice( visitedPages, visitedPages + itemsPerPage ).map((value, key)=>{
            return <div className='item' onClick={()=>{navigate(`/item/${value.id}`)}}> 
                    <div className='name'>{value.name} </div>
                    <div className='body'>
                        <img alt="cover" className='lando_image' src={value.coverPhoto} />
                    </div>
                    <div className='footer gradient-custom'>
                        { value.state==='EXPECTED' && 
                            <>
                            <AccessTimeFilledSharpIcon />
                            <div > {value.state}</div> 
                            </>
                        }
                        {  value.state==='AVAILABLE' && 
                            <>
                            <DoneOutlineSharpIcon />
                            <div > {value.state}</div> 
                            </>
                        }
                        { value.state==='EXPIRED' && 
                            <>
                            <RemoveShoppingCartSharpIcon />
                            <div > {value.state}</div> 
                            </>
                        }
                        { value.state==='PURCHASED' && 
                            <>
                            <ShoppingCartSharpIcon />
                            <div > {value.state}</div> 
                            </>
                        }
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
    <div className="search">
    <br /> 

      { itemList.length!==0 && 
        <>

        {/* Here the three choises for filtering */}
        <div className="searchInputs">
        
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
              
            { (Object.keys(selectedFilters).length > 0  || Object.keys(wordText).length > 0)&&
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
              return <a className='searchItem' onClick={()=>{navigate(`/item/${value.id}`)}} > 
                      <p>{value.name}  {value.currently} € </p>
                      </a>
                      ;
              })}
            </div> 
          }
  
  </>
          }
        </div>

        <div className="search">

        { finalList.length===0 && itemList.length!==0 &&
                <>
                <br />
                <Detail text="no auctions" />
                </>
        }

        </div>

        <div className="search">


        { finalList.length!==0 && (
          
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
          
          </div>)
        }

    </div>

    </>
  )
}

export default FilterItems