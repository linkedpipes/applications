// @flow
import React, { PureComponent } from 'react';
import { VISUALIZER_TYPE } from '@constants';
import {
  GoogleMapsVisualizer,
  TreemapVisualizer,
  ChordVisualizer
} from '@components';
import { withRouter } from 'react-router-dom';
import { Log } from '@utils';
import axios from 'axios';
// eslint-disable-next-line import/order
import Typography from '@material-ui/core/Typography';

const queryString = require('query-string');

type Props = {
  location: Object
};

type State = {
  applicationType: string,
  applicationData: Object,
  width: number,
  height: number
};

class ApplicationContainer extends PureComponent<Props, State> {
  state = {
    applicationType: 'UNDEFINED',
    applicationData: {},
    width: 0,
    height: 0
  };

  constructor(props) {
    super(props);
    this.updateWindowDimensions = this.updateWindowDimensions.bind(this);
  }

  componentDidMount() {
    this.updateWindowDimensions();
    window.addEventListener('resize', this.updateWindowDimensions.bind(this));

    const self = this;
    const parsed = queryString.parse(this.props.location.search);
    const applicationIri = parsed.applicationIri;
    axios
      .get(applicationIri)
      .then(({ data }) => {
        const applicationData = data.applicationData;
        const applicationType = applicationData.visualizerCode;
        self.setState({ applicationType, applicationData });
      })
      .catch(err => {
        Log.error(err, 'ApplicationContainer');
        return <div>No stored data found!</div>;
      });
  }

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
        const selectedResultGraphIri = applicationData.selectedResultGraphIri;
        return (
          <TreemapVisualizer
            selectedResultGraphIri={selectedResultGraphIri}
            isPublished
          />
        );
      }
      case VISUALIZER_TYPE.CHORD: {
        return (
          <ChordVisualizer
            selectedResultGraphIri={applicationData.selectedResultGraphIri}
            isPublished
          />
        );
      }
      default:
        return (
          <Typography variant="h2" gutterBottom>
            Loading Application..
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
          textAlign: 'center'
        }}
      >
        {getApplication(applicationType, applicationData)}
      </div>
    );
  }
}

export default withRouter(ApplicationContainer);
