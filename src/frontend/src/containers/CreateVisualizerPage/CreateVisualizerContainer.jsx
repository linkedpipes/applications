// @flow
import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { applicationActions } from '@ducks/applicationDuck';
import { filtersActions } from '@ducks/filtersDuck';
import CreateVisualizerComponent from './CreateVisualizerComponent';
import { Log, GoogleAnalyticsWrapper } from '@utils';
import ApplicationMetadata from '@storage/models/ApplicationMetadata';

type Props = {
  selectedVisualizer: Object,
  headerParams: Object,
  selectedResultGraphIri: string,
  selectedApplication: Object,
  selectedPipelineExecution: string,
  selectedApplicationMetadata: ApplicationMetadata,
  handleSetCurrentApplicationData: Function,
  handleResetCurrentApplicationData: Function,
  handleResetCurrentApplicationMetadata: Function,
  handleSetDefaultFiltersState: Function,
  handleResetFilters: Function,
  history: Object,
  selectedNodes?: Set<string>,
  location: Object,
  filtersState: {}
};

type State = {
  loadingIsActive: boolean,
  width: number,
  height: number
};

class CreateVisualizerContainer extends PureComponent<Props, State> {
  state = {
    loadingIsActive: false,
    width: 0,
    height: 0
  };

  constructor(props) {
    super(props);
    (this: any).setApplicationLoaderStatus = this.setApplicationLoaderStatus.bind(
      this
    );
    this.updateWindowDimensions = this.updateWindowDimensions.bind(this);
  }

  async componentDidMount() {
    const page = this.props.location.pathname;
    GoogleAnalyticsWrapper.trackPage(page);

    this.updateWindowDimensions();
    window.addEventListener('resize', this.updateWindowDimensions.bind(this));
    const { selectedVisualizer, selectedResultGraphIri, history } = this.props;
    if (
      selectedVisualizer.visualizer.visualizerCode === 'UNDEFINED' &&
      !selectedResultGraphIri
    ) {
      history.push({
        pathname: '/dashboard'
      });
    }
    // Set default filters state for given visualizer
    if (!this.props.selectedApplicationMetadata) {
      await this.props.handleSetDefaultFiltersState(
        selectedVisualizer.visualizer.visualizerCode
      );
    }
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.updateWindowDimensions);
    this.props.handleResetCurrentApplicationData();
    this.props.handleResetCurrentApplicationMetadata();
    this.props.handleResetFilters();
  }

  setApplicationLoaderStatus(isLoading) {
    this.setState({ loadingIsActive: isLoading });
  }

  updateWindowDimensions = () => {
    this.setState(
      { width: window.innerWidth, height: window.innerHeight },
      () => Log.info(`H: ${this.state.height} W: ${this.state.width}`)
    );
  };

  render() {
    const {
      selectedVisualizer,
      headerParams,
      selectedResultGraphIri,
      selectedPipelineExecution,
      selectedApplication,
      selectedApplicationMetadata,
      handleSetCurrentApplicationData,
      selectedNodes,
      filtersState
    } = this.props;

    return (
      <CreateVisualizerComponent
        selectedVisualizer={selectedVisualizer}
        headerParams={headerParams}
        selectedResultGraphIri={selectedResultGraphIri}
        selectedPipelineExecution={selectedPipelineExecution}
        selectedApplication={selectedApplication}
        selectedApplicationMetadata={selectedApplicationMetadata}
        handleSetCurrentApplicationData={handleSetCurrentApplicationData}
        setApplicationLoaderStatus={this.setApplicationLoaderStatus}
        loadingIsActive={this.state.loadingIsActive}
        width={this.state.width}
        height={this.state.height}
        selectedNodes={selectedNodes}
        filtersState={filtersState}
      />
    );
  }
}

const mapStateToProps = state => {
  return {
    selectedVisualizer: state.globals.selectedVisualizer,
    headerParams: state.globals.headerParams,
    selectedResultGraphIri: state.etl.selectedResultGraphIri,
    selectedPipelineExecution: state.etl.selectedPipelineExecution,
    selectedApplication: state.application.selectedApplication,
    selectedApplicationMetadata: state.application.selectedApplicationMetadata,
    selectedNodes: state.filters.nodes,
    filtersState: state.filters.filtersState
  };
};

const mapDispatchToProps = dispatch => {
  const handleSetDefaultFiltersState = visualizerCode =>
    dispatch(filtersActions.setDefaultFiltersState(visualizerCode));

  const handleSetCurrentApplicationData = applicationData =>
    dispatch(applicationActions.setApplication(applicationData));

  const handleResetCurrentApplicationData = () =>
    dispatch(applicationActions.resetApplication());

  const handleResetCurrentApplicationMetadata = () =>
    dispatch(applicationActions.resetApplicationMetadata());

  const handleResetFilters = () => dispatch(filtersActions.resetFilters());

  return {
    handleSetCurrentApplicationData,
    handleResetCurrentApplicationData,
    handleResetCurrentApplicationMetadata,
    handleSetDefaultFiltersState,
    handleResetFilters
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CreateVisualizerContainer);
