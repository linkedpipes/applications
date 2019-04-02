import React, { PureComponent } from 'react';
import { VISUALIZER_TYPE } from '@constants';
import { GoogleMapsVisualizer, TreemapVisualizer } from '@components';
import { withRouter } from 'react-router-dom';
import { Log } from '@utils';
import axios from 'axios';
// eslint-disable-next-line import/order
import Typography from '@material-ui/core/Typography';

const queryString = require('query-string');

class ApplicationContainer extends PureComponent {
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
    window.addEventListener('resize', this.updateWindowDimensions);

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

  getApplication = (applicationType, applicationData, classes) => {
    switch (applicationType) {
      case VISUALIZER_TYPE.MAP:
      case VISUALIZER_TYPE.LABELED_POINTS_MAP: {
        const markers = applicationData.markers;
        return (
          <GoogleMapsVisualizer markers={markers} selectedResultGraphIri={''} />
        );
      }
      case VISUALIZER_TYPE.TREEMAP: {
        const selectedResultGraphIri = applicationData.selectedResultGraphIri;
        return (
          <TreemapVisualizer selectedResultGraphIri={selectedResultGraphIri} />
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

  updateWindowDimensions() {
    this.setState({ width: window.innerWidth, height: window.innerHeight });
  }

  render() {
    const { getApplication } = this;
    const { applicationType, applicationData, width, height } = this.state;
    const { classes } = this.props;

    return (
      <div>
        <div
          style={{
            flex: 1,
            width: `${width}px`,
            height: `${height}px`,
            textAlign: 'center'
          }}
        >
          {getApplication(applicationType, applicationData, classes)}
        </div>
      </div>
    );
  }
}

export default withRouter(ApplicationContainer);
