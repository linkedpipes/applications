// @flow
import React, { PureComponent, Fragment } from 'react';
import { withStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardHeader from '@material-ui/core/CardHeader';
import CardActions from '@material-ui/core/CardActions';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { VisualizerIcon } from '@components';
import { withRouter } from 'react-router-dom';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import { GlobalUtils, VisualizersService } from '@utils';
import { AppConfiguration } from '../../../models';
import IconButton from '@material-ui/core/IconButton';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import { toast } from 'react-toastify';
import { connect } from 'react-redux';
import { globalActions } from '@ducks/globalDuck';
import { applicationActions } from '@ducks/applicationDuck';
import { etlActions } from '@ducks/etlDuck';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import StorageToolbox from '../../../StorageToolbox';
import ShareIcon from '@material-ui/icons/Share';
import axios from 'axios';

const styles = {
  card: {
    height: '280',
    width: '190',
    flexDirection: 'column',
    marginRight: 5
  },

  media: {
    textAlign: 'center'
  },

  actions: {
    display: 'flex'
  },

  textField: {
    flexGrow: 1,
    width: '100%',
    marginTop: '1rem'
  }
};

type Props = {
  classes: {
    root: {},
    card: {},
    cardContent: {},
    media: {},
    actions: {},
    textField: {}
  },
  applicationMetadata: AppConfiguration,
  handleSetResultPipelineIri: Function,
  handleSetSelectedVisualizer: Function,
  onHandleApplicationDeleted: Function,
  handleSetSelectedApplicationTitle: Function,
  handleSetSelectedApplicationData: Function,
  handleSetSelectedApplicationMetadata: Function,
  setApplicationLoaderStatus: Function,
  history: Object,
  applicationsFolder: string,
  indexNumber: Number
};

type State = {
  open: boolean,
  anchorEl: any
};

class StorageAppsBrowserCardComponent extends PureComponent<Props, State> {
  state = {
    open: false,
    anchorEl: undefined
  };

  handleClickOpen = () => {
    this.setState({ open: true });
  };

  handleClose = () => {
    this.setState({ open: false });
  };

  handleDeleteApp = async () => {
    const { setApplicationLoaderStatus } = this.props;

    await setApplicationLoaderStatus(true);

    const result = await StorageToolbox.removeAppFromStorage(
      this.props.applicationsFolder,
      this.props.applicationMetadata
    );
    if (result) {
      this.props.onHandleApplicationDeleted(this.props.applicationMetadata);
    }

    await setApplicationLoaderStatus(false);
  };

  handleMenuClick = event => {
    this.setState({ anchorEl: event.currentTarget });
  };

  handleMenuClose = () => {
    this.setState({ anchorEl: null });
  };

  handleShareApp = () => {
    this.setState({ open: true });
  };

  handleCopyLinkClicked = () => {
    toast.success('Copied link to clipboard!', {
      position: toast.POSITION.TOP_RIGHT,
      autoClose: 2000
    });
  };

  handleApplicationClicked = async () => {
    const {
      setApplicationLoaderStatus,
      applicationMetadata,
      handleSetSelectedVisualizer,
      handleSetResultPipelineIri,
      handleSetSelectedApplicationTitle,
      handleSetSelectedApplicationData,
      handleSetSelectedApplicationMetadata,
      history
    } = this.props;

    await setApplicationLoaderStatus(true);

    const appConfigurationResponse = await axios.get(
      applicationMetadata.object
    );

    if (appConfigurationResponse.status !== 200) {
      toast.error('Error, unable to load!', {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 2000
      });
      await setApplicationLoaderStatus(false);
    }
    const applicationData = appConfigurationResponse.data.applicationData;

    const resultGraphIri = applicationData.selectedResultGraphIri;
    let graphExists = true;

    await VisualizersService.getGraphExists(resultGraphIri).catch(() => {
      graphExists = false;
    });

    if (graphExists) {
      const selectedVisualiser = {
        visualizer: { visualizerCode: applicationData.visualizerCode }
      };

      await handleSetResultPipelineIri(resultGraphIri);
      await handleSetSelectedApplicationTitle(applicationMetadata.title);
      await handleSetSelectedApplicationData(applicationData);
      await handleSetSelectedApplicationMetadata(applicationMetadata);
      await handleSetSelectedVisualizer(selectedVisualiser);

      await setApplicationLoaderStatus(false);

      history.push({
        pathname: '/create-app'
      });
    } else {
      toast.success(
        'Application data was removed or deleted from the platform,' +
          'blank metadata will be removed from storage...',
        {
          position: toast.POSITION.TOP_RIGHT
        }
      );
      this.handleDeleteApp();
    }
  };

  render() {
    const { classes, applicationMetadata, indexNumber } = this.props;
    const { anchorEl } = this.state;
    const {
      handleMenuClick,
      handleDeleteApp,
      handleShareApp,
      handleApplicationClicked,
      handleCopyLinkClicked
    } = this;
    return (
      <Fragment>
        <Card className={classes.card}>
          <CardHeader
            action={
              <IconButton
                aria-owns={anchorEl ? 'simple-menu' : undefined}
                aria-haspopup="true"
                id={`more_icon_${indexNumber.toString()}_${
                  applicationMetadata.title
                }`}
                onClick={handleMenuClick}
              >
                <MoreVertIcon />
              </IconButton>
            }
            title={applicationMetadata.title}
            subheader={GlobalUtils.getBeautifiedVisualizerTitle(
              applicationMetadata.endpoint
            )}
          />
          <CardActionArea onClick={handleApplicationClicked}>
            <div
              className={classes.media}
              id={`${indexNumber.toString()}_${applicationMetadata.title}`}
              style={{ backgroundColor: applicationMetadata.cardColor }}
            >
              <VisualizerIcon
                visualizerType={applicationMetadata.endpoint}
                style={{ color: 'white', fontSize: '85px' }}
              />
            </div>
          </CardActionArea>
          <CardActions className={classes.actions} disableActionSpacing>
            <IconButton aria-label="Share" onClick={handleShareApp}>
              <ShareIcon />
            </IconButton>
          </CardActions>
        </Card>
        <Menu
          id="simple-menu"
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={this.handleMenuClose}
        >
          <MenuItem
            id={`delete_button_${indexNumber.toString()}_${
              applicationMetadata.title
            }`}
            onClick={handleDeleteApp}
          >
            Delete
          </MenuItem>
        </Menu>

        <Dialog
          open={this.state.open}
          onClose={this.handleClose}
          aria-labelledby="form-dialog-title"
        >
          <DialogTitle id="form-dialog-title">
            Share the Application URL
          </DialogTitle>

          <DialogContent>
            <DialogContentText>
              Click on the field with link to copy the public view URL to your
              clipboard.
            </DialogContentText>
          </DialogContent>

          <DialogContent>
            <CopyToClipboard
              text={StorageToolbox.appIriToPublishUrl(
                applicationMetadata.object,
                applicationMetadata.endpoint
              )}
              onCopy={handleCopyLinkClicked}
            >
              <TextField
                color="primary"
                label="Click to copy"
                variant="outlined"
                className={classes.textField}
                fullWidth
                value={StorageToolbox.appIriToPublishUrl(
                  applicationMetadata.object,
                  applicationMetadata.endpoint
                )}
                autoFocus
              />
            </CopyToClipboard>
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleClose} color="primary">
              Close
            </Button>
          </DialogActions>
        </Dialog>
      </Fragment>
    );
  }
}

const mapStateToProps = state => {
  return {
    applicationsFolder: state.user.applicationsFolder
  };
};

const mapDispatchToProps = dispatch => {
  const handleSetResultPipelineIri = resultGraphIri =>
    dispatch(
      etlActions.addSelectedResultGraphIriAction({
        data: resultGraphIri
      })
    );

  const handleSetSelectedVisualizer = visualizerData =>
    dispatch(
      globalActions.addSelectedVisualizerAction({
        data: visualizerData
      })
    );

  const handleSetSelectedApplicationTitle = applicationTitle =>
    dispatch(applicationActions.setApplicationTitle(applicationTitle));

  const handleSetSelectedApplicationData = applicationData =>
    dispatch(applicationActions.setApplication(applicationData));

  const handleSetSelectedApplicationMetadata = applicationMetadata =>
    dispatch(applicationActions.setApplicationMetadata(applicationMetadata));

  return {
    handleSetResultPipelineIri,
    handleSetSelectedVisualizer,
    handleSetSelectedApplicationTitle,
    handleSetSelectedApplicationData,
    handleSetSelectedApplicationMetadata
  };
};

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(withStyles(styles)(StorageAppsBrowserCardComponent))
);
