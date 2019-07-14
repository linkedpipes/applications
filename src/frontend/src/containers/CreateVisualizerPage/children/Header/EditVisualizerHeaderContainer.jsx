// @flow
import React, { PureComponent, Fragment } from 'react';
import EditVisualizerHeaderComponent from './EditVisualizerHeaderComponent';
import { applicationActions } from '@ducks/applicationDuck';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { toast } from 'react-toastify';
import { globalActions } from '@ducks/globalDuck';
import ApplicationMetadata from '@storage/models/ApplicationMetadata';
import UserService from '@utils/user.service';
import { GoogleAnalyticsWrapper, ETLService } from '@utils';
import { StorageToolbox, StorageAccessControlDialog } from '@storage';

const intervalTypeToHours = (interval, type) => {
  const numberInterval = Number(interval);
  switch (type) {
    case 'Days':
      return `${numberInterval * 24}`;
    case 'Weeks':
      return `${numberInterval * 7 * 24}`;
    default:
      return interval;
  }
};

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
  selectedApplicationMetadata: ApplicationMetadata,
  handleSetSelectedApplicationTitle: Function,
  handleSetSelectedApplicationMetadata: Function,
  handleUpdateAccessControlDialogState: Function,
  webId: string,
  isShared: Boolean
};

type State = {
  publishDialogOpen: boolean,
  embedDialogOpen: boolean,
  appIri: string,
  height: number,
  width: number,
  deleteAppDialogOpen: boolean,
  sharingAnchorEl: Object,
  settingsAnchorEl: Object,
  modifiedSelectedApplicationTitle: string,
  renameDialogOpen: boolean,
  dataRefreshDialogOpen: boolean,
  selectedDataRefreshInterval: { type: string, value: string },
  selectedPipelineExecution: ?{ scheduleOn: boolean }
};

class EditVisualizerHeaderContainer extends PureComponent<Props, State> {
  state = {
    publishDialogOpen: false,
    embedDialogOpen: false,
    appIri: '',
    height: 400,
    width: 400,
    deleteAppDialogOpen: false,
    sharingAnchorEl: undefined,
    settingsAnchorEl: undefined,
    modifiedSelectedApplicationTitle: '',
    renameDialogOpen: false,
    dataRefreshDialogOpen: false,
    selectedDataRefreshInterval: { value: '', type: 'Hours' },
    selectedPipelineExecution: undefined
  };

  componentDidMount() {
    this.setState({
      modifiedSelectedApplicationTitle: this.props.selectedApplicationTitle
    });

    this.fetchCurrentPipelineExecution();
  }

  fetchCurrentPipelineExecution = async () => {
    const { selectedApplicationMetadata } = this.props;
    const executionIri =
      selectedApplicationMetadata.configuration.etlExecutionIri;

    const pipelineExecutionResponse = await ETLService.getPipelineExecution({
      executionIri
    });

    if (pipelineExecutionResponse.status === 200) {
      let frequencyHours = `${pipelineExecutionResponse.data.frequencyHours}`;
      frequencyHours = frequencyHours === '-1' ? '' : frequencyHours;

      this.setState(prevState => {
        return {
          selectedPipelineExecution: pipelineExecutionResponse.data,
          selectedDataRefreshInterval: {
            value: frequencyHours,
            type: prevState.selectedDataRefreshInterval.type
          }
        };
      });
    }
  };

  handlePublishClicked = async () => {
    const { selectedApplication, selectedApplicationMetadata } = this.props;

    const publishedUrl = StorageToolbox.appIriToPublishUrl(
      selectedApplicationMetadata.solidFileUrl,
      selectedApplication.endpoint
    );

    this.handleAppPublished(publishedUrl);
  };

  handleEmbedClicked = async () => {
    const { selectedApplication, selectedApplicationMetadata } = this.props;

    const publishedUrl = StorageToolbox.appIriToPublishUrl(
      selectedApplicationMetadata.solidFileUrl,
      selectedApplication.endpoint
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
    this.props.history.push('/applications');
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

  handleSharingMenuClick = event => {
    this.setState({ sharingAnchorEl: event.currentTarget });
  };

  handleSettingsMenuClick = event => {
    this.setState({ settingsAnchorEl: event.currentTarget });
  };

  handleMenuClose = () => {
    this.setState({ sharingAnchorEl: null, settingsAnchorEl: null });
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
      webId,
      history
    } = this.props;

    this.setState({ deleteAppDialogOpen: false });

    await setApplicationLoaderStatus(true);

    const result = await StorageToolbox.removeAppFromStorage(
      applicationsFolder,
      selectedApplicationMetadata
    );
    if (result) {
      await UserService.deleteApplication(
        webId,
        selectedApplicationMetadata.solidFileUrl
      );

      GoogleAnalyticsWrapper.trackEvent({
        category: 'CreateApp',
        action: 'Pressed delete app',
        label: `type : '${selectedApplicationMetadata.endpoint}'`
      });

      history.push({
        pathname: '/dashboard'
      });
    }
  };

  handleOpenAccessControlDialog = () => {
    this.props.handleUpdateAccessControlDialogState(true);
  };

  handleCloseAccessControlDialog = () => {
    this.props.handleUpdateAccessControlDialogState(false);
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

    const applicationMetadata = selectedApplicationMetadata;

    if (modifiedSelectedApplicationTitle === '') {
      toast.error('Error, provide a valid name for an application!', {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 2000
      });
      return;
    }

    await setApplicationLoaderStatus(true);
    this.handleCloseRenameDialog();

    const isRenamed = await StorageToolbox.renameAppConfiguration(
      applicationMetadata.solidFileUrl,
      modifiedSelectedApplicationTitle
    );

    if (isRenamed) {
      toast.success('Application was renamed!', {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 2000
      });

      applicationMetadata.configuration.title = modifiedSelectedApplicationTitle;
      handleSetSelectedApplicationTitle(modifiedSelectedApplicationTitle);
      handleSetSelectedApplicationMetadata(applicationMetadata);
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

  handleDataRefreshClicked = () => {
    this.handleMenuClose();
    this.setState({ dataRefreshDialogOpen: true });
  };

  handleDataRefreshConfirmed = async () => {
    const {
      webId,
      selectedApplicationMetadata,
      setApplicationLoaderStatus
    } = this.props;

    await setApplicationLoaderStatus(true);

    const { selectedDataRefreshInterval } = this.state;

    const executionIri =
      selectedApplicationMetadata.configuration.etlExecutionIri;
    const selectedVisualiser = this.props.selectedVisualizer.visualizer
      .visualizerCode;
    const frequencyHours = intervalTypeToHours(
      selectedDataRefreshInterval.value,
      selectedDataRefreshInterval.type
    );

    const response = await ETLService.setupRepeatedPipelineExecution({
      webId,
      selectedVisualiser,
      executionIri,
      frequencyHours
    });

    if (response.status === 200) {
      toast.success('Background data refreshing is enabled!', {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 2000
      });
    } else {
      toast.error('Error! Unable to setup background data refreshing.', {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 2000
      });
    }

    this.setState({ dataRefreshDialogOpen: false });
    await setApplicationLoaderStatus(false);
  };

  handleDataRefreshDismissed = async () => {
    this.setState({ dataRefreshDialogOpen: false });
  };

  handleDataRefreshTypeChange = event => {
    this.setState(prevState => {
      return {
        selectedDataRefreshInterval: {
          value: prevState.selectedDataRefreshInterval.value,
          type: event.target.value
        }
      };
    });
  };

  handleDataRefreshValueChange = event => {
    const value = event.target.value ? event.target.value : '';
    this.setState(prevState => {
      return {
        selectedDataRefreshInterval: {
          type: prevState.selectedDataRefreshInterval.type,
          value
        }
      };
    });
  };

  handleDataRefreshToggleClicked = async () => {
    const {
      selectedApplicationMetadata,
      setApplicationLoaderStatus
    } = this.props;

    await setApplicationLoaderStatus(true);

    const executionIri =
      selectedApplicationMetadata.configuration.etlExecutionIri;
    const pipelineExecution: any = this.state.selectedPipelineExecution;

    pipelineExecution.scheduleOn = !pipelineExecution.scheduleOn;

    if (pipelineExecution) {
      const response = await ETLService.toggleRepeatedPipelineExecution({
        executionIri,
        repeat: pipelineExecution.scheduleOn
      });
      if (response.status === 200) {
        this.setState({
          selectedPipelineExecution: pipelineExecution,
          dataRefreshDialogOpen: false
        });

        toast.success(
          `Successfully ${
            pipelineExecution.scheduleOn ? 'enabled' : 'disabled'
          } data refreshing!`,
          {
            position: toast.POSITION.TOP_RIGHT,
            autoClose: 2000
          }
        );
      } else {
        toast.error(
          `Error! Unable to  ${
            pipelineExecution.scheduleOn ? 'enable' : 'disable'
          } data refreshing!`,
          {
            position: toast.POSITION.TOP_RIGHT,
            autoClose: 2000
          }
        );
      }
    }

    await setApplicationLoaderStatus(false);
  };

  render() {
    const {
      headerParams,
      onRefreshSwitchChange,
      selectedVisualizer,
      selectedApplicationTitle,
      selectedApplicationMetadata,
      isShared
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
      handleSharingMenuClick,
      handleSettingsMenuClick,
      handleDeleteAppClicked,
      handleDeleteAppDismissed,
      handleDeleteAppConfirmed,
      handleRenameConfirmed,
      handleCloseRenameDialog,
      handleOpenRenameDialog,
      handleOpenAccessControlDialog,
      handleCloseAccessControlDialog,
      handleRenameFieldChanged,
      handleDataRefreshClicked,
      handleDataRefreshConfirmed,
      handleDataRefreshDismissed,
      handleDataRefreshTypeChange,
      handleDataRefreshValueChange,
      handleDataRefreshToggleClicked
    } = this;
    const {
      embedDialogOpen,
      publishDialogOpen,
      appIri,
      height,
      width,
      deleteAppDialogOpen,
      sharingAnchorEl,
      settingsAnchorEl,
      modifiedSelectedApplicationTitle,
      renameDialogOpen,
      dataRefreshDialogOpen,
      selectedDataRefreshInterval,
      selectedPipelineExecution
    } = this.state;
    return (
      <Fragment>
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
          sharingAnchorEl={sharingAnchorEl}
          settingsAnchorEl={settingsAnchorEl}
          handleSharingMenuClick={handleSharingMenuClick}
          handleSettingsMenuClick={handleSettingsMenuClick}
          handleDeleteAppClicked={handleDeleteAppClicked}
          handleDataRefreshClicked={handleDataRefreshClicked}
          handleDataRefreshDismissed={handleDataRefreshDismissed}
          handleDeleteAppDismissed={handleDeleteAppDismissed}
          handleDeleteAppConfirmed={handleDeleteAppConfirmed}
          handleDataRefreshConfirmed={handleDataRefreshConfirmed}
          modifiedSelectedApplicationTitle={modifiedSelectedApplicationTitle}
          handleOpenAccessControlDialog={handleOpenAccessControlDialog}
          handleCloseAccessControlDialog={handleCloseAccessControlDialog}
          handleRenameFieldChanged={handleRenameFieldChanged}
          handleOpenRenameDialog={handleOpenRenameDialog}
          handleCloseRenameDialog={handleCloseRenameDialog}
          handleRenameConfirmed={handleRenameConfirmed}
          renameDialogOpen={renameDialogOpen}
          dataRefreshDialogOpen={dataRefreshDialogOpen}
          selectedDataRefreshInterval={selectedDataRefreshInterval}
          handleDataRefreshTypeChange={handleDataRefreshTypeChange}
          handleDataRefreshValueChange={handleDataRefreshValueChange}
          handleDataRefreshToggleClicked={handleDataRefreshToggleClicked}
          selectedPipelineExecution={selectedPipelineExecution}
          isShared={isShared}
        />
        <StorageAccessControlDialog />
      </Fragment>
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

  const handleSetSelectedApplicationTitle = applicationTitle =>
    dispatch(applicationActions.setApplicationTitle(applicationTitle));

  const handleUpdateAccessControlDialogState = state =>
    dispatch(globalActions.setAccessControlDialogState({ state }));

  return {
    handleAppTitleChanged,
    handleSetSelectedApplicationMetadata,
    handleSetSelectedApplicationTitle,
    handleUpdateAccessControlDialogState
  };
};

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(EditVisualizerHeaderContainer)
);
