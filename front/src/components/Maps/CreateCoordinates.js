import * as React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import {useState} from 'react';
import {MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import OsmProvider from './OsmProvider';
import 'leaflet/dist/leaflet.css'
import './Mapstyling.css'
import L from 'leaflet';
import useGeoLocation from './useGeoLocation';
import "leaflet-control-geocoder/dist/Control.Geocoder.css";
import "leaflet-control-geocoder/dist/Control.Geocoder.js";
import { useMap, useMapEvents } from 'react-leaflet/hooks';

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

const markerIcon = new L.Icon({
    iconUrl: require("./mapmarker4.png"),
    iconSize: [32, 32],
    iconAnchor: [15, 46],
    popupAnchor: [3, -46],
});

export default function CreateCoordinates(props) {

  const [open, setOpen] = useState(false);

  const handleOpen = () => setOpen(true);

  const handleClose = () => {
    setOneLoad(false);
    setOpen(false);
  }

  const [oneLoad, setOneLoad] = useState(false);
  const [centered, setCentered] = useState({ lat: 47.223647093288015 , lng: 14.762808870928518 });
  const ZOOM_LEVEL = 15;
  const location = useGeoLocation();

  function FlyToPlease () {
      const map = useMap();
      React.useEffect(()=>{
          map.flyTo(centered, ZOOM_LEVEL )
      }, [map]);
      return null;
  }

  function SearchGeocoder() {
    const map = useMap();
    if (!oneLoad){
      setOneLoad(true);
      var geocoder = L.Control.Geocoder.nominatim();
      
      if (typeof URLSearchParams !== "undefined" && location.search) {

        var params = new URLSearchParams(location.search);
        var geocoderString = params.get("geocoder");
        if (geocoderString && L.Control.Geocoder[geocoderString]) {
          geocoder = L.Control.Geocoder[geocoderString]();
        } else if (geocoderString) {
          console.warn("Unsupported geocoder", geocoderString);
        }
      
      }
  
      var myGeocoder = L.Control.geocoder({
        query: "",
        placeholder: "Search here...",
        defaultMarkGeocode: false,
        geocoder
      }).addTo(map);

      myGeocoder.on("markgeocode", function (e) {
        var latlng = e.geocode.center;
        setCentered(latlng);
      
      })
    }
    
    return null;
  }

  const MapEvents = () => {
    useMapEvents({
      click(e) {
        setCentered(e.latlng);
      },
    });
    return false;
  }

  const hehe = () =>{
      setCentered(location.coordinates);
  }

  const confirmCoordinates = () =>{
    props.setCoordinates(centered);
    handleClose();
  }

  return (
    <div>
      <button className='buttonitoInfo' onClick={handleOpen}>Add Coordinates</button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography sx={{fontFamily: 'Futura'}} id="modal-modal-title" variant="h5" component="h2">
            Pick your Precise Location on the Map
          </Typography>
          <br />

            <MapContainer
              center ={centered}
              zoom ={ZOOM_LEVEL}
            >                

              {/* Not adding this to be more clear: attribution ={OsmProvider.leaflet.attribution} */}
              <TileLayer url={OsmProvider.leaflet.url}  />

              <Marker position={ [centered.lat, centered.lng] } icon={markerIcon}>
                  <Popup>
                      <b>{centered.lat}, {centered.lng}</b>
                  </Popup>
              </Marker>

              <FlyToPlease /> 
              <MapEvents />
              <SearchGeocoder />
          </MapContainer>
                
          <br />
          <button className='buttonitoInfo' onClick={()=>{hehe()}}>Locate Me</button>
          <button className='buttonito' onClick={()=>{confirmCoordinates()}}>Confirm the Location</button>
          
        </Box>
      </Modal>
    </div>
  );
}
