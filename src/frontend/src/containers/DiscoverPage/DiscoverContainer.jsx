// @flow
import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { DiscoverComponent } from './DiscoverComponent';
import { discoverActions } from './duck';
import { DiscoveryService, Log, GoogleAnalyticsWrapper } from '@utils';
import { discoveryActions } from '@ducks/discoveryDuck';

type Props = {
  activeStep: Number,
  onBackClicked: Function,
  etlExecutionStatus: String,
  location: Object,
  handleSetPipelineGroups: Function,
  handleSetDiscoveryId: Function,
  onNextClicked: Function,
  history: Object,
  onResetClicked: Function,
  onResetSelectedInput: Function,
  sparqlEndpointIri: String,
  dataSampleIri: String,
  namedGraph: String
};
class DiscoverContainer extends PureComponent<Props> {
  componentDidMount = () => {
    const {
      location,
      handleSetPipelineGroups,
      handleSetDiscoveryId,
      onNextClicked,
      history
    } = this.props;

    const page = this.props.location.pathname;
    GoogleAnalyticsWrapper.trackPage(page);

    if (location.state && location.state.discoveryId) {
      Log.info(`Just received ${location.state.discoveryId}`);
      const discoveryId = location.state.discoveryId;

      history.replace({
        pathname: location.pathname,
        state: undefined
      });

      handleSetDiscoveryId(discoveryId);
      DiscoveryService.getPipelineGroups({ discoveryId })
        .then(response => {
          return response.data;
        })
        .then(jsonResponse => {
          handleSetPipelineGroups(jsonResponse.pipelineGroups);
          onNextClicked();
        });
    }
  };

  componentWillUnmount = () => {
    const { onResetClicked, onResetSelectedInput } = this.props;
    onResetClicked();
    onResetSelectedInput();
  };

  render() {
    const {
      activeStep,
      onBackClicked,
      etlExecutionStatus,
      sparqlEndpointIri,
      dataSampleIri,
      namedGraph
    } = this.props;
    return (
      <DiscoverComponent
        activeStep={activeStep}
        onBackClicked={onBackClicked}
        etlExecutionStatus={etlExecutionStatus}
        sparqlEndpointIri={sparqlEndpointIri}
        dataSampleIri={dataSampleIri}
        namedGraph={namedGraph}
      />
    );
  }
}

const mapDispatchToProps = dispatch => {
  // '1' is the number by which you want to increment the count
  const handleSetDiscoveryId = discoveryId =>
    dispatch(
      discoveryActions.addDiscoveryIdAction({
        id: discoveryId
      })
    );
  const onBackClicked = () => dispatch(discoverActions.decrementActiveStep(1));
  const onNextClicked = () => dispatch(discoverActions.incrementActiveStep(1));
  const onResetClicked = () => dispatch(discoverActions.resetActiveStep());
  const onResetSelectedInput = () =>
    dispatch(discoverActions.resetSelectedInputExample());
  const handleSetPipelineGroups = pipelineGroups =>
    dispatch(discoveryActions.setPipelineGroupsAction(pipelineGroups));

  return {
    handleSetDiscoveryId,
    onBackClicked,
    onResetClicked,
    onResetSelectedInput,
    handleSetPipelineGroups,
    onNextClicked
  };
};

const mapStateToProps = state => {
  return {
    activeStep: state.discover.activeStep,
    etlExecutionStatus: state.discover.etlExecutionStatus,
    sparqlEndpointIri: state.discover.sparqlEndpointIri,
    dataSampleIri: state.discover.dataSampleIri,
    namedGraph: state.discover.namedGraph
  };
};

export const DiscoverPage = connect(
  mapStateToProps,
  mapDispatchToProps
)(DiscoverContainer);
