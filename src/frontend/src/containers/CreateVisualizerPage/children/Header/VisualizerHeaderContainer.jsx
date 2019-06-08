// @flow
import React, { PureComponent } from 'react';
import VisualizerControllerHeaderComponent from './VisualizerHeaderComponent';
import { applicationActions } from '@ducks/applicationDuck';
import { connect } from 'react-redux';
import { StorageToolbox } from '@storage';
import { withRouter } from 'react-router-dom';
import { toast } from 'react-toastify';
import { GoogleAnalyticsWrapper } from '@utils';
import AppConfiguration from '@storage/models/AppConfiguration';

type Props = {
  selectedApplication: any,
  selectedApplicationTitle: any,
  handleAppTitleChanged: any,
  webId: string,
  onRefreshSwitchChange?: (event: {}, checked: boolean) => void,
  headerParams: { title: string, subtitle?: string },
  history: any,
  selectedVisualizer: Object,
  selectedApplicationTitle: string,
  applicationsFolder: string,
  setApplicationLoaderStatus: Function,
  handleSetSelectedApplicationMetadata: Function,
  filters: Object
};

type State = {
  publishDialogOpen: boolean,
  embedDialogOpen: boolean,
  appIri: string,
  height: number,
  width: number,
  currentApplicationMetadata: AppConfiguration
};

class VisualizerHeaderContainer extends PureComponent<Props, State> {
  state = {
    publishDialogOpen: false,
    embedDialogOpen: false,
    appIri: '',
    height: 400,
    width: 400,
    currentApplicationMetadata: undefined
  };

  handlePublishClicked = async () => {
    const {
      selectedApplication,
      selectedApplicationTitle,
      webId,
      applicationsFolder,
      setApplicationLoaderStatus,
      filters
    } = this.props;

    setApplicationLoaderStatus(true);

    if (selectedApplicationTitle === '') {
      toast.error('Please, provide application title!', {
        position: toast.POSITION.TOP_CENTER,
        autoClose: 5000
      });

      setApplicationLoaderStatus(false);
      return;
    }

    const currentApplicationMetadata = await StorageToolbox.saveAppToSolid(
      selectedApplication,
      filters,
      webId,
      applicationsFolder
    );

    this.setState({ currentApplicationMetadata });

    const publishedUrl = StorageToolbox.appIriToPublishUrl(
      currentApplicationMetadata.solidFileUrl,
      currentApplicationMetadata.configuration.endpoint
    );

    setApplicationLoaderStatus(false);
    this.handleAppPublished(publishedUrl);

    GoogleAnalyticsWrapper.trackEvent({
      category: 'CreateApp',
      action: 'Pressed create app',
      label: `type : '${currentApplicationMetadata.configuration.endpoint}'`
    });
  };

  handleEmbedClicked = async () => {
    const {
      selectedApplication,
      selectedApplicationTitle,
      webId,
      applicationsFolder,
      setApplicationLoaderStatus,
      filters
    } = this.props;

    setApplicationLoaderStatus(true);

    if (selectedApplicationTitle === '') {
      toast.error('Please, provide application title!', {
        position: toast.POSITION.TOP_CENTER,
        autoClose: 5000
      });

      setApplicationLoaderStatus(false);
      return;
    }

    const currentApplicationMetadata = await StorageToolbox.saveAppToSolid(
      selectedApplication,
      filters,
      webId,
      applicationsFolder
    );

    this.setState({ currentApplicationMetadata });

    const publishedUrl = StorageToolbox.appIriToPublishUrl(
      currentApplicationMetadata.solidFileUrl,
      currentApplicationMetadata.configuration.endpoint
    );

    setApplicationLoaderStatus(false);
    this.handleAppPublished(publishedUrl);

    GoogleAnalyticsWrapper.trackEvent({
      category: 'CreateApp',
      action: 'Pressed embed app',
      label: `type : '${currentApplicationMetadata.configuration.endpoint}'`
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
    this.props.handleSetSelectedApplicationMetadata(
      this.state.currentApplicationMetadata
    );
  };

  handleCloseEmbedDialog = () => {
    this.setState({ embedDialogOpen: false });
    this.props.handleSetSelectedApplicationMetadata(
      this.state.currentApplicationMetadata
    );
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
    this.setState({ width: Math.min(event.target.value, 150) });
  };

  handleChangeHeight = event => {
    this.setState({ height: Math.min(event.target.value, 150) });
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
    filters: state.filters,
    selectedResultGraphIri: state.globals.selectedResultGraphIri,
    selectedApplication: state.application.selectedApplication,
    selectedApplicationTitle: state.application.selectedApplication.title,
    applicationsFolder: state.user.applicationsFolder,
    webId: state.user.webId
  };
};

const mapDispatchToProps = dispatch => {
  const handleAppTitleChanged = applicationTitle =>
    dispatch(applicationActions.setApplicationTitle(applicationTitle));

  const handleSetSelectedApplicationMetadata = applicationMetadata =>
    dispatch(applicationActions.setApplicationMetadata(applicationMetadata));

  return {
    handleAppTitleChanged,
    handleSetSelectedApplicationMetadata
  };
};

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(VisualizerHeaderContainer)
);
