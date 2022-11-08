import React from 'react';
import {Box, Typography} from '@mui/material';

function Body(props) {
  return (
    <div>
      <Box
        sx={{
        boxShadow: `0 2px 4px 0 rgba(0,0,0,.2)`,
        p: 1,
        m: 1,
        bgcolor: (theme) =>
        theme.palette.mode === 'dark' ? '#101010' : 'grey.50',
        color: (theme) =>
        theme.palette.mode === 'dark' ? 'grey.300' : 'grey.800',
        borderRadius: 2,
        textAlign: 'center',
        }}
      >
        <Typography variant="h7"  sx={{fontFamily: 'Futura',}}>{props.text}</Typography>
      </Box>
    </div>
  )
}

export default Body
