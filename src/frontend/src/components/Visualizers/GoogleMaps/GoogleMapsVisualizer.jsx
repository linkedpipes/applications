import {
  withScriptjs,
  withGoogleMap,
  GoogleMap,
  Marker
} from "react-google-maps";
import MarkerClusterer from "react-google-maps/lib/components/addons/MarkerClusterer";
import React from "react";

const GoogleMapsVisualizer = withScriptjs(
  withGoogleMap(props => {
    return (
      <GoogleMap
        defaultZoom={8}
        defaultCenter={{ lat: 50.08804, lng: 14.42076 }}
      >
        <MarkerClusterer averageCenter enableRetinaIcons gridSize={60}>
          {props.markers &&
            props.markers.map((marker, index) => (
              <Marker
                key={marker.uri}
                position={marker.coordinates}
                onClick={() => console.log("clicked")}
                defaultAnimation={null}
              />
            ))}
        </MarkerClusterer>
      </GoogleMap>
    );
  })
);

export default GoogleMapsVisualizer;
