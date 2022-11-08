import axios from 'axios';
import React, {useState} from 'react';
import {Typography} from '@mui/material'
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';

const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
  });
  

function PhotoUpload(props) {

    const itemId = props.itemid;
    const [selectedFile, setSelectedFile] = useState(null);

    // these to make a better looking upload choose file button
    const hiddenFileInput = React.useRef(null);
    const handleClick = event => {
        hiddenFileInput.current.click();
      };
        
    // On file select (from the pop up)
    const onFileChange = (event) => {
    
        // Update the state
        setSelectedFile( event.target.files[0] );
    
    };

    // For the alert
    const [openAlert, setOpenAlert] = React.useState(false);
    const [errorMessage, setErrorMessage ]= React.useState("");

    const handleClickAlert = () => {
        setOpenAlert(true);
    };

    const handleCloseAlert = (event, reason) => {
        // if (reason === 'clickaway') {
        //   return;
        // }
        setOpenAlert(false);
    };

    // for the error alert
    const [openAlertError, setOpenAlertError] = React.useState(false);

    const handleClickAlertError = () => {
        setOpenAlertError(true);
    };

    const handleCloseAlertError = (event, reason) => {
        setOpenAlertError(false);
    };
        
        
    // File content to be displayed after
    // file upload is complete
    const fileData = () => {
    
    if (selectedFile) {
        
        return (
            <div>
                <Typography sx={{fontFamily: 'Futura'}} variant="h6" >File: {selectedFile.name}</Typography>
                <Typography sx={{fontFamily: 'Futura'}} variant="h6" >Type: {selectedFile.type}</Typography>
                <Typography sx={{fontFamily: 'Futura'}} variant="h6">
                    Last Modified:{" "}
                    {selectedFile.lastModifiedDate.toDateString()}
                </Typography>
                <button className="buttonitoReverse" onClick={()=>{setSelectedFile(null)}}>Clear</button>
                <button className='buttonito' onClick={onFileUpload}>
                    Upload Photo
                </button>
            </div>
        );
        }
    };
        
    // On file upload (click the upload button)
    const onFileUpload = () => {
    
        if (selectedFile){

            // Create an object of formData
            const formData = new FormData();
            
            // Update the formData object
            formData.append(
                "image",
                selectedFile,
                selectedFile.name
            );
        
            // Details of the uploaded file
            console.log(selectedFile);

            const head={ headers:{
                accessToken: localStorage.getItem("accessToken")
                }
            }

            const namingScheme = itemId + "_" + Date.now()+"."+selectedFile.name.split('.').pop();
            
            // Request made to the backend api Send formData object
            axios.post(`https://localhost:33123/photos/${namingScheme}`, formData, head).then((res)=>{
                if (res.data.error){
                    setErrorMessage(res.data.error);
                    handleClickAlertError();;
                }
                else{
                    handleClickAlert();
                }
            });
            setSelectedFile(null);
        }
    };
        
    return (
        <>
            <div style={{color: 'black'}}>
                <div>
                    { selectedFile==null ?
                        <button className='buttonito' onClick={handleClick}>
                            Choose a Photo
                        </button>
                    :
                        <button className='buttonitoInfo' onClick={handleClick}>
                            Choose a Different One
                        </button>
                    }
                    <input ref={hiddenFileInput} style={{display:'none'}} type="file" onChange={onFileChange} />
                    
                </div>
            {fileData()}
            </div>

            {/* message alert */}
            <Snackbar open={openAlert} autoHideDuration={6000} onClose={handleCloseAlert}>
            <Alert onClose={handleCloseAlert} severity="success" sx={{ width: '100%' }}>
                Photo successfully uploaded!
            </Alert>
            </Snackbar>

            {/* error message alert */}
            <Snackbar open={openAlertError} autoHideDuration={6000} onClose={handleCloseAlertError}>
            <Alert onClose={handleCloseAlertError} severity="warning" sx={{ width: '100%' }}>
                {errorMessage}
            </Alert>
            </Snackbar>
        </>

    );

}

export default PhotoUpload


