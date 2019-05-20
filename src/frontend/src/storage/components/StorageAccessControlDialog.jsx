// @flow
import React, { PureComponent } from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { globalActions } from '@ducks/globalDuck';
import { userActions } from '@ducks/userDuck';
import { withStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';
import LoadingOverlay from 'react-loading-overlay';
import Chip from '@material-ui/core/Chip';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import Input from '@material-ui/core/Input';
import MenuItem from '@material-ui/core/MenuItem';
import StorageToolbox from '@storage/StorageToolbox';
import AppConfiguration from '@storage/models/AppConfiguration';

const styles = theme => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap'
  },
  formControl: {
    margin: theme.spacing.unit,
    display: 'flex',
    flexWrap: 'wrap'
  },
  chips: {
    display: 'flex',
    flexWrap: 'wrap'
  },
  chip: {
    margin: theme.spacing.unit / 4
  },
  noLabel: {
    marginTop: theme.spacing.unit * 3
  }
});

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250
    }
  }
};

type Props = {
  handleUpdateAccessControlDialogState: Function,
  shareApplicationDialogIsOpen: boolean,
  selectedApplicationMetadata: AppConfiguration,
  webId: String,
  classes: Object
};

type State = {
  loadingIsActive: boolean,
  selectedWebIds: [],
  availableWebIds: []
};

class StorageAccessControlDialog extends PureComponent<Props, State> {
  state = {
    loadingIsActive: false,
    selectedWebIds: [],
    availableWebIds: []
  };

  componentDidMount() {
    this.fetchAvailableWebIds();
  }

  setApplicationLoaderStatus(isLoading) {
    this.setState({ loadingIsActive: isLoading });
  }

  fetchAvailableWebIds = async () => {
    const { webId } = this.props;
    if (webId) {
      const availableWebIds = await StorageToolbox.getFriends(webId);
      if (availableWebIds.length > 0) {
        this.setState({
          availableWebIds
        });
      }
    }
  };

  handleSendInvitation = async () => {
    const { webId, selectedApplicationMetadata } = this.props;
    const { selectedWebIds } = this.state;

    selectedWebIds.forEach(element => {
      StorageToolbox.sendCollaborationInvitation(
        selectedApplicationMetadata,
        webId,
        element.webId
      );
    });
  };

  handleClickOpen = () => {
    this.props.handleUpdateAccessControlDialogState(true);
  };

  handleShareApp = () => {};

  handleWebIdPick = event => {
    this.setState({ selectedWebIds: event.target.value });
  };

  handleClose = () => {
    this.props.handleUpdateAccessControlDialogState(false);
  };

  render() {
    const { loadingIsActive } = this.state;
    const { classes } = this.props;
    return (
      <div>
        <Dialog
          open={this.props.shareApplicationDialogIsOpen}
          onClose={this.handleClose}
          aria-labelledby="form-dialog-title"
        >
          <LoadingOverlay active={loadingIsActive} spinner>
            <DialogTitle id="form-dialog-title">
              Share and collaborate with your Friends
            </DialogTitle>
            <DialogContent>
              <DialogContentText>
                Choose the webId of your friend, to share access to your
                application for collaborative editing. Optionally, modify access
                control to a file to restrict access.
              </DialogContentText>
              <FormControl className={classes.formControl}>
                <InputLabel htmlFor="select-multiple-chip">Chip</InputLabel>
                <Select
                  multiple
                  fullWidth
                  value={this.state.selectedWebIds}
                  onChange={this.handleWebIdPick}
                  input={<Input id="select-multiple-chip" />}
                  renderValue={selected => (
                    <div className={classes.chips}>
                      {selected.map(person => (
                        <Chip
                          key={person.webId}
                          label={person.name}
                          className={classes.chip}
                        />
                      ))}
                    </div>
                  )}
                  MenuProps={MenuProps}
                >
                  {this.state.availableWebIds.map(person => (
                    <MenuItem key={person.webId} value={person}>
                      {person.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </DialogContent>
            <DialogActions>
              <Button onClick={this.handleClose} color="primary">
                Cancel
              </Button>
              <Button onClick={this.handleSendInvitation} color="primary">
                Send `Share` Invitation
              </Button>
            </DialogActions>
          </LoadingOverlay>
        </Dialog>
      </div>
    );
  }
}

// Press `Move`, to move
// current configurations into new folder. Press `Copy` to copy the
// current configurations into new folder.

const mapStateToProps = state => {
  return {
    currentApplicationsFolder: state.user.applicationsFolder,
    webId: state.user.webId,
    shareApplicationDialogIsOpen: state.globals.shareApplicationDialogIsOpen,
    selectedApplicationMetadata: state.application.selectedApplicationMetadata
  };
};

const mapDispatchToProps = dispatch => {
  const handleUpdateAccessControlDialogState = state =>
    dispatch(globalActions.setAccessControlDialogState({ state }));

  const handleUpdateApplicationsFolder = value =>
    dispatch(userActions.updateApplicationsFolder({ value }));

  return {
    handleUpdateAccessControlDialogState,
    handleUpdateApplicationsFolder
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(StorageAccessControlDialog));
