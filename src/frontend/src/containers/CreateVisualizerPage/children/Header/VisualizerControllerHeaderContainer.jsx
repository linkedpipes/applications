// @flow
import React, { PureComponent } from 'react';
import VisualizerControllerHeaderComponent from './VisualizerControllerHeaderComponent';
import { withWebId } from '@inrupt/solid-react-components';
import { applicationActions } from '@ducks/applicationDuck';
import { connect } from 'react-redux';
import { StorageToolbox } from '@utils';
import { withRouter } from 'react-router-dom';
import { toast } from 'react-toastify';

type Props = {
  selectedApplication: any,
  selectedApplicationTitle: any,
  handleAppTitleChanged: any,
  webId: string,
  onRefreshSwitchChange?: (event: {}, checked: boolean) => void,
  headerParams: { title: string, subtitle?: string },
  history: any,
  selectedVisualizer: Object,
  selectedApplicationTitle: string
};

type State = {
  publishDialogOpen: boolean,
  embedDialogOpen: boolean,
  appIri: string,
  height: number,
  width: number
};

class VisualizerControllerHeaderContainer extends PureComponent<Props, State> {
  state = {
    publishDialogOpen: false,
    embedDialogOpen: false,
    appIri: '',
    height: 400,
    width: 400
  };

  handlePublishClicked = () => {
    const { selectedApplication, selectedApplicationTitle, webId } = this.props;
    const { handleAppPublished } = this;

    if (selectedApplicationTitle === '') {
      toast.error('Please, provide application title!', {
        position: toast.POSITION.TOP_CENTER,
        autoClose: 5000
      });
      return;
    }

    StorageToolbox.saveAppToSolid(
      selectedApplication,
      selectedApplicationTitle,
      webId,
      'public/lpapps'
    ).then(({ applicationIri, applicationEndpoint }, error) => {
      if (!error) {
        const publishedUrl = StorageToolbox.appIriToPublishUrl(
          applicationIri,
          applicationEndpoint
        );
        handleAppPublished(publishedUrl);
      }
    });
  };

  handleEmbedClicked = () => {
    const { selectedApplication, selectedApplicationTitle, webId } = this.props;
    const { handleAppEmbedded } = this;

    if (selectedApplicationTitle === '') {
      toast.error('Please, provide application title!', {
        position: toast.POSITION.TOP_CENTER,
        autoClose: 5000
      });
      return;
    }

    StorageToolbox.saveAppToSolid(
      selectedApplication,
      selectedApplicationTitle,
      webId,
      'public/lpapps'
    ).then(({ applicationIri, applicationEndpoint }, error) => {
      if (!error) {
        const publishedUrl = StorageToolbox.appIriToPublishUrl(
          applicationIri,
          applicationEndpoint
        );
        handleAppEmbedded(publishedUrl);
      }
    });
  };

  onHandleAppTitleChanged = e => {
    const value = e.target.value;
    const { handleAppTitleChanged } = this.props;
    handleAppTitleChanged(value);
  };

  handleAppPublished = appIri => {
    this.setState({ appIri, publishDialogOpen: true });
  };

  handleAppEmbedded = appIri => {
    this.setState({ appIri, embedDialogOpen: true });
  };

  handleClickPublishDialogOpen = () => {
    this.setState({ publishDialogOpen: true });
  };

  handleClosePublishDialog = () => {
    this.setState({ publishDialogOpen: false });
  };

  handleCloseEmbedDialog = () => {
    this.setState({ embedDialogOpen: false });
  };

  handleProceedToApplicationClicked = () => {
    this.props.history.push('/storage');
  };

  handleCopyLinkClicked = () => {
    toast.success('Copied link to clipboard!', {
      position: toast.POSITION.TOP_RIGHT,
      autoClose: 2000
    });
  };

  handleChangeWidth = event => {
    this.setState({ width: event.target.value });
  };

  handleChangeHeight = event => {
    this.setState({ height: event.target.value });
  };

  render() {
    const {
      headerParams,
      onRefreshSwitchChange,
      selectedVisualizer,
      selectedApplicationTitle
    } = this.props;
    const {
      handlePublishClicked,
      handleEmbedClicked,
      onHandleAppTitleChanged,
      handleClosePublishDialog,
      handleCloseEmbedDialog,
      handleProceedToApplicationClicked,
      handleCopyLinkClicked,
      handleChangeHeight,
      handleChangeWidth
    } = this;
    const {
      embedDialogOpen,
      publishDialogOpen,
      appIri,
      height,
      width
    } = this.state;
    return (
      <VisualizerControllerHeaderComponent
        handleAppTitleChanged={onHandleAppTitleChanged}
        handlePublishClicked={handlePublishClicked}
        handleEmbedClicked={handleEmbedClicked}
        headerParams={headerParams}
        onRefreshSwitchChange={onRefreshSwitchChange}
        publishDialogOpen={publishDialogOpen}
        embedDialogOpen={embedDialogOpen}
        handleClosePublishDialog={handleClosePublishDialog}
        handleCloseEmbedDialog={handleCloseEmbedDialog}
        handleProceedToApplicationClicked={handleProceedToApplicationClicked}
        handleCopyLinkClicked={handleCopyLinkClicked}
        selectedVisualizer={selectedVisualizer}
        selectedApplicationTitle={selectedApplicationTitle}
        appIri={appIri}
        height={height}
        width={width}
        handleChangeWidth={handleChangeWidth}
        handleChangeHeight={handleChangeHeight}
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
