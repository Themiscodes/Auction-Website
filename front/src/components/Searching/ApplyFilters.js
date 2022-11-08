import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import PriceRange from './PriceRange';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import { TextField,InputAdornment } from '@mui/material';
import {CountryDropdown} from 'react-country-region-selector';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid lightBlue',
  boxShadow: 24,
  borderRadius: 4,
  p: 4,
};

export default function ApplyFilters(props) {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => {
    setCountry([]);
    setLocation("");
    setInterPriceRange([0, props.max]);
    setOpen(true);
  }
  const handleClose = () => setOpen(false);


  const [mycountry, setCountry] = React.useState([]);

  const [location, setLocation] = React.useState("");

  const handleChange  = (country) =>{
      setCountry(country);
  };


  const handleChangeLocation  = (e) =>{
    setLocation(e.target.value);
  };


  const [interPriceRange, setInterPriceRange] = React.useState([0, props.max]);

  const applyFilters = () =>{
    var filters = []
    filters.push(location);
    filters.push(mycountry);
    filters.push(interPriceRange);
    if (location!==""){
      props.setLocation(location);
    }
    if (mycountry!==""){
      props.setCountry(mycountry);
    }
    props.setPriceRange(interPriceRange);
    props.setSelectedFilters(filters);
    setOpen(false);
  }

  return (
    <div>
      <Box sx={{ minWidth: 120 }}>
       <Button variant="text"  sx={{
          mx: 'auto',
          height: 45,
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
          onClick={handleOpen}>Filters</Button>
    </Box>



    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={style}>
        <Typography id="modal-modal-title" variant="h5" component="h2">
        Select One or Multiple Filters
        </Typography>
        <Typography variant="h6" id="modal-modal-description" sx={{ mt: 2 }}>
          Price Range <PriceRange max={props.max} setPriceRange={setInterPriceRange} />
        </Typography>  
        <Typography variant="h6" id="modal-modal-description" sx={{ mt: 1 }}>
          Country
        </Typography>
        <CountryDropdown 
              className='buttonitoSelect'
              style={{ width: "230px", fontFamily: 'Futura' }}
              value={mycountry}
              onChange={(e) => handleChange(e)}
        />
        <br />
        <Typography variant="h6" id="modal-modal-description" sx={{ mt: 2 }}>
          Location
        </Typography>
        <TextField
          onChange={(e) => handleChangeLocation(e)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <LocationOnIcon sx={{color: 'rgb(58, 192, 105)' }}/>
              </InputAdornment>
            ),
          }}
        />
        <br />
        <br />
        <button className='buttonitoInfo' onClick={()=>{applyFilters()}}>Apply Filters</button>
      </Box>
    </Modal>
    </div>
  );
}