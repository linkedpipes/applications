// @flow
import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { applicationActions } from '@ducks/applicationDuck';
import CreateVisualizerComponent from './CreateVisualizerComponent';

type Props = {
  selectedVisualizer: any,
  headerParams: any,
  filters: any,
  selectedResultGraphIri: any,
  selectedApplication: any,
  handleSetCurrentApplicationData: any
};

type State = {
  appTitle: string
};

class CreateVisualizerContainer extends PureComponent<Props, State> {
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
      />
    );
  }
}

const mapStateToProps = state => {
  return {
    selectedVisualizer: state.globals.selectedVisualizer,
    headerParams: state.globals.headerParams,
    filters: state.visualizers.filters,
    selectedResultGraphIri: state.etl.selectedResultGraphIri
  };
};

const mapDispatchToProps = dispatch => {
  const handleSetCurrentApplicationData = applicationData =>
    dispatch(applicationActions.setApplication(applicationData));

  return {
    handleSetCurrentApplicationData
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CreateVisualizerContainer);
