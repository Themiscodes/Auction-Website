import React, {useState} from 'react';
import axios from 'axios';
import TextField from '@mui/material/TextField';
import {Grid} from'@mui/material';
import Detail from '../Typography/Detail'
import Title from '../Typography/Title'
import Categories from '../Modals/Categories';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

function CreateCategory() {

  // these to hold the temporary states
  const [name, setName] = React.useState("");
  const [selectedCategory, setSelectedCategory] = useState({});

  const onSubmit = () =>{

      if (name===""){
          setErrorMessage("You need to input a name");
          handleClickAlertError();
      }
      else{
          const body = {     
                  name: name,
                  CategoryId: selectedCategory.id,
          };    

          const head={ headers:{
              accessToken: localStorage.getItem("accessToken")
              }
          }

          axios.post("https://localhost:33123/categories", body, head).then((res)=>{
              if (res.data.error){
                  setErrorMessage(res.data.error)
                  handleClickAlertError();
              }
          });
          handleClickAlert();
      }
  };

  const handleTextFieldChange = (data) => {
    setName(data.target.value);
  }



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

  // for the error alert
  const [openAlertError, setOpenAlertError] = React.useState(false);

  const handleClickAlertError = () => {
    setOpenAlertError(true);
  };

  const handleCloseAlertError = (event, reason) => {
    setOpenAlertError(false);
  };

  return (

    <div style={{ minHeight: '90vh', width: '100%', 
  }}>
      <div className='createItemPage'>

        <div className='formContainer gradient-custom' >

          <Grid container direction={"column"} spacing={2.5}>

            <Grid item>
              <Title title="Add a New Category" />
              <br />
              <Detail text={<div> 
                  <TextField 
                  name = "name"
                  onChange={handleTextFieldChange}
                  fullWidth
                  inputProps={{ style: { color: "black", fontFamily: "Futura" } }} 
                  id="outlined-multiline-static"
                  label="Category Name"
                  // multiline
                  variant="standard"
                  rows={1}
                  />
                </div>} />
            </Grid>

            <Grid item>
              
              <Detail text={<div> 
              <Categories setSelectedCategory={setSelectedCategory} />
              </div>} />
              <br />
              <button type="submit" className='buttonito' onClick={()=>{onSubmit()}}>Add Category</button>
            </Grid>

          </Grid>

        </div>

        {/* message alert */}
        <Snackbar open={openAlert} autoHideDuration={6000} onClose={handleCloseAlertR}>
          <Alert onClose={handleCloseAlertR} severity="success" sx={{ width: '100%' }}>
            Category Succesfully Added!
          </Alert>
        </Snackbar>

        {/* error message alert */}
        <Snackbar open={openAlertError} autoHideDuration={6000} onClose={handleCloseAlertError}>
          <Alert onClose={handleCloseAlertError} severity="warning" sx={{ width: '100%' }}>
            {errorMessage}
          </Alert>
        </Snackbar>
    
      </div>
    </div>
  )

}

export default CreateCategory;
