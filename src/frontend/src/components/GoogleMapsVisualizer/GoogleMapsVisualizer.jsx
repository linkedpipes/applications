import { withScriptjs, withGoogleMap, GoogleMap, Marker } from "react-google-maps"
import MarkerClusterer from "react-google-maps/lib/components/addons/MarkerClusterer";
import React from 'react';

const MyMapComponent = withScriptjs(withGoogleMap((props) =>
    {
        return <GoogleMap
            defaultZoom={8}
            defaultCenter={{ lat: -34.397, lng: 150.644 }}
        >

            <MarkerClusterer
                averageCenter
                enableRetinaIcons
                gridSize={60}>

                {props.markers.map((marker, index) =>
                    <Marker
                        key={marker.uri}
                        position={marker.coordinates}
                        onClick={() => console.log("clicked")}
                        defaultAnimation={null}>
                    </Marker>
                )}
            </MarkerClusterer>
        </GoogleMap>
    }
));

export default MyMapComponent;