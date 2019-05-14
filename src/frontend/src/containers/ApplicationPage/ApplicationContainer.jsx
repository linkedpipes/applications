// @flow
import React, { PureComponent } from 'react';
import { VISUALIZER_TYPE } from '@constants';
import {
  GoogleMapsVisualizer,
  TreemapVisualizer,
  ChordVisualizer
} from '@components';
import { withRouter } from 'react-router-dom';
import { Log, VisualizersService } from '@utils';
import { globalActions } from '@ducks/globalDuck';
import { connect } from 'react-redux';
import axios from 'axios';
// eslint-disable-next-line import/order
import Typography from '@material-ui/core/Typography';

type Props = {
  location: Object,
  setColorTheme: Function
};

type State = {
  applicationType: string,
  applicationData: Object,
  width: number,
  height: number
};

class ApplicationContainer extends PureComponent<Props, State> {
  state = {
    applicationType: 'Loading',
    applicationData: {},
    width: 0,
    height: 0
  };

  constructor(props) {
    super(props);
    this.updateWindowDimensions = this.updateWindowDimensions.bind(this);
  }

  componentDidMount = async () => {
    this.updateWindowDimensions();
    window.addEventListener('resize', this.updateWindowDimensions.bind(this));

    this.props.setColorTheme(true);

    const self = this;

    const queryString = await import(
      /* webpackChunkName: "query-string" */ 'query-string'
    );

    const parsed = queryString.parse(this.props.location.search);
    const applicationIri = parsed.applicationIri;
    const applicationResponse = await axios.get(applicationIri).catch(err => {
      Log.error(err, 'ApplicationContainer');
      self.setState({
        applicationType: VISUALIZER_TYPE.UNDEFINED,
        applicationData: undefined
      });
    });

    const applicationData = applicationResponse.data.applicationData;
    let applicationType = applicationData.visualizerCode;

    if (applicationType !== VISUALIZER_TYPE.MAP) {
      await VisualizersService.getGraphExists(
        applicationData.selectedResultGraphIri
      ).catch(() => {
        applicationType = VISUALIZER_TYPE.UNDEFINED;
      });
    }

    self.setState({ applicationType, applicationData });
  };

  componentWillUnmount() {
    window.removeEventListener('resize', this.updateWindowDimensions);
  }

  updateWindowDimensions = () => {
    this.setState({ width: window.innerWidth, height: window.innerHeight });
  };

  getApplication = (applicationType, applicationData) => {
    switch (applicationType) {
      case VISUALIZER_TYPE.MAP:
      case VISUALIZER_TYPE.LABELED_POINTS_MAP: {
        const markers = applicationData.markers;
        return (
          <GoogleMapsVisualizer
            propMarkers={markers}
            selectedResultGraphIri={''}
            isPublished
          />
        );
      }
      case VISUALIZER_TYPE.TREEMAP: {
        const { selectedResultGraphIri, conceptIri } = applicationData;
        return (
          <TreemapVisualizer
            selectedResultGraphIri={selectedResultGraphIri}
            isPublished
            selectedScheme={conceptIri}
          />
        );
      }
      case VISUALIZER_TYPE.CHORD: {
        return (
          <ChordVisualizer
            selectedResultGraphIri={applicationData.selectedResultGraphIri}
            size={this.state.height + this.state.width}
            selectedNodes={new Set(applicationData.selectedNodes)}
            isPublished
          />
        );
      }
      case VISUALIZER_TYPE.UNDEFINED: {
        return (
          <Typography variant="h2" gutterBottom>
            Application was deleted...
          </Typography>
        );
      }
      default:
        return (
          <Typography variant="h2" gutterBottom>
            Loading Application...
          </Typography>
        );
    }
  };

  updateWindowDimensions = () => {
    this.setState({ width: window.innerWidth, height: window.innerHeight });
  };

  render() {
    const { getApplication } = this;
    const { applicationType, applicationData, width, height } = this.state;

    return (
      <div
        id="viz-div"
        style={{
          flex: 1,
          width: `${width}px`,
          height: `${height}px`,
          textAlign: 'center',
          overflow: 'hidden'
        }}
      >
        {getApplication(applicationType, applicationData)}
      </div>
    );
  }
}

const mapDispatchToProps = dispatch => {
  const setColorTheme = isLight =>
    dispatch(globalActions.setLightColorTheme(isLight));

  return {
    setColorTheme
  };
};

export default withRouter(
  connect(
    null,
    mapDispatchToProps
  )(ApplicationContainer)
);
