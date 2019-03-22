// @flow
import * as React from 'react';
import {
  withScriptjs,
  withGoogleMap,
  GoogleMap,
  Marker
} from 'react-google-maps';
import MarkerClusterer from 'react-google-maps/lib/components/addons/MarkerClusterer';
import { compose, withProps, type HOC } from 'recompose';
import uuid from 'uuid';
import { Log, VisualizersService } from '@utils';

type Props = {
  classes: {
    progress: number
  },
  selectedResultGraphIri: string
};

type State = {
  markers: Array<{ coordinates: { lat: number, lon: number } }>,
  zoomToMarkers: any
};

class GoogleMapsVisualizer extends React.PureComponent<Props, State> {
  constructor() {
    super();
    this.state = {
      markers: [],
      zoomToMarkers: null
    };
  }

  async componentDidMount() {
    const response = await VisualizersService.getMarkers({
      resultGraphIri: this.props.selectedResultGraphIri
    });
    const jsonData = await response.data;
    this.setState({
      markers: jsonData,
      zoomToMarkers: map => {
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

  render() {
    const { markers, zoomToMarkers } = this.state;
    return (
      <GoogleMap
        ref={zoomToMarkers}
        defaultZoom={8}
        defaultCenter={{ lat: 50.08804, lng: 14.42076 }}
      >
        <MarkerClusterer averageCenter enableRetinaIcons gridSize={60}>
          {markers &&
            markers.length > 0 &&
            markers.map(marker => (
              <Marker
                key={uuid()}
                position={marker.coordinates}
                onClick={() => Log.info('Clicked marker')}
                defaultAnimation={null}
              />
            ))}
        </MarkerClusterer>
      </GoogleMap>
    );
  }
}

type GoogleMapsVisualizerProps = {
  googleMapURL?: string,
  loadingElement: Object,
  containerElement: Object,
  mapElement: Object
};

const enhance: HOC<*, GoogleMapsVisualizerProps> = compose(
  withProps({
    googleMapURL:
      'https://maps.googleapis.com/maps/api/js?key=AIzaSyA5rWPSxDEp4ktlEK9IeXECQBtNUvoxybQ&libraries=places',
    loadingElement: <div style={{ height: `100%` }} />,
    containerElement: <div style={{ height: `100%` }} />,
    mapElement: <div style={{ height: `100%` }} />
  }),
  withScriptjs,
  withGoogleMap
);

export default enhance(GoogleMapsVisualizer);
