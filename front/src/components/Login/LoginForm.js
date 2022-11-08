import React, { useContext } from 'react';
import {Formik, Form, Field, ErrorMessage} from 'formik';
import * as Yup from 'yup';
import {useNavigate} from 'react-router-dom';
import axios from 'axios';
import {AuthContext} from '../AuthContext';

// For the material modal
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';

// Modals styling
const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 600,
    bgcolor: 'background.paper',
    borderRadius: 6,
    boxShadow: 24,
    p: 4,
  };

const style2 = {
position: 'absolute',
top: '50%',
left: '50%',
transform: 'translate(-50%, -50%)',
width: 290,
bgcolor: 'background.paper',
borderRadius: 6,
boxShadow: 24,
p: 4,
};

function LoginForm() {

    let navigate = useNavigate();

    const initialValues = {
        username: "",
        password: "",
    };

    const {setAuthState} = useContext(AuthContext);

    // validation of the fields
    const validationSchema = Yup.object().shape({
        username: Yup.string().min(3).max(20).required("You must input a username"),
        password: Yup.string().min(4).max(20).required("You must input a password"),
    });

    // These here are for the Modal that displays awaiting approval
    const [open, setOpen] = React.useState(false);

    const handleClose = () => {
        setOpen(false);
    }

     // These here are for the Modal that displays awaiting approval
     const [openAlert, setOpenAlert] = React.useState(false);
     const handleOpenAlert = () => setOpenAlert(true);
     const handleCloseAlert = () => {
        setOpenAlert(false);
     }
     const [errorMessage, setErrorMessage] = React.useState("");

    const onSubmit = (data) =>{

        axios.post("https://localhost:33123/auth/login", data).then((res)=>{
            if (res.data.error){
                if (res.data.error==='approval'){
                    setOpen(true);
                }
                else{
                    setErrorMessage(res.data.error);
                    handleOpenAlert();
                }
            }
            else{
                localStorage.setItem("accessToken", res.data.token);
                setAuthState({
                    username: res.data.username, 
                    id: res.data.id, 
                    status:true
                });
                if (res.data.username==="admin"){
                    navigate('/users');
                }
                else{
                    navigate("/");
                }
            }
        });
        
    };

    return (
    
        <div className='createItemPage' >   
            <Formik 
            initialValues={initialValues} 
            onSubmit={onSubmit}
            validationSchema={validationSchema} 
            style={{
                height: '100vh',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                }}
            >
                <Form className='formContainer gradient-custom' >
                    <label>Username: </label>
                    <ErrorMessage name="username" component="span" />
                    <Field 
                    id="inputCreateItem" 
                    name="username" 
                    placeholder="Username" 
                    />
                    <label>Password: </label>
                    <ErrorMessage name="password" component="span" />
                    <Field 
                    id="inputCreateItem" 
                    name="password" 
                    type="password"
                    placeholder="*****" 
                    />
                
                    <button type="submit" >
                        Login
                    </button>
                </Form>
            </Formik>

        {/* Modal for the application approval  */}
        <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Box sx={style}>
            <Typography id="modal-modal-title" variant="h5" component="h2">
                Your Application is Pending Approval
            </Typography>
            <img alt="Approval" className='approval_photo' src='https://codenex.in/wp-content/uploads/2019/01/appdevelopment.png' />
            <Typography variant="h6" id="modal-modal-description" sx={{ mt: 2 }}>
                You will be able to sign in and use our services, as soon as your profile has been seen and approved by the administrator!
            </Typography>
            </Box>
        </Modal>

        {/* Modal for error message */}
        <Modal
            open={openAlert}
            onClose={handleCloseAlert}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Box sx={style2}>
                <div className='container'>
            <Typography id="modal-modal-title" variant="h5" component="h2">
                {errorMessage}
            </Typography>
            <button className='buttonito' onClick={handleCloseAlert}>Close</button>
            </div>
            </Box>
        </Modal>
            
        </div>
  )
}

export default LoginForm;
