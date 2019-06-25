// @flow
import React, { PureComponent } from 'react';
import { VisualizersService } from '@utils';
import { VISUALIZER_TYPE } from '@constants';
import Map from 'pigeon-maps';
import Marker from 'pigeon-marker';
import Cluster from 'pigeon-cluster';
import turfBbox from '@turf/bbox';
import {
  featureCollection as turfFeatureCollection,
  point as turfPoint
} from '@turf/helpers';
import geoViewport from '@mapbox/geo-viewport';
import _ from 'lodash';

type Props = {
  classes: {
    progress: number
  },
  selectedResultGraphIri: string,
  selectedPipelineExecution: string,
  handleSetCurrentApplicationData: Function,
  isPublished: boolean,
  visualizerCode: string,
  markers: Array<{ uri: string, coordinates: { lat: number, lng: number } }>,
  schemes: Array<{
    label: string,
    uri: string,
    visible: boolean,
    enabled: boolean,
    selected: boolean
  }>
};

type State = {
  markers: Array<{ uri: string, coordinates: { lat: number, lng: number } }>,
  center: Array<number>,
  zoom: number,
  schemes: Array<{
    label: string,
    uri: string,
    visible: boolean,
    enabled: boolean,
    selected: boolean
  }>
};

const areEqual = (
  a: Array<{
    label: string,
    uri: string,
    visible: boolean,
    enabled: boolean,
    selected: boolean
  }>,
  b: Array<{
    label: string,
    uri: string,
    visible: boolean,
    enabled: boolean,
    selected: boolean
  }>
) => {
  if (!a || !b) return false;
  if (a.length !== b.length) return false;
  for (let i = 0; i < a.length; i += 1) {
    let eq = false;
    for (let j = 0; j < b.length; j += 1) {
      if (_.isEqual(a[i], b[j])) {
        eq = true;
        break;
      }
    }
    if (!eq) return false;
  }
  return true;
};

class MapsVisualizer extends PureComponent<Props, State> {
  static averageGeolocation(
    coords: Array<{ uri: string, coordinates: { lng: number, lat: number } }>,
    width: number = 564,
    height: number = 300
  ) {
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
  }

  static async fetchMarkers(
    selectedResultGraphIri: string,
    visualizerCode: string,
    schemes: Array<{}>
  ) {
    if (visualizerCode === VISUALIZER_TYPE.ADVANCED_FILTERS_MAP) {
      const response = await VisualizersService.getMarkers(
        selectedResultGraphIri,
        schemes
      );
      const responseMarkers = response.data;
      return responseMarkers;
    }
    const response = await VisualizersService.getMarkers(
      selectedResultGraphIri
    );
    const responseMarkers = response.data;
    // only proceed once second promise is resolved
    return responseMarkers;
  }

  constructor(props: Props) {
    super(props);
    this.state = {
      markers: this.props.markers || [],
      schemes: this.props.schemes || [],
      center: [50.0755, 14.4378],
      zoom: 4
    };
  }

  async componentDidMount() {
    const {
      selectedResultGraphIri,
      handleSetCurrentApplicationData,
      isPublished,
      selectedPipelineExecution,
      visualizerCode
    } = this.props;
    const schemes = this.props.schemes || [];

    if (!isPublished) {
      handleSetCurrentApplicationData({
        endpoint: 'map',
        etlExecutionIri: selectedPipelineExecution,
        graphIri: selectedResultGraphIri,
        visualizerType: visualizerCode
      });
    }

    const selectedSchemes = schemes.filter(scheme => scheme.selected);
    const markers: Array<{
      uri: string,
      coordinates: { lat: number, lng: number }
    }> = await MapsVisualizer.fetchMarkers(
      selectedResultGraphIri,
      visualizerCode,
      selectedSchemes
    );
    this.updateMarkersState(markers);
  }

  async componentDidUpdate(prevProps: Props) {
    // Typical usage (don't forget to compare props):
    if (!areEqual(prevProps.schemes, this.props.schemes)) {
      const schemes = this.props.schemes;
      // If there are no selected nodes, then bring all the data
      // (should never happen)

      // Fetch data
      const selectedSchemes = schemes
        .filter(scheme => scheme.selected)
        .map(scheme => ({
          label: scheme.label,
          uri: scheme.uri,
          dataType: 'string',
          isActive: scheme.selected
        }));
      const markers: Array<{
        uri: string,
        coordinates: { lat: number, lng: number }
      }> = await MapsVisualizer.fetchMarkers(
        this.props.selectedResultGraphIri,
        this.props.visualizerCode,
        { filters: { nodesFilter: selectedSchemes } }
      );
      this.updateMarkersState(markers);
    }
  }

  updateMarkersState = async (
    markers: Array<{
      uri: string,
      coordinates: { lat: number, lng: number }
    }> = []
  ) => {
    const {
      handleSetCurrentApplicationData,
      isPublished,
      selectedPipelineExecution,
      selectedResultGraphIri,
      visualizerCode
    } = this.props;
    const { center, zoom } = MapsVisualizer.averageGeolocation(markers);
    this.setState({ center, zoom, markers });

    if (!isPublished) {
      handleSetCurrentApplicationData({
        endpoint: 'map',
        etlExecutionIri: selectedPipelineExecution,
        graphIri: selectedResultGraphIri,
        visualizerType: visualizerCode
      });
    }
  };

  render() {
    const { markers, center, zoom } = this.state;
    return (
      <Map center={center} zoom={zoom}>
        <Cluster>
          {markers.map(marker => (
            <Marker
              key={marker.uri}
              anchor={[marker.coordinates.lat, marker.coordinates.lng]}
              payload={marker}
            />
          ))}
        </Cluster>
      </Map>
    );
  }
}

export default MapsVisualizer;
