// @flow
import React, { PureComponent } from 'react';
import VisualizerControllerHeaderComponent from './VisualizerControllerHeaderComponent';
import { withWebId } from '@inrupt/solid-react-components';
import { applicationActions } from '@ducks/applicationDuck';
import { connect } from 'react-redux';
import { StorageToolbox, Log } from '@utils';
import { withRouter } from 'react-router-dom';
import uuid from 'uuid';

type Props = {
  selectedApplication: any,
  selectedApplicationTitle: any,
  handleAppTitleChanged: any,
  webId: string,
  checkedPublished?: boolean,
  onRefreshSwitchChange?: (event: {}, checked: boolean) => void,
  headerParams: { title: string, subtitle?: string },
  history: any
};

type State = {
  publishDialogOpen: boolean
};

class VisualizerControllerHeaderContainer extends PureComponent<Props, State> {
  state = {
    publishDialogOpen: false
  };

  handlePublishClicked = () => {
    const { selectedApplication, selectedApplicationTitle, webId } = this.props;
    const { handleClickPublishDialogOpen } = this;
    selectedApplication.id = uuid.v4();
    StorageToolbox.saveAppToSolid(
      selectedApplication,
      selectedApplicationTitle,
      webId
    ).then((appIri, error) => {
      if (!error) {
        handleClickPublishDialogOpen();
      }
    });
  };

  onHandleAppTitleChanged = e => {
    const value = e.target.value;
    const { handleAppTitleChanged } = this.props;
    handleAppTitleChanged(value);
  };

  handleClickPublishDialogOpen = () => {
    this.setState({ publishDialogOpen: true });
  };

  handleClosePublishDialog = () => {
    this.setState({ publishDialogOpen: false });
  };

  handleProceedToApplicationClicked = () => {
    this.props.history.push('/storage');
  };

  render() {
    const {
      headerParams,
      onRefreshSwitchChange,
      checkedPublished
    } = this.props;
    const {
      handlePublishClicked,
      onHandleAppTitleChanged,
      handleClosePublishDialog,
      handleProceedToApplicationClicked
    } = this;
    const { publishDialogOpen } = this.state;
    return (
      <VisualizerControllerHeaderComponent
        handleAppTitleChanged={onHandleAppTitleChanged}
        handlePublishClicked={handlePublishClicked}
        headerParams={headerParams}
        checkedPublished={checkedPublished}
        onRefreshSwitchChange={onRefreshSwitchChange}
        publishDialogOpen={publishDialogOpen}
        handleClosePublishDialog={handleClosePublishDialog}
        handleProceedToApplicationClicked={handleProceedToApplicationClicked}
      />
    );
  }
}

const mapStateToProps = state => {
  return {
    selectedVisualizer: state.globals.selectedVisualizer,
    headerParams: state.globals.headerParams,
    filters: state.visualizers.filters,
    selectedResultGraphIri: state.globals.selectedResultGraphIri,
    selectedApplication: state.application.selectedApplication,
    selectedApplicationTitle: state.application.selectedApplicationTitle
  };
};

const mapDispatchToProps = dispatch => {
  const handleAppTitleChanged = applicationTitle =>
    dispatch(applicationActions.setApplicationTitle(applicationTitle));

  return {
    handleAppTitleChanged
  };
};

export default withRouter(
  withWebId(
    connect(
      mapStateToProps,
      mapDispatchToProps
    )(VisualizerControllerHeaderContainer)
  )
);
