// @flow
import React, { PureComponent } from 'react';
import { VisualizersService } from '@utils';
import Map from 'pigeon-maps';
import Marker from 'pigeon-marker';
import Cluster from 'pigeon-cluster';
import turfBbox from '@turf/bbox';
import {
  featureCollection as turfFeatureCollection,
  point as turfPoint
} from '@turf/helpers';
import geoViewport from '@mapbox/geo-viewport';

const averageGeolocation = (coords, width = 564, height = 300) => {
  const coord = coords.map(location =>
    turfPoint([location.coordinates.lng, location.coordinates.lat])
  );
  const features = turfFeatureCollection(coord);
  const bounds = turfBbox(features);

  const { center, zoom } = geoViewport.viewport(bounds, [width, height]);

  return {
    center: [center[1], center[0]],
    zoom: Math.min(zoom, 13)
  };
};

type Props = {
  classes: {
    progress: number
  },
  selectedResultGraphIri: string,
  selectedPipelineExecution: string,
  handleSetCurrentApplicationData: Function,
  isPublished: boolean,
  height: number,
  width: number
};

type State = {
  markers: Array<{ coordinates: { lat: number, lng: number } }>,
  center: Array<number>,
  zoom: number
};

class MapsVisualizer extends PureComponent<Props, State> {
  constructor() {
    super();
    this.state = {
      markers: [],
      center: [50.0755, 14.4378],
      zoom: 4
    };
  }

  async componentDidMount() {
    const {
      selectedResultGraphIri,
      handleSetCurrentApplicationData,
      isPublished,
      selectedPipelineExecution
    } = this.props;

    if (!isPublished) {
      handleSetCurrentApplicationData({
        endpoint: 'map',
        etlExecutionIri: selectedPipelineExecution,
        graphIri: selectedResultGraphIri,
        visualizerType: 'MAP'
      });
    }

    const self = this;

    const markers = await this.fetchMarkers(selectedResultGraphIri);
    await this.setState({
      markers
    });
    self.updateMarkersState(markers);
  }

  fetchMarkers = async (selectedResultGraphIri: string) => {
    const response = await VisualizersService.getMarkers({
      resultGraphIri: selectedResultGraphIri
    });
    const responseMarkers = response.data;
    // only proceed once second promise is resolved
    return responseMarkers;
  };

  updateMarkersState = async (markers: []) => {
    const {
      handleSetCurrentApplicationData,
      isPublished,
      selectedPipelineExecution,
      selectedResultGraphIri
    } = this.props;
    const { center, zoom } = averageGeolocation(markers);
    this.setState({ center, zoom });

    if (!isPublished) {
      handleSetCurrentApplicationData({
        endpoint: 'map',
        etlExecutionIri: selectedPipelineExecution,
        graphIri: selectedResultGraphIri,
        visualizerType: 'MAP'
      });
    }
  };

  render() {
    const { markers, center, zoom } = this.state;
    const { height, width } = this.props;

    const widthSize = Math.max(245, Math.min(width, height));
    const heightSize = Math.max(165, widthSize - 250);

    return (
      <Map center={center} zoom={zoom} width={widthSize} height={heightSize}>
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

export default MapsVisualizer;
