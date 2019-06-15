// @flow
import React, { PureComponent } from 'react';
import uuid from 'uuid';
import { Log, VisualizersService } from '@utils';
import Map from 'pigeon-maps';
import Marker from 'pigeon-marker';
import Cluster from 'pigeon-cluster';

const averageGeolocation = coords => {
  if (!coords || coords.length === 0) {
    return [50.0755, 14.4378];
  }

  if (coords.length === 1) {
    return coords[0];
  }

  let x = 0.0;
  let y = 0.0;
  let z = 0.0;

  coords.forEach(marker => {
    const coord = marker.coordinates;
    const latitude = (coord.lat * Math.PI) / 180;
    const longitude = (coord.lng * Math.PI) / 180;

    x += Math.cos(latitude) * Math.cos(longitude);
    y += Math.cos(latitude) * Math.sin(longitude);
    z += Math.sin(latitude);
  });

  const total = coords.length;

  x /= total;
  y /= total;
  z /= total;

  const centralLongitude = Math.atan2(y, x);
  const centralSquareRoot = Math.sqrt(x * x + y * y);
  const centralLatitude = Math.atan2(z, centralSquareRoot);

  return [
    (centralLatitude * 180) / Math.PI,
    (centralLongitude * 180) / Math.PI
  ];
};

type Props = {
  classes: {
    progress: number
  },
  selectedResultGraphIri: string,
  propMarkers: Array<{ coordinates: { lat: number, lon: number } }>,
  handleSetCurrentApplicationData: Function,
  isPublished: boolean
};

type State = {
  markers: Array<{ coordinates: { lat: number, lon: number } }>,
  zoomToMarkers: any,
  center: Array<number>
};

class GoogleMapsVisualizer extends PureComponent<Props, State> {
  constructor() {
    super();
    this.state = {
      markers: [],
      zoomToMarkers: null,
      center: [50.0755, 14.4378]
    };
  }

  async componentDidMount() {
    const {
      propMarkers,
      selectedResultGraphIri,
      handleSetCurrentApplicationData,
      isPublished
    } = this.props;

    if (!isPublished) {
      handleSetCurrentApplicationData({
        id: uuid.v4(),
        applicationEndpoint: 'map',
        propMarkers,
        selectedResultGraphIri: this.props.selectedResultGraphIri,
        visualizerCode: 'MAP'
      });
    }

    const self = this;

    if (propMarkers.length === 0) {
      const markers = await this.fetchMarkers(selectedResultGraphIri);
      await this.setState({
        markers
      });
      self.updateMarkersState(markers);
    } else {
      await this.setState({
        markers: propMarkers
      });
      await self.updateMarkersState(propMarkers);
    }
  }

  fetchMarkers = async selectedResultGraphIri => {
    const response = await VisualizersService.getMarkers({
      resultGraphIri: selectedResultGraphIri
    });
    const responseMarkers = response.data;
    // only proceed once second promise is resolved
    return responseMarkers;
  };

  updateMarkersState = async markers => {
    const { handleSetCurrentApplicationData, isPublished } = this.props;
    const center = averageGeolocation(markers);
    this.setState({ center });
    // await this.setState({
    //   zoomToMarkers: async map => {
    //     const bounds = new window.google.maps.LatLngBounds();
    //     if (map !== null) {
    //       const childrenArray = map.props.children.props.children;
    //       if (childrenArray.length > 0) {
    //         map.props.children.props.children.forEach(child => {
    //           if (child.type === Marker) {
    //             bounds.extend(
    //               new window.google.maps.LatLng(
    //                 child.props.position.lat,
    //                 child.props.position.lng
    //               )
    //             );
    //           }
    //         });
    //         map.fitBounds(bounds);
    //       }
    //     }
    //   }
    // });

    if (!isPublished) {
      handleSetCurrentApplicationData({
        id: uuid.v4(),
        applicationEndpoint: 'map',
        markers,
        selectedResultGraphIri: this.props.selectedResultGraphIri,
        visualizerCode: 'MAP'
      });
    }
  };

  render() {
    const { markers, center } = this.state;
    return (
      <Map center={center} zoom={12}>
        <Cluster>
          {markers.map(marker => (
            <Marker
              key={`${marker.coordinates.lat},${marker.coordinates.lng}`}
              anchor={[marker.coordinates.lat, marker.coordinates.lng]}
              payload={1}
            />
          ))}
        </Cluster>
      </Map>
    );
  }
}

type GoogleMapsVisualizerProps = {
  googleMapURL?: string,
  loadingElement: Object,
  containerElement: Object,
  mapElement: Object
};

export default GoogleMapsVisualizer;
