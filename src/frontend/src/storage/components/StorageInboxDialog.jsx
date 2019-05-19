// @flow
import React, { PureComponent } from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import ListItem from '@material-ui/core/ListItem';
import List from '@material-ui/core/List';
import { globalActions } from '@ducks/globalDuck';
import { userActions } from '@ducks/userDuck';
import { withStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';
import LoadingOverlay from 'react-loading-overlay';
import StorageToolbox from '@storage/StorageToolbox';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import IconButton from '@material-ui/core/IconButton';
import AcceptIcon from '@material-ui/icons/CheckTwoTone';
import DeclineIcon from '@material-ui/icons/NotInterestedTwoTone';
import { Log } from '@utils';
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

type Props = {
  handleSetInboxDialogState: Function,
  inboxDialogIsOpen: boolean,
  inboxInvitations: [Object],
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

  handleSendAcceptInvitation = async invitation => {
    if (invitation) {
      Log.info(invitation);
      await StorageToolbox.sendAcceptCollaborationInvitation(invitation);
      Log.info('done');
    }
  };

  handleSendRejectInvitation = async invitation => {
    if (invitation) {
      Log.info(invitation);
      await StorageToolbox.sendRejectCollaborationInvitation(invitation);
      Log.info('done');
    }
  };

  render() {
    const { loadingIsActive } = this.state;
    const { classes, inboxInvitations } = this.props;
    const { handleSendAcceptInvitation, handleSendRejectInvitation } = this;
    return (
      <div>
        <Dialog
          open={this.props.inboxDialogIsOpen}
          onClose={this.handleClose}
          aria-labelledby="form-dialog-title"
        >
          <LoadingOverlay active={loadingIsActive} spinner>
            <DialogTitle id="form-dialog-title">Inbox invitations</DialogTitle>
            <DialogContent>
              <DialogContentText>
                Browse invitations from your contacts to collaborate on
                applications that they have created.
              </DialogContentText>
              <List dense>
                {inboxInvitations.map(inboxInvitation => (
                  <ListItem dense key={`${uuid.v4()}`}>
                    <div
                      onClick={() => {
                        handleSendAcceptInvitation(inboxInvitation);
                      }}
                    >
                      <IconButton
                        key={`accept-invite-${uuid.v4()}`}
                        aria-label="Accept"
                      >
                        <AcceptIcon />
                      </IconButton>
                    </div>
                    <ListItemText
                      key={`${uuid.v4()}`}
                      primary="Single-line item"
                      secondary={'Secondary text'}
                    />

                    <ListItemSecondaryAction
                      onClick={() => {
                        handleSendRejectInvitation(inboxInvitation);
                      }}
                      key={`${uuid.v4()}`}
                    >
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
    inboxInvitations: state.user.inboxInvitations,
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
