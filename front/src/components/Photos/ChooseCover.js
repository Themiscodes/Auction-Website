import { Typography, Box, Modal } from '@mui/material'
import React, {useState} from 'react'
import {useParams} from 'react-router-dom';
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

function ChooseCover(props) {

  let {id} = useParams();

  const [selectedImage, setSelectedImage] = useState(0);

  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
  }

  const handleConfirm = () =>{

    const body = {
        ItemId: id,
    }

    const head={ 
        headers:{
            accessToken: localStorage.getItem("accessToken"),
            
        }
    }

    axios.put(`https://localhost:33123/photos/setcover/${props.images[selectedImage].id}`, body, head).then((resimag)=>{
    });
    setOpen(false);
  }

  return (
    <div>
      
      {props.images.length>0 &&
          <button className='buttonitoInfo' onClick={handleOpen}>Select Cover</button>
      }

      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          
          <Typography sx={{fontFamily: 'Futura'}} variant="h2" component="h2">Cover Photo</Typography>
          <br />
          <DisplayPhotos images={props.images} setSelectedImage={setSelectedImage} />
          <br />
          <Typography sx={{fontFamily: 'Futura'}} variant="h7" component="h2">Would you like this photo as the cover?</Typography>
          <br />
          <button className="buttonitoReverse" onClick={handleClose}>Cancel</button>
          <button className="buttonito"  onClick={handleConfirm} autoFocus>Confirm</button>
        </Box>
      </Modal>

    </div>
  )
}

export default ChooseCover
