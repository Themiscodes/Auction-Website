import React, {useState} from 'react';
import {  Box } from '@mui/material'
import "./PhotoCarousel.css";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";

const style = {
  position: 'flex',
  bgcolor: 'rgba(0, 0, 0, 0.551)',
  borderRadius: 2,
  boxShadow: 12,
};

function DisplayPhotos(props) {

  const [currImg, setCurrImg] = useState(0);

  const goLeft = () =>{
    if(currImg > 0){
      setCurrImg(currImg - 1);
      if (props.setSelectedImage){
        props.setSelectedImage(currImg-1);
      }
    }
    
  }

  const goRight = () =>{
    if(currImg < props.images.length - 1){
      setCurrImg(currImg + 1);
      if (props.setSelectedImage){
        props.setSelectedImage(currImg+1);
      }
    }
  }

  return (
    
    <>

      { Object.keys(props.images).length > 0 ? 
          <Box sx={style} >
          <div className="carousel">
            
            <div
              className="carouselInner"
              style={{ backgroundImage: `url(${props.images[currImg].url})` }}
            >
              <div
                className="left"
                onClick={
                  goLeft
                }
              > 
              {currImg > 0 &&
                <ArrowBackIosIcon style={{ fontSize: 30, color: 'black',
                }} />
              }
              </div>
              <div className="center">
              </div>
              <div
                className="right"
                onClick={
                  goRight
                }
              >
                {currImg < props.images.length - 1 &&
                <ArrowForwardIosIcon style={{ fontSize: 30, color: 'black',
                 } } />
                }
              </div>
            </div>
            
          </div>
          </Box>
          :

          <img className='lando_image' alt='cover' src={"https://localhost:33123/images/placeholder.png"} />

        }
    </>
  );
}

export default DisplayPhotos;