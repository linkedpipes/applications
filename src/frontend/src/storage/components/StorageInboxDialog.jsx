// @flow
import React, { PureComponent } from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import List from '@material-ui/core/List';
import { globalActions } from '@ducks/globalDuck';
import { userActions } from '@ducks/userDuck';
import { withStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';
import LoadingOverlay from 'react-loading-overlay';
import StorageBackend from '../StorageBackend';
import StorageToolbox from '@storage/StorageToolbox';
import AppConfiguration from '@storage/models/AppConfiguration';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
import FolderIcon from '@material-ui/icons/Folder';
import AcceptIcon from '@material-ui/icons/CheckTwoTone';
import DeclineIcon from '@material-ui/icons/NotInterestedTwoTone';
import uuid from 'uuid';

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
  handleSetInboxDialogState: Function,
  inboxDialogIsOpen: boolean,
  inboxNotifications: [Object],
  selectedApplicationMetadata: AppConfiguration,
  webId: String,
  classes: Object
};

type State = {
  loadingIsActive: boolean
};

class StorageInboxDialog extends PureComponent<Props, State> {
  state = {
    loadingIsActive: false
  };

  setApplicationLoaderStatus(isLoading) {
    this.setState({ loadingIsActive: isLoading });
  }

  handleClose = () => {
    this.props.handleSetInboxDialogState(false);
  };

  render() {
    const { loadingIsActive } = this.state;
    const { classes, inboxNotifications } = this.props;
    return (
      <div>
        <Dialog
          open={this.props.inboxDialogIsOpen}
          onClose={this.handleClose}
          aria-labelledby="form-dialog-title"
        >
          <LoadingOverlay active={loadingIsActive} spinner>
            <DialogTitle id="form-dialog-title">
              Inbox notifications
            </DialogTitle>
            <DialogContent>
              <DialogContentText>
                Browse notifications from your contacts to collaborate on
                applications that they have created.
              </DialogContentText>
              <List dense>
                {inboxNotifications.map(inboxNotification => (
                  <ListItem dense key={`${uuid.v4()}`}>
                    <IconButton
                      key={`accept-invite-${uuid.v4()}`}
                      aria-label="Accept"
                    >
                      <AcceptIcon />
                    </IconButton>

                    <ListItemText
                      key={`${uuid.v4()}`}
                      primary="Single-line item"
                      secondary={'Secondary text'}
                    />

                    <ListItemSecondaryAction key={`${uuid.v4()}`}>
                      <IconButton
                        key={`decline-invite-${uuid.v4()}`}
                        aria-label="Decline"
                      >
                        <DeclineIcon />
                      </IconButton>
                    </ListItemSecondaryAction>
                  </ListItem>
                ))}
              </List>
            </DialogContent>
            <DialogActions>
              <Button onClick={this.handleClose} color="primary">
                Close
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
    inboxDialogIsOpen: state.globals.inboxDialogIsOpen,
    inboxNotifications: state.user.inboxNotifications,
    selectedApplicationMetadata: state.application.selectedApplicationMetadata
  };
};

const mapDispatchToProps = dispatch => {
  const handleUpdateAccessControlDialogState = state =>
    dispatch(globalActions.setAccessControlDialogState({ state }));

  const handleUpdateApplicationsFolder = value =>
    dispatch(userActions.updateApplicationsFolder({ value }));

  const handleSetInboxDialogState = isOpen =>
    dispatch(globalActions.setInboxDialogState(isOpen));

  return {
    handleUpdateAccessControlDialogState,
    handleUpdateApplicationsFolder,
    handleSetInboxDialogState
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(StorageInboxDialog));
