// @flow
import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { applicationActions } from '@ducks/applicationDuck';
import CreateVisualizerComponent from './CreateVisualizerComponent';

type Props = {
  selectedVisualizer: Object,
  headerParams: Object,
  filters: Object,
  selectedResultGraphIri: string,
  selectedApplication: Object,
  handleSetCurrentApplicationData: Function,
  handleResetCurrentApplicationData: Function,
  handleResetCurrentApplicationTitle: Function,
  history: Object
};

type State = {
  loadingIsActive: boolean
};

class CreateVisualizerContainer extends PureComponent<Props, State> {
  state = {
    loadingIsActive: false
  };

  constructor(props) {
    super(props);
    (this: any).setApplicationLoaderStatus = this.setApplicationLoaderStatus.bind(
      this
    );
  }

  componentDidMount() {
    const { selectedVisualizer, selectedResultGraphIri, history } = this.props;

    if (
      selectedVisualizer.visualizer.visualizerCode === 'UNDEFINED' &&
      !selectedResultGraphIri
    ) {
      history.push({
        pathname: '/dashboard'
      });
    }
  }

  componentWillUnmount() {
    this.props.handleResetCurrentApplicationData();
    this.props.handleResetCurrentApplicationTitle();
  }

  setApplicationLoaderStatus(isLoading) {
    this.setState({ loadingIsActive: isLoading });
  }

  render() {
    const {
      selectedVisualizer,
      headerParams,
      filters,
      selectedResultGraphIri,
      selectedApplication,
      handleSetCurrentApplicationData
    } = this.props;

    return (
      <CreateVisualizerComponent
        selectedVisualizer={selectedVisualizer}
        headerParams={headerParams}
        filters={filters}
        selectedResultGraphIri={selectedResultGraphIri}
        selectedApplication={selectedApplication}
        handleSetCurrentApplicationData={handleSetCurrentApplicationData}
        setApplicationLoaderStatus={this.setApplicationLoaderStatus}
        loadingIsActive={this.state.loadingIsActive}
      />
    );
  }
}

const mapStateToProps = state => {
  return {
    selectedVisualizer: state.globals.selectedVisualizer,
    headerParams: state.globals.headerParams,
    filters: state.visualizers.filters,
    selectedResultGraphIri: state.etl.selectedResultGraphIri,
    selectedApplication: state.application.selectedApplication
  };
};

const mapDispatchToProps = dispatch => {
  const handleSetCurrentApplicationData = applicationData =>
    dispatch(applicationActions.setApplication(applicationData));

  const handleResetCurrentApplicationData = () =>
    dispatch(applicationActions.resetApplication());

  const handleResetCurrentApplicationTitle = () =>
    dispatch(applicationActions.resetApplicationTitle());

  return {
    handleSetCurrentApplicationData,
    handleResetCurrentApplicationData,
    handleResetCurrentApplicationTitle
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CreateVisualizerContainer);
