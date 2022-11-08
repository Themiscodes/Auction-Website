import { Typography, Box, Modal } from '@mui/material'
import React, {useState} from 'react'
import PhotoUpload from './PhotoUpload'
import {useParams} from 'react-router-dom';

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

function AddPhotos() {

  let {id} = useParams();
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    window.location.reload();
  }

  return (
    <div>
      <button className='buttonitoInfo' onClick={handleOpen}>Add Photos</button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          
          <Typography sx={{fontFamily: 'Futura'}} variant="h2" component="h2">Photo Upload</Typography>
          <br />
          <Typography sx={{fontFamily: 'Futura'}} variant="h7" component="h2">Add Photos to your Auction</Typography>
          <br />
          <Typography sx={{fontFamily: 'Futura', width: '100%'}} variant="h6" component="h2">• Photos help buyers that are interested get a better idea of the condition and dimensions of the item.</Typography>
          <Typography sx={{fontFamily: 'Futura', width: '100%'}} variant="h6" component="h2">• Make sure to provide clear pictures, preferably in natural lighting conditions for better results.</Typography>
          <Typography sx={{fontFamily: 'Futura', width: '100%'}} variant="h6" component="h2">• Proofs of authenticity are also a plus.</Typography>
          <br />
          <PhotoUpload itemid={id} />

        </Box>
      </Modal>
    </div>
  )
}

export default AddPhotos
