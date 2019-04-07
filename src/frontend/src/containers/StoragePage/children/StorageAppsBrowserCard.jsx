// @flow
import React, { PureComponent } from 'react';
import { withStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import Button from '@material-ui/core/Button';
import GridListTile from '@material-ui/core/GridListTile';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { VisualizerIcon } from '@components';
import { VISUALIZER_TYPE } from '@constants';
import { withRouter, Link } from 'react-router-dom';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import { StorageToolbox, getBeautifiedVisualizerTitle } from '@utils';
import IconButton from '@material-ui/core/IconButton';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import { toast } from 'react-toastify';
import { connect } from 'react-redux';
import { globalActions } from '@ducks/globalDuck';
import { etlActions } from '@ducks/etlDuck';
import { CopyToClipboard } from 'react-copy-to-clipboard';

const styles = {
  root: {
    justifyContent: 'center'
  },
  card: {
    height: '100%',
    width: '200px',
    display: 'flex',
    flexDirection: 'column'
  },
  cardContent: {
    flexGrow: 1
  },
  media: {
    objectFit: 'cover'
  }
};

type Props = {
  classes: {
    root: {},
    card: {},
    cardContent: {},
    media: {}
  },
  singleTileData: {
    applicationTitle: string,
    applicationIri: string,
    applicationConfigurationIri: string,
    applicationConfigurationLabel: string,
    applicationData: Object
  },
  handleSetResultPipelineIri: Function,
  handleSetSelectedVisualizer: Function,
  onHandleApplicationDeleted: Function,
  history: Object
};

type State = {
  open: boolean,
  textValue: string,
  anchorEl: any
};

class StorageAppsBrowserCard extends PureComponent<Props, State> {
  state = {
    open: false,
    textValue: '',
    anchorEl: undefined
  };

  handleClickOpen = () => {
    this.setState({ open: true });
  };

  handleClose = () => {
    this.setState({ open: false });
  };

  handleChange = e => {
    const textValue = e.target.value;
    this.setState({ textValue });
  };

  handleMenuClick = event => {
    this.setState({ anchorEl: event.currentTarget });
  };

  handleDeleteApp = () => {
    const { onHandleApplicationDeleted } = this.props;
    const applicationConfigurationIri = this.props.singleTileData
      .applicationConfigurationIri;
    const applicationConfigurationLabel = this.props.singleTileData
      .applicationConfigurationLabel;
    const self = this;
    StorageToolbox.removeAppFromStorage(applicationConfigurationIri).then(
      error => {
        if (!error) {
          self.setState({ anchorEl: null });
          onHandleApplicationDeleted(applicationConfigurationLabel);
          toast.success('Deleted application!', {
            position: toast.POSITION.TOP_RIGHT,
            autoClose: 2000
          });
        } else {
          toast.error('Error! Unable to delete published application!', {
            position: toast.POSITION.TOP_RIGHT,
            autoClose: 2000
          });
        }
      }
    );
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

  handleApplicationClicked = () => {
    const {
      handleSetSelectedVisualizer,
      handleSetResultPipelineIri,
      singleTileData,
      history
    } = this.props;
    const applicationData = singleTileData.applicationData;
    const resultGraphIri = applicationData.selectedResultGraphIri;
    const selectedVisualiser = {
      visualizer: { visualizerCode: applicationData.visualizerCode }
    };

    handleSetResultPipelineIri(resultGraphIri);
    handleSetSelectedVisualizer(selectedVisualiser);

    history.push({
      pathname: '/create-app'
    });
  };

  render() {
    const { classes, singleTileData } = this.props;
    const { anchorEl } = this.state;
    const {
      handleMenuClick,
      handleMenuClose,
      handleDeleteApp,
      handleShareApp,
      handleApplicationClicked,
      handleCopyLinkClicked
    } = this;
    return (
      <GridListTile>
        <Card className={classes.card}>
          <CardHeader
            action={
              <IconButton
                aria-owns={anchorEl ? 'simple-menu' : undefined}
                aria-haspopup="true"
                onClick={handleMenuClick}
              >
                <MoreVertIcon />
              </IconButton>
            }
          />
          <Menu
            id="simple-menu"
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={this.handleMenuClose}
          >
            <MenuItem onClick={handleShareApp}>Share</MenuItem>
            <MenuItem onClick={handleDeleteApp}>Delete</MenuItem>
          </Menu>
          <CardActionArea
            onClick={handleApplicationClicked}
            style={{ textAlign: 'center' }}
          >
            <VisualizerIcon
              visualizerType={VISUALIZER_TYPE.MAP}
              style={{ color: 'white', fontSize: '85px' }}
            />
            <CardContent className={classes.cardContent}>
              <Typography gutterBottom variant="h5" component="h2">
                {singleTileData.applicationTitle}
              </Typography>
              <Typography gutterBottom variant="h6" component="h2">
                {getBeautifiedVisualizerTitle(
                  singleTileData.applicationData.visualizerCode
                )}
              </Typography>
            </CardContent>
          </CardActionArea>
        </Card>
        <Dialog
          open={this.state.open}
          onClose={this.handleClose}
          aria-labelledby="form-dialog-title"
        >
          <DialogTitle id="form-dialog-title">
            Share the Application URL
          </DialogTitle>

          <DialogContent>
            <CopyToClipboard
              text={singleTileData.applicationIri}
              onCopy={handleCopyLinkClicked}
            >
              <TextField
                color="primary"
                label="Click to copy"
                variant="outlined"
                fullWidth
                value={singleTileData.applicationIri}
                autoFocus
                style={{
                  textDecoration: 'none'
                }}
              />
            </CopyToClipboard>
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleClose} color="primary">
              Close
            </Button>
          </DialogActions>
        </Dialog>
      </GridListTile>
    );
  }
}

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

  return {
    handleSetResultPipelineIri,
    handleSetSelectedVisualizer
  };
};

export default withRouter(
  connect(
    null,
    mapDispatchToProps
  )(withStyles(styles)(StorageAppsBrowserCard))
);
