import * as React from 'react';
import Box from '@mui/material/Box';
import Categories from '../Modals/Categories';

// MUI components
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { Button } from '@mui/material';

export default function CategoriesSelect(props) {

  const [selectedCategory, setSelectedCategory] = React.useState({});
  const [open, setOpen] = React.useState(false);
  
  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleConfirm = () => {
    props.setSelectedCategory(selectedCategory);
    setOpen(false);
  }

  return (
    <>
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
          fontFamily: 'Futura',
          }}
          onClick={handleOpen}>Select Categories</Button>
    </Box>

    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title" style={{
            fontFamily: 'Futura',
            
        }}>
        {selectedCategory.name}
      </DialogTitle>
      <DialogContent>

        <Categories setSelectedCategory={setSelectedCategory} />

      </DialogContent>
      <DialogActions>
        <button className="buttonitoReverse" onClick={handleClose}>Cancel</button>
        <button className="buttonito"  onClick={handleConfirm} autoFocus>Confirm</button>
      </DialogActions>
    </Dialog>
    </>
  );
}
