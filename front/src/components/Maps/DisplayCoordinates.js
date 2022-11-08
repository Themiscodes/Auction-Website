import * as React from 'react';
import {MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import OsmProvider from './OsmProvider';
import 'leaflet/dist/leaflet.css'
import './Mapstyling.css'
import L from 'leaflet';
import "leaflet-control-geocoder/dist/Control.Geocoder.css";
import "leaflet-control-geocoder/dist/Control.Geocoder.js";
import { useMap } from 'react-leaflet/hooks';

const markerIcon = new L.Icon({
    iconUrl: require("./mapmarker4.png"),
    iconSize: [32, 32],
    iconAnchor: [15, 46],
    popupAnchor: [3, -46],
});

export default function DisplayCoordinates(props) {

    const centered = { lat: props.lat , lng: props.lng };
    const ZOOM_LEVEL = 15;

    function FlyToPlease () {
        const map = useMap();
        React.useEffect(()=>{
            map.flyTo(centered, ZOOM_LEVEL )
        }, [map]);
        return null;
    }

    return (
        <div>
          <br />

            <MapContainer
                center ={centered}
                zoom ={ZOOM_LEVEL}
                
            >                
                {/* Not adding this for a more clear map: attribution ={OsmProvider.leaflet.attribution} */}
                <TileLayer url={OsmProvider.leaflet.url}  />
                <Marker position={ [centered.lat, centered.lng] } icon={markerIcon}>
                    <Popup>
                        <b>{centered.lat}, {centered.lng}</b>
                    </Popup>
                </Marker>
                <FlyToPlease /> 
                
            </MapContainer>
            <br />
    </div> 
  );
}
