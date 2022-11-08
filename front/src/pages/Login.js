import React, { useEffect } from 'react';
import { Grid, Typography } from '@mui/material';
import Registration from '../components/Login/Registration';
import LoginForm from '../components/Login/LoginForm';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import AssignmentIndIcon from '@mui/icons-material/AssignmentInd';
import {motion} from 'framer-motion'

function Login() {

    useEffect(() => {
        window.scrollTo(0, 0)
      }, [])

    return (
        
        <motion.div className='loginME'  
            initial={{width: 0}}
            animate={{width: '80vw'}}
            exit={{ width: '80vw', transition: {duration: 0.1 }}}
        > 

            <Grid container  direction={"row"} spacing={1.35}>
                <Grid item>
                    <Typography sx={{ fontSize: 20, fontFamily: 'Futura', textAlign: 'center', color: '#00C9FF' }} gutterBottom>Already have an Account?</Typography>
                    <LoginForm />
                    <br />
                    <br />
                    <div style={{ marginLeft: 220 }}>
                    <ShoppingBagIcon sx={{ fontSize: 100 , color: '#00C9FF' }}  /> 
                    </div>
                    <Typography sx={{fontFamily: 'Futura', width: '100%'}} variant="h7" component="h2">Reasons to sign up with us</Typography>
                    <Typography sx={{fontFamily: 'Futura', width: '100%'}} variant="h6" component="h2">• A wide variety of products to choose from </Typography>
                    <Typography sx={{fontFamily: 'Futura', width: '100%'}} variant="h6" component="h2">• You are in control of the price of your listings </Typography>
                    <Typography sx={{fontFamily: 'Futura', width: '100%'}} variant="h6" component="h2">• We don't share your data, your privacy is important </Typography>
                    <br />
                    <br />
                    <div style={{ marginLeft: 220 }}>
                    <AssignmentIndIcon sx={{ fontSize: 100, color: '#00C9FF' }} /> 
                    </div>
                    <Typography sx={{fontFamily: 'Futura', width: '100%'}} variant="h7" component="h2">When you fill the application form</Typography>
                    <Typography sx={{fontFamily: 'Futura', width: '100%'}} variant="h6" component="h2">• Make sure that the information is accurate</Typography>
                    <Typography sx={{fontFamily: 'Futura', width: '100%'}} variant="h6" component="h2">• Choose a username that represents you</Typography>
                    <Typography sx={{fontFamily: 'Futura', width: '100%'}} variant="h6" component="h2">• Don't use personal information for the password</Typography>
                    <br />       
                   
                </Grid>
                <Grid item>
                    <Typography sx={{ fontSize: 20, fontFamily: 'Futura', textAlign: 'center', color: '#00C9FF' }} gutterBottom>Register for an Account!</Typography>
                    <Registration />
                </Grid>
            </Grid>
        
        </motion.div>
  )
}

export default Login;
