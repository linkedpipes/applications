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
  applicationData: Object
};

class ApplicationContainer extends PureComponent<Props, State> {
  state = {
    applicationType: 'UNDEFINED',
    applicationData: {}
  };

  componentDidMount() {
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

  render() {
    const { getApplication } = this;
    const { applicationType, applicationData } = this.state;

    return (
      <div
        id="viz-div"
        style={{
          flex: 1,
          height: '100vh',
          textAlign: 'center'
        }}
      >
        {getApplication(applicationType, applicationData)}
      </div>
    );
  }
}

export default withRouter(ApplicationContainer);
