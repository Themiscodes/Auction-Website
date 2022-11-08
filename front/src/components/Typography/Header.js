import React from 'react';
import {Box, Typography} from '@mui/material';

function Header(props) {
  return (
    <div>
       <Box
          sx={{
          mx: 'auto',
          p: 1,
          m: 1,
          bgcolor: (theme) =>
          theme.palette.mode === 'dark' ? '#101010' : 'grey.50',
          color: (theme) =>
          theme.palette.mode === 'dark' ? 'grey.300' : 'grey.800',
          border: '1px solid',
          borderColor: (theme) =>
          theme.palette.mode === 'dark' ? 'grey.800' : 'grey.300',
          borderRadius: 2,
          textAlign: 'center',
          }}
        >

          <Typography variant="h7"  sx={{fontFamily: 'Futura',}}>{props.text}</Typography>
        </Box>
    </div>
  )
}

export default Header
