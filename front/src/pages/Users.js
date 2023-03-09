import React, {useEffect, useState} from 'react';
import axios from 'axios';
import {useNavigate} from 'react-router-dom';
import UserCard from '../components/Admin/UserCard';
import Title from '../components/Typography/Title';
import Header from '../components/Typography/Header';
import ReactPaginate from 'react-paginate';

// For the material modal
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import { DataGrid } from '@mui/x-data-grid';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import NotInterestedIcon from '@mui/icons-material/NotInterested';

// The MUI alert definition
const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

// The style for the modals
const style = {
  
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 1100,
  bgcolor: 'background.paper',
  border: '2px solid lightBlue',
  borderRadius: 6,
  boxShadow: 24,
  p: 4,
};

// The grid columns
const columns = [
    { field: 'id', headerName: 'ID', width: 70},
    { field: 'username', headerName: 'Username', width: 160},
    { field: 'name', headerName: 'Name', width: 160},
    { field: 'surname', headerName: 'Surname', width: 160 },
    { field: 'email', headerName: 'email', width: 200},
    { field: 'telephone', headerName: 'Telephone', width: 150},
    { field: 'taxnumber', headerName: 'Tax Number', width: 100}
]

// Displaying the Users to the admin and their information
function Users() {

  let navigate = useNavigate();

  // The three required lists so that it can be updated dynamically
  const [userList, setUserList] = useState([]);
  const [notApprovedList, setNotApprovedList] = useState([]);
  const [approvedList, setApprovedList] = useState([]);

  useEffect(()=>{

    const head = { headers: {
        accessToken: localStorage.getItem("accessToken")
      }
    }

    axios.get("https://localhost:33123/auth", head).then((res)=>{
        setUserList(res.data);
    });

    axios.get("https://localhost:33123/auth/approve", head).then((res)=>{
      setNotApprovedList(res.data);
    });
  
  }, [approvedList]);

  const handleApprove =()=>{

    if (approvedList.length!==0) {

      const head={ headers:{
              accessToken: localStorage.getItem("accessToken")
          }
      }
      
      // Send the approve in the backend
      axios.put("https://localhost:33123/auth/approve", approvedList, head).then((res)=>{

        if (res.data.error){
          setErrorMessage(res.data.error)
          handleClickAlertError();
        }
        else{
          handleClickAlert();
        }
      });

      // Make the changes here as well
      setApprovedList([]);
      setUserList([]);

    }
    setOpen(false);
  }

  // Pagination Information
  const [pageNumber, setPageNumber] = useState(0);
  const usersPerPage = 9;
  const visitedPages = pageNumber * usersPerPage;
  const pageCount = Math.ceil(userList.length / usersPerPage);
  const changePage = ({selected}) => {
    setPageNumber(selected);
  };

  // Displaying the users of this particular page in the pagination
  const displayUsers = userList.slice( visitedPages, visitedPages + usersPerPage ).map((value, key)=>{

    return (
      <div className='item' onClick={()=>{navigate(`/profile/${value.id}`)}}>
        <div className='name'> {value.username} </div>
        <div className='body'><UserCard userinfo={value} /></div>
        <div className='footer gradient-custom'>
          <div > {value.location}, {value.country} </div> 
          { value.approved ?
            <><CheckCircleIcon style={{ color: 'teal' }}/></>
            :
            <><NotInterestedIcon style={{ color: 'teal' }}/></>
          }
        </div>
      </div>
    );
    
  });
    
  // For the alerts
  const [openAlert, setOpenAlert] = React.useState(false);
  const [errorMessage, setErrorMessage ]= React.useState("");
  const handleClickAlert = () => {
    setOpenAlert(true);
  };
  const handleCloseAlertR = (event, reason) => {
    setOpenAlert(false);
    window.location.reload();
  };

  // For the error alerts
  const [openAlertError, setOpenAlertError] = React.useState(false);
  const handleClickAlertError = () => {
    setOpenAlertError(true);
  };
  const handleCloseAlertError = (event, reason) => {
    setOpenAlertError(false);
  };

  // These are for the Modal
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => {
      setOpen(false);
  }

  return (
    <>

      <div className="container"> 
        <Title title="Users" />
      </div>
      <div className="container">
        <Header text="Click on a user for details" />
      </div>

      <div className="container">
        <button className='buttonito' onClick={handleOpen}>Check Applications</button>
        <div className="container">
          
          {/* The users in icons format */}
          {displayUsers}

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

      {/* Displaying in a modal the applications  */}
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >

        <Box sx={style}>
          <div className='headerito'>
            <headerito>Users Awaiting Confirmation</headerito>
          </div>
          <div style={{ height: 369, width: 1100 }}>
            <DataGrid 
              sx={{ m: 2 ,"& .MuiDataGrid-row:hover": { backgroundColor: "skyblue" },}}
              rows={notApprovedList}
              columns={columns}
              pageSize={5}
              rowsPerPageOptions={[5]}
              checkboxSelection
              onSelectionModelChange={(data)=>{ setApprovedList(data); }}
            />
          </div>
          <button className='buttonito' onClick={handleApprove}>Approve Selected</button>
        </Box>

       </Modal>

        {/* Message alert */}
        <Snackbar open={openAlert} autoHideDuration={6000} onClose={handleCloseAlertR}>
          <Alert onClose={handleCloseAlertR} severity="success" sx={{ width: '100%' }}>
            Users approved
          </Alert>
        </Snackbar>

        {/* Error message alert */}
        <Snackbar open={openAlertError} autoHideDuration={6000} onClose={handleCloseAlertError}>
          <Alert onClose={handleCloseAlertError} severity="warning" sx={{ width: '100%' }}>
            {errorMessage}
          </Alert>
        </Snackbar>
      
      </div>
    </>
  );

}

export default Users;