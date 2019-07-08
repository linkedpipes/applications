// @flow
import React, { PureComponent } from 'react';
import equal from 'fast-deep-equal';
import Map from 'pigeon-maps';
import Marker from 'pigeon-marker';
import Cluster from 'pigeon-cluster';
import turfBbox from '@turf/bbox';
import {
  featureCollection as turfFeatureCollection,
  point as turfPoint
} from '@turf/helpers';
import geoViewport from '@mapbox/geo-viewport';
import { VisualizersService } from '@utils';
import { VISUALIZER_TYPE } from '@constants';

type Props = {
  classes: {
    progress: number
  },
  selectedResultGraphIri: string,
  selectedPipelineExecution: string,
  handleSetCurrentApplicationData: Function,
  width: number,
  height: number,
  isPublished: boolean,
  visualizerCode: string,
  filters: Array<{
    filterUri: string,
    options: Array<{ uri: string, selected: boolean }>
  }>
};

type State = {
  center: Array<number>,
  zoom: number,
  markers: Array<{ uri: string, coordinates: { lat: number, lng: number } }>
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

  static formatFiltersForRequest(
    filters: Array<{
      filterUri: string,
      options: Array<{ uri: string, selected: boolean }>
    }>
  ) {
    const filterRequestData = {};
    filters.forEach(element => {
      filterRequestData[element.filterUri] = [
        ...(filterRequestData[element.filterUri] || []),
        ...element.options.map(op => ({
          uri: op.uri,
          isActive: op.selected
        }))
      ];
    });
    return { filters: filterRequestData };
  }

  static async fetchMarkers(
    selectedResultGraphIri: string,
    visualizerCode: string,
    filters: Array<{}>
  ) {
    if (visualizerCode === VISUALIZER_TYPE.ADVANCED_FILTERS_MAP) {
      const response = await VisualizersService.getMarkers(
        selectedResultGraphIri,
        filters
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

  isMounted: boolean = false;

  constructor(props: Props) {
    super(props);
    this.isMounted = false;
    this.state = {
      markers: [],
      center: [50.0755, 14.4378],
      zoom: 4
    };
  }

  async componentDidMount() {
    this.isMounted = true;
    const {
      handleSetCurrentApplicationData,
      isPublished,
      selectedResultGraphIri,
      selectedPipelineExecution
    } = this.props;

    if (!isPublished) {
      handleSetCurrentApplicationData({
        endpoint: 'map',
        graphIri: selectedResultGraphIri,
        etlExecutionIri: selectedPipelineExecution,
        visualizerType: this.props.visualizerCode
      });
    }

    // Fetch data
    const processedFilters = await MapsVisualizer.formatFiltersForRequest(
      this.props.filters
    );
    const markers = await MapsVisualizer.fetchMarkers(
      this.props.selectedResultGraphIri,
      this.props.visualizerCode,
      processedFilters
    );
    const { center, zoom } = MapsVisualizer.averageGeolocation(markers);

    if (this.isMounted) {
      this.setState({ center, zoom, markers });
    }
  }

  async componentDidUpdate(prevProps: Props) {
    if (!equal(this.props.filters, prevProps.filters)) {
      const processedFilters = MapsVisualizer.formatFiltersForRequest(
        this.props.filters
      );
      const markers = await MapsVisualizer.fetchMarkers(
        this.props.selectedResultGraphIri,
        this.props.visualizerCode,
        processedFilters
      );
      const { center, zoom } = MapsVisualizer.averageGeolocation(markers);
      if (this.isMounted) {
        /* eslint-disable react/no-did-update-set-state */
        this.setState({ center, zoom, markers });
      }
    }
  }

  componentWillUnmount() {
    this.isMounted = false;
  }

  render() {
    const { height, width } = this.props;
    const { markers, center, zoom } = this.state;
    const widthSize = Math.max(245, Math.min(width, height));
    const heightSize = Math.max(165, widthSize - 250);

    return (
      <Map center={center} zoom={zoom} width={widthSize} height={heightSize}>
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
