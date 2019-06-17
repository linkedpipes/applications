// @flow
import React, { PureComponent } from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Paper from '@material-ui/core/Paper';
import { globalActions } from '@ducks/globalDuck';
import { userActions } from '@ducks/userDuck';
import { withStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';
import LoadingOverlay from 'react-loading-overlay';
import Chip from '@material-ui/core/Chip';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import Select from '@material-ui/core/Select';
import Input from '@material-ui/core/Input';
import MenuItem from '@material-ui/core/MenuItem';
import StorageToolbox from '../StorageToolbox';
import { toast } from 'react-toastify';
import uuid from 'uuid';
import ApplicationMetadata from '@storage/models/ApplicationMetadata';

const styles = theme => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap'
  },
  formControl: {
    margin: theme.spacing(),
    display: 'flex',
    flexWrap: 'wrap'
  },
  chips: {
    display: 'flex',
    flexWrap: 'wrap'
  },
  chip: {
    margin: theme.spacing() / 2
  },
  noLabel: {
    marginTop: theme.spacing(3)
  },
  paper: {
    display: 'flex',
    justifyContent: 'center',
    flexWrap: 'wrap',
    padding: theme.spacing() / 2
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
  selectedApplicationMetadata: ApplicationMetadata,
  webId: String,
  classes: Object
};

type State = {
  loadingIsActive: boolean,
  metadataIsPublic: boolean,
  selectedContacts: [],
  availableContacts: [],
  collaborators: []
};

class StorageAccessControlDialog extends PureComponent<Props, State> {
  state = {
    loadingIsActive: false,
    metadataIsPublic: true,
    selectedContacts: [],
    collaborators: [],
    availableContacts: []
  };

  componentDidMount() {
    this.fetchAvailableContacts();
    this.fetchCollaborats();
  }

  setApplicationLoaderStatus(isLoading) {
    this.setState({ loadingIsActive: isLoading });
  }

  fetchCollaborats = async () => {
    const { selectedApplicationMetadata } = this.props;
    const accessControl = await StorageToolbox.fetchAclFromMetadata(
      selectedApplicationMetadata
    );
    const collaboratorWebIds = accessControl.getCollaborators();
    const collaborators = await StorageToolbox.getPersons(collaboratorWebIds);
    const metadataIsPublic = accessControl.isPublic();
    this.setState({ collaborators, metadataIsPublic });
  };

  fetchAvailableContacts = async () => {
    const { webId } = this.props;
    if (webId) {
      const availableContacts = await StorageToolbox.getFriends(webId);
      if (availableContacts.length > 0) {
        this.setState({
          availableContacts
        });
      }
    }
  };

  handleSendInvitation = async () => {
    this.props.handleUpdateAccessControlDialogState(true);

    const { webId, selectedApplicationMetadata } = this.props;
    const { selectedContacts } = this.state;

    selectedContacts.forEach(element => {
      StorageToolbox.sendCollaborationInvitation(
        selectedApplicationMetadata,
        webId,
        element.webId
      );
    });

    toast.info(
      `Invitations sent! Recepients will get access to configurations
      once they accept the invitation to collaborate...`,
      {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 4000
      }
    );

    this.props.handleUpdateAccessControlDialogState(false);
  };

  handleClickOpen = () => {
    this.props.handleUpdateAccessControlDialogState(true);
  };

  handleShareApp = () => {};

  handlePickContact = event => {
    this.setState({ selectedContacts: event.target.value });
  };

  handleClose = () => {
    this.props.handleUpdateAccessControlDialogState(false);
  };

  handleSetMetadataAccess = async event => {
    this.setApplicationLoaderStatus(true);

    const { webId, selectedApplicationMetadata } = this.props;

    const updatedMetadataStatus = event.target.checked;

    this.setState({
      metadataIsPublic: updatedMetadataStatus
    });

    await StorageToolbox.updateAccessControl(
      webId,
      selectedApplicationMetadata.url,
      updatedMetadataStatus,
      this.state.collaborators
    );

    this.setApplicationLoaderStatus(false);
  };

  handleDeleteAccess = person => async () => {
    this.setApplicationLoaderStatus(true);

    const { webId, selectedApplicationMetadata } = this.props;

    // eslint-disable-next-line react/no-access-state-in-setstate
    const collaborators = [...this.state.collaborators];
    const collaboratorToDelete = collaborators.indexOf(person);
    collaborators.splice(collaboratorToDelete, 1);

    await StorageToolbox.updateAccessControl(
      webId,
      selectedApplicationMetadata.url,
      this.state.metadataIsPublic,
      collaborators
    );

    this.setState({ collaborators });

    this.setApplicationLoaderStatus(false);
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
              Access Control Settings
            </DialogTitle>
            <DialogContent>
              <DialogContentText>
                Setup global access to an application. Public application is
                visible to everyone without a need to share with individual
                collaborators.
              </DialogContentText>
              <FormControlLabel
                control={
                  <Switch
                    id="with-web-id-checkbox"
                    checked={this.state.metadataIsPublic}
                    onChange={this.handleSetMetadataAccess}
                    value="checkedA"
                    color="primary"
                  />
                }
                label="Public access"
              />
            </DialogContent>
            <DialogContent>
              <DialogContentText>
                List of collaborators accessing this application. Edit or remove
                contacts if needed.
              </DialogContentText>
              <Paper className={classes.paper}>
                {this.state.collaborators.map(person => {
                  return (
                    <Chip
                      key={uuid.v4()}
                      label={person.name}
                      onDelete={this.handleDeleteAccess(person)}
                      className={classes.chip}
                    />
                  );
                })}
              </Paper>
            </DialogContent>
            <DialogContent>
              <DialogContentText>
                Choose the webId of your friend, to share access to your
                application for collaborative editing. Optionally, modify access
                control to a file to restrict access.
              </DialogContentText>
              <FormControl className={classes.formControl}>
                <InputLabel htmlFor="select-multiple-chip">
                  Friends and Contacts
                </InputLabel>
                <Select
                  multiple
                  fullWidth
                  value={this.state.selectedContacts}
                  onChange={this.handlePickContact}
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
                  {this.state.availableContacts.map(person => (
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
                Send Invitation
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
