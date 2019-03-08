import {
  withScriptjs,
  withGoogleMap,
  GoogleMap,
  Marker
} from 'react-google-maps';
import MarkerClusterer from 'react-google-maps/lib/components/addons/MarkerClusterer';
import React from 'react';
import { compose, withProps, lifecycle } from 'recompose';
import { Log } from '@utils';
import uuid from 'uuid';

const GoogleMapsVisualizer = compose(
  withProps({
    googleMapURL:
      'https://maps.googleapis.com/maps/api/js?key=AIzaSyA5rWPSxDEp4ktlEK9IeXECQBtNUvoxybQ&libraries=places',
    loadingElement: <div style={{ height: `100%` }} />,
    containerElement: <div style={{ height: `100%` }} />,
    mapElement: <div style={{ height: `100%` }} />
  }),
  lifecycle({
    componentDidMount() {
      this.setState({
        zoomToMarkers: map => {
          Log.info('Zoomed to markers', 'GoogleMapsVisualizer');
          const bounds = new window.google.maps.LatLngBounds();
          if (map !== null) {
            const childrenArray = map.props.children.props.children;
            if (childrenArray.length > 0) {
              map.props.children.props.children.forEach(child => {
                if (child.type === Marker) {
                  bounds.extend(
                    new window.google.maps.LatLng(
                      child.props.position.lat,
                      child.props.position.lng
                    )
                  );
                }
              });
              map.fitBounds(bounds);
            }
          }
        }
      });
    }
  }),
  withScriptjs,
  withGoogleMap
)(props => (
  <GoogleMap
    ref={props.zoomToMarkers}
    defaultZoom={8}
    defaultCenter={{ lat: 50.08804, lng: 14.42076 }}
  >
    <MarkerClusterer averageCenter enableRetinaIcons gridSize={60}>
      {props.markers &&
        props.markers.length > 0 &&
        props.markers.map((marker, index) => (
          <Marker
            key={uuid()}
            position={marker.coordinates}
            onClick={() =>
              Log.info('Clicked on cluster', 'GoogleMapsVisualizer')
            }
            defaultAnimation={null}
          />
        ))}
    </MarkerClusterer>
  </GoogleMap>
));

export default GoogleMapsVisualizer;
