import React from 'react'
import axios from 'axios';
import {useNavigate} from 'react-router-dom';
import {useEffect, useState, useContext} from 'react';
import {AuthContext} from '../AuthContext';
import ReactPaginate from 'react-paginate'
import Title from '../Typography/Title';

function Recommendations() {

    const [itemList, setItemList] = useState([]);
    const {authState} = useContext(AuthContext);
    let navigate = useNavigate();

    useEffect(()=>{

        // This presupposes it is called from a place where the check that the auth state exists has been performed
        axios.get(`https://localhost:33123/items/top/${authState.id}`).then((res)=>{
            setItemList(res.data);

        });

    // eslint-disable-next-line
    }, []);



    // Pagination Information
    const [pageNumber, setPageNumber] = useState(0);
    const itemsPerPage = 3;
    const visitedPages = pageNumber * itemsPerPage;
    const pageCount = Math.ceil(itemList.length / itemsPerPage);

    // Displaying the items of this particular page
    const displayItems = itemList.slice( visitedPages, visitedPages + itemsPerPage ).map((value, key)=>{
            return <div className='item' onClick={()=>{navigate(`/item/${value.id}`)}}> 
                    <div className='name'>{value.name} </div>
                    <div className='body'>
                        <img className='lando_image' src={value.coverPhoto} alt="cover" />
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

            { itemList.length !==0 && 
                <>
                <div className="container">
                <Title title={"Top Picks for You"} />
                </div>
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
                </>
            }
        </>
  );
}

export default Recommendations
