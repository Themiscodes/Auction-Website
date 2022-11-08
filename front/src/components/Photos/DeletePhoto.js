import { Typography, Box, Modal } from '@mui/material'
import React, {useState} from 'react'
import DisplayPhotos from './DisplayPhotos';
import axios from 'axios';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 600,
  bgcolor: 'background.paper',
  border: '2px solid lightBlue',
  borderRadius: 4,
  boxShadow: 24,
  p: 4,
};


function DeletePhoto(props) {

  const [selectedImage, setSelectedImage] = useState(0);

  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
  }

  const handleConfirm = () =>{

    const head={ 
        headers:{
            accessToken: localStorage.getItem("accessToken"),
            
        }
    }

    console.log(head);

    axios.delete(`https://localhost:33123/photos/${props.images[selectedImage].id}`, head).then((resimag)=>{
        console.log(resimag.data);
    });

    setOpen(false);
    window.location.reload();
  }

  return (
    <div>
      {props.images.length>0 &&
          <button className='buttonitoInfo' onClick={handleOpen}>Remove a Photo</button>
      }
      
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          
          <Typography sx={{fontFamily: 'Futura'}} variant="h2" component="h2">Remove Photo</Typography>
          <br />
          <DisplayPhotos images={props.images} setSelectedImage={setSelectedImage} />
          <br />
          <Typography sx={{fontFamily: 'Futura'}} variant="h7" component="h2">Would you like to delete this photo?</Typography>
          <br />
          <button className="buttonitoReverse" onClick={handleClose}>Cancel</button>
          <button className="buttonito"  onClick={handleConfirm} autoFocus>Confirm</button>
        </Box>
      </Modal>
      
    </div>
  )
}

export default DeletePhoto
