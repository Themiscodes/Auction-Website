import React, {useState, useEffect} from 'react';
import {Formik, Form, Field, ErrorMessage} from 'formik';
import * as Yup from 'yup';
import {useNavigate} from 'react-router-dom';
import axios from 'axios';
import {CountryDropdown} from 'react-country-region-selector';
import Categories from '../components/Modals/Categories';
import CreateCoordinates from '../components/Maps/CreateCoordinates';
import Detail from '../components/Typography/Detail';
import Header from '../components/Typography/Header';
import ConvertDMS from '../components/Maps/ConvertDMS';
import Title from '../components/Typography/Title';

// Mui Components
import {Typography} from '@mui/material';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

function CreateItem() {

    let navigate = useNavigate();
    const [mycountry, setCountry] = useState("");
    const [coordinates, setCoordinates] = useState({});
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState({});
    const [holdData, setHoldData] = useState({});

    useEffect(() => {
        window.scrollTo(0, 0)
    }, [])

    const today = new Date();

    const initialValues = {
        name: "",
        description: "",
        currently: "",
        location: "",
        number_of_bids: 0,
        country: "Greece",
        started: today,
        date: new Date(),
        furthermostCategoryId: 0,
    };

    const handleChange  = (country) =>{
        setCountry(country);
        initialValues.country=country;
    };

    const customTextArea = (props) => (
        <textarea type="text" {...props} />
    );

    // validation of the fields
    const validationSchema = Yup.object().shape({
        name: Yup.string().min(3).max(155).required("You must input a name"),
        description: Yup.string().min(23).max(4000).required("You must input a description"),
        currently: Yup.number("You must input a number.").required("You must input an initial price.").test(
            "maxDigitsAfterDecimal",
            "This must have 2 digits after decimal or less",
            (number) => /^\d+(\.\d{1,2})?$/.test(number)),
        buy_price: Yup.number().moreThan(Yup.ref('currently'), "This has to be greater than Starting Price"),
        location: Yup.string().min(3).max(155).required("You must input a location."),
        country: Yup.string().min(3).max(155).required("You must input your country."),
        started: Yup.date().min(today,
            "Starting time can't be in the past."
          ),
        ends: Yup.date().required("You must input an ending time.").min(Yup.ref('started'),
            "Ending time can't be before starting time."
          ),
    });

    const onSubmit = (data) =>{
        setHoldData(data);
        setOpenDialog(true);
        
    };

    useEffect(() => {

        // Then get the categories recursively and return them from parent to children
        axios.get(`https://localhost:33123/categories/${selectedCategory.id}`).then((rescateg)=>{
            setCategories(rescateg.data);
        });

    }, [selectedCategory]);

    // these for the coordinates
    const [openDialog, setOpenDialog] = React.useState(false);

    const handleCloseDialog = () => {

        setOpenDialog(false);
        
        const now = new Date();
        if (Date.parse(holdData.started) > Date.parse(now)){
            holdData.state="EXPECTED"
        }

        // if the user inputed coordinates add them too
        if (Object.keys(coordinates).length > 0 ){
            var point = { type: 'Point', coordinates: [coordinates.lat, coordinates.lng]};
            console.log(point);
            holdData.latitudeLongitude = point;
        }

        if (holdData.buy_price.length===0) {
            holdData.buy_price=null;
        }
        
        holdData.first_bid = holdData.currently;
        holdData.country = mycountry;
        holdData.furthermostCategoryId = selectedCategory.id;
        const head={ headers:{
                accessToken: localStorage.getItem("accessToken")
            }
        }
        axios.post("https://localhost:33123/items", holdData, head).then((res)=>{

            if (res.data.error){
                alert("You are not signed in!");
            }
            else{
                navigate(`/`);
            }
        });  
    };

    return (
        <div style={{minHeight: '100vh', width: '100%',
                     backgroundImage: `url("https://localhost:33123/images/background.png")`,
                     backgroundRepeat: 'repeat',
                    }}>

            <div className='createItemPage'>
                

                <Formik 
                initialValues={initialValues} 
                onSubmit={onSubmit} 
                onChange={handleChange}
                validationSchema={validationSchema} 
                >

                    <Form className='formContainer gradient-custom'  >

                        <Title title="Create an Auction" />
                        <label>Title: </label>
                        <ErrorMessage name="name" component="span" />
                        <Field 
                        id="inputCreateItem" 
                        name="name" 
                        placeholder="Item" 
                        />
                        <label>Starting Price: </label>
                        <ErrorMessage name="currently" component="span" />
                        <Field 
                        id="inputCreateItem" 
                        name="currently" 
                        placeholder="$$$" 
                        />
                        <label>Buying Price: </label>
                        <ErrorMessage name="buy_price" component="span" />
                        <Field 
                        id="inputCreateItem" 
                        name="buy_price" 
                        placeholder="$$$" 
                        />
                        <label>Location: </label>
                        <ErrorMessage name="location" component="span" />
                        <Field 
                        id="inputCreateItem" 
                        name="location" 
                        placeholder="City" 
                        />
                        <label>Country: </label>
                        <ErrorMessage name="country" component="span" />
                        <CountryDropdown 
                        id="inputCreateItem" 
                        name="country"
                        value={mycountry}
                        onChange={(e) => handleChange(e)}
                        />
                        <label>Starting Time: </label>
                        <ErrorMessage name="started" component="span" />
                        <Field
                        id="inputCreateItem" 
                        name="started"
                        type="datetime-local"
                        />
                        <label>Ending Time: </label>
                        <ErrorMessage name="ends" component="span" />
                        <Field
                        id="inputCreateItem" 
                        name="ends"
                        type="datetime-local"
                        />
                        <label>Description: </label>
                        <ErrorMessage name="description" component="span" />
                        <Field 
                        id="inputDescription" 
                        name="description" 
                        as={customTextArea}
                        type="textarea"
                        placeholder="Write a short description here" 
                        />
                        <label>Category: </label>
                        <Detail text={
                            categories.map((value, key)=>{
                            return (
                                <div key={key}>{value}{key === categories.length - 1 ? "" : ","}&nbsp;</div>
                            );
                            }
                            )}
                            />
                        <Header text={<div style={{color: 'rgb(76, 76, 76)'}}> 
                        <Categories setSelectedCategory={setSelectedCategory} />
                        </div>} />
                        <button type="submit" className='buttonito' >
                            Add Item
                        </button>
                    </Form>
                </Formik>

                <Dialog
                    open={openDialog}
                    onClose={handleCloseDialog}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    <DialogTitle id="alert-dialog-title" style={{
                        fontFamily: 'Futura',
                        
                    }}>
                    {"Optionally, you can also provide the precise location"}
                    </DialogTitle>
                    <DialogContent>
                        <DialogContentText id="alert-dialog-description">
                            <CreateCoordinates setCoordinates={setCoordinates} />
                            { (Object.keys(coordinates).length > 0 ) &&
                                <Typography variant="h6" id="modal-modal-description" sx={{ mt: 2 }}>
                                Set to:&nbsp;&nbsp;{ConvertDMS(coordinates.lat, coordinates.lng)}
                            </Typography> 
                            }
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                    
                        <button className="buttonito"  onClick={handleCloseDialog} autoFocus>Continue</button>
            
                    </DialogActions>
                </Dialog>

                {( Object.keys(coordinates).length > 0 ) &&
                    <div style={{color: '#00C9FF'}} >Coordinates set to: {coordinates.lat}, {coordinates.lng}</div>
                }
        
            </div>

        </div>

    )
}

export default CreateItem;
