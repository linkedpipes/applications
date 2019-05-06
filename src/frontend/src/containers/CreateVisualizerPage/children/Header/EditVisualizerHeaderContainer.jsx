// @flow
import React, { PureComponent } from 'react';
import EditVisualizerHeaderComponent from './EditVisualizerHeaderComponent';
import { applicationActions } from '@ducks/applicationDuck';
import { connect } from 'react-redux';
import { StorageToolbox, StorageBackend } from '@storage';
import { withRouter } from 'react-router-dom';
import { toast } from 'react-toastify';
import AppConfiguration from '@storage/models/AppConfiguration';

type Props = {
  selectedApplication: any,
  selectedApplicationTitle: any,
  handleAppTitleChanged: any,
  onRefreshSwitchChange?: (event: {}, checked: boolean) => void,
  headerParams: { title: string, subtitle?: string },
  history: any,
  selectedVisualizer: Object,
  selectedApplicationTitle: string,
  applicationsFolder: string,
  setApplicationLoaderStatus: Function,
  selectedApplicationMetadata: AppConfiguration,
  handleSetSelectedApplicationTitle: Function,
  handleSetSelectedApplicationMetadata: Function
};

type State = {
  publishDialogOpen: boolean,
  embedDialogOpen: boolean,
  appIri: string,
  height: number,
  width: number,
  deleteAppDialogOpen: boolean,
  anchorEl: Object,
  modifiedSelectedApplicationTitle: string,
  renameDialogOpen: boolean
};

class EditVisualizerHeaderContainer extends PureComponent<Props, State> {
  state = {
    publishDialogOpen: false,
    embedDialogOpen: false,
    appIri: '',
    height: 400,
    width: 400,
    deleteAppDialogOpen: false,
    anchorEl: undefined,
    modifiedSelectedApplicationTitle: '',
    renameDialogOpen: false
  };

  componentDidMount() {
    this.setState({
      modifiedSelectedApplicationTitle: this.props.selectedApplicationTitle
    });
  }

  handlePublishClicked = async () => {
    const { selectedApplication, selectedApplicationMetadata } = this.props;

    const publishedUrl = StorageToolbox.appIriToPublishUrl(
      selectedApplicationMetadata.object,
      selectedApplication.applicationEndpoint
    );

    this.handleAppPublished(publishedUrl);
  };

  handleEmbedClicked = async () => {
    const { selectedApplication, selectedApplicationMetadata } = this.props;

    const publishedUrl = StorageToolbox.appIriToPublishUrl(
      selectedApplicationMetadata.object,
      selectedApplication.applicationEndpoint
    );

    this.handleAppEmbedded(publishedUrl);
  };

  onHandleAppTitleChanged = e => {
    const value = e.target.value;
    const { handleAppTitleChanged } = this.props;
    handleAppTitleChanged(value);
  };

  handleAppPublished = appIri => {
    this.handleMenuClose();
    this.setState({ appIri, publishDialogOpen: true });
  };

  handleAppEmbedded = appIri => {
    this.handleMenuClose();
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

  handleMenuClick = event => {
    this.setState({ anchorEl: event.currentTarget });
  };

  handleMenuClose = () => {
    this.setState({ anchorEl: null });
  };

  handleDeleteAppClicked = () => {
    this.handleMenuClose();
    this.setState({ deleteAppDialogOpen: true });
  };

  handleDeleteAppDismissed = () => {
    this.setState({ deleteAppDialogOpen: false });
  };

  handleDeleteAppConfirmed = async () => {
    const {
      setApplicationLoaderStatus,
      selectedApplicationMetadata,
      applicationsFolder,
      history
    } = this.props;

    this.setState({ deleteAppDialogOpen: false });

    await setApplicationLoaderStatus(true);

    const result = await StorageToolbox.removeAppFromStorage(
      applicationsFolder,
      selectedApplicationMetadata
    );
    if (result) {
      history.push({
        pathname: '/dashboard'
      });
    }
  };

  handleOpenRenameDialog = () => {
    this.setState({ renameDialogOpen: true });
  };

  handleRenameConfirmed = async () => {
    const { modifiedSelectedApplicationTitle } = this.state;
    const {
      selectedApplicationMetadata,
      handleSetSelectedApplicationTitle,
      handleSetSelectedApplicationMetadata,
      setApplicationLoaderStatus
    } = this.props;

    if (modifiedSelectedApplicationTitle === '') {
      toast.error('Error, provide a valid name for an application!', {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 2000
      });
      return;
    }

    await setApplicationLoaderStatus(true);
    this.handleCloseRenameDialog();

    const isRenamed = await StorageBackend.renameAppConfiguration(
      selectedApplicationMetadata.url,
      modifiedSelectedApplicationTitle
    );

    if (isRenamed) {
      toast.success('Application was renamed!', {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 2000
      });

      selectedApplicationMetadata.title = modifiedSelectedApplicationTitle;
      handleSetSelectedApplicationTitle(modifiedSelectedApplicationTitle);
      handleSetSelectedApplicationMetadata(selectedApplicationMetadata);
    } else {
      toast.success('Error, unable to rename application!', {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 2000
      });

      this.handleOpenRenameDialog();
    }

    await setApplicationLoaderStatus(false);
  };

  handleRenameFieldChanged = e => {
    const value = e.target.value;
    this.setState({ modifiedSelectedApplicationTitle: value });
  };

  handleCloseRenameDialog = () => {
    this.setState({ renameDialogOpen: false });
  };

  render() {
    const {
      headerParams,
      onRefreshSwitchChange,
      selectedVisualizer,
      selectedApplicationTitle,
      selectedApplicationMetadata
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
      handleChangeWidth,
      handleMenuClose,
      handleMenuClick,
      handleDeleteAppClicked,
      handleDeleteAppDismissed,
      handleDeleteAppConfirmed,
      handleRenameConfirmed,
      handleCloseRenameDialog,
      handleOpenRenameDialog,
      handleRenameFieldChanged
    } = this;
    const {
      embedDialogOpen,
      publishDialogOpen,
      appIri,
      height,
      width,
      deleteAppDialogOpen,
      anchorEl,
      modifiedSelectedApplicationTitle,
      renameDialogOpen
    } = this.state;
    return (
      <EditVisualizerHeaderComponent
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
        selectedApplicationMetadata={selectedApplicationMetadata}
        deleteAppDialogOpen={deleteAppDialogOpen}
        handleMenuClose={handleMenuClose}
        anchorEl={anchorEl}
        handleMenuClick={handleMenuClick}
        handleDeleteAppClicked={handleDeleteAppClicked}
        handleDeleteAppDismissed={handleDeleteAppDismissed}
        handleDeleteAppConfirmed={handleDeleteAppConfirmed}
        modifiedSelectedApplicationTitle={modifiedSelectedApplicationTitle}
        handleRenameFieldChanged={handleRenameFieldChanged}
        handleOpenRenameDialog={handleOpenRenameDialog}
        handleCloseRenameDialog={handleCloseRenameDialog}
        handleRenameConfirmed={handleRenameConfirmed}
        renameDialogOpen={renameDialogOpen}
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
    selectedApplicationMetadata: state.application.selectedApplicationMetadata,
    selectedApplicationTitle: state.application.selectedApplicationTitle,
    applicationsFolder: state.user.applicationsFolder,
    webId: state.user.webId
  };
};

const mapDispatchToProps = dispatch => {
  const handleAppTitleChanged = applicationTitle =>
    dispatch(applicationActions.setApplicationTitle(applicationTitle));

  const handleSetSelectedApplicationMetadata = applicationMetadata =>
    dispatch(applicationActions.setApplicationMetadata(applicationMetadata));

  const handleSetSelectedApplicationTitle = applicationTitle =>
    dispatch(applicationActions.setApplicationTitle(applicationTitle));

  return {
    handleAppTitleChanged,
    handleSetSelectedApplicationMetadata,
    handleSetSelectedApplicationTitle
  };
};

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(EditVisualizerHeaderContainer)
);
