import React from 'react';
import {Box, Typography} from '@mui/material';

function HeaderNormal(props) {
  return (
    <div>
      <Box
        sx={{
        mx: 'auto',
        p: 1,
        m: 1,
        color: (theme) =>
        theme.palette.mode === 'dark' ? 'grey.300' : 'grey.800',
        textAlign: 'center',
        }}
      >
        <Typography variant="h7"  sx={{fontFamily: 'Futura',}}>{props.text}</Typography>
      </Box>
    </div>
  )
}

export default HeaderNormal
