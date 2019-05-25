// @flow
import React, { PureComponent } from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { globalActions } from '@ducks/globalDuck';
import { userActions } from '@ducks/userDuck';
import { Utils } from '../utils';
import { connect } from 'react-redux';
import { toast } from 'react-toastify';
import StorageBackend from '../StorageBackend';
import { Log } from '@utils';
import LoadingOverlay from 'react-loading-overlay';

type Props = {
  handleUpdateChooseFolderDialogState: Function,
  handleUpdateApplicationsFolder: Function,
  chooseFolderDialogIsOpen: boolean,
  webId: string,
  currentApplicationsFolder: string
};

type State = {
  folderTitle: any,
  defaultFolderTitle: string,
  loadingIsActive: boolean
};

class StoragePickFolderDialog extends PureComponent<Props, State> {
  state = {
    folderTitle: undefined,
    defaultFolderTitle: 'linkedpipes',
    loadingIsActive: false
  };

  constructor(props) {
    super(props);
    (this: any).handleFolderConfirm = this.handleFolderConfirm.bind(this);
    (this: any).handleFolderCopy = this.handleFolderCopy.bind(this);
    (this: any).handleFolderMove = this.handleFolderMove.bind(this);
  }

  componentDidMount() {
    this.setState({
      folderTitle: this.props.currentApplicationsFolder
        ? this.props.currentApplicationsFolder.substring(
            this.props.currentApplicationsFolder.lastIndexOf('/') + 1
          )
        : 'linkedpipes'
    });
  }

  setApplicationLoaderStatus(isLoading) {
    this.setState({ loadingIsActive: isLoading });
  }

  handleClickOpen = () => {
    this.props.handleUpdateChooseFolderDialogState(true);
  };

  handleChangeFolderTitle = event => {
    this.setState({ folderTitle: event.target.value });
  };

  handleClose = () => {
    this.props.handleUpdateChooseFolderDialogState(false);
  };

  async handleFolderMove() {
    this.setApplicationLoaderStatus(true);

    const folderSelected =
      this.state.folderTitle === undefined
        ? this.state.defaultFolderTitle
        : this.state.folderTitle;
    const folder = Utils.trimSlashes(folderSelected);
    if (!Utils.isValidFolder(`/${folder}/`)) {
      toast.error('Enter a valid folder path!', {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 5000
      });

      this.setApplicationLoaderStatus(false);
      return;
    }
    const folderUrl = `${Utils.getBaseUrl(this.props.webId) + folder}/`;
    await StorageBackend.createAppFolders(this.props.webId, folder).then(
      created => {
        if (created) {
          this.props.handleUpdateApplicationsFolder(folderUrl);
          this.props.handleUpdateChooseFolderDialogState(false);
        } else {
          toast.error('Error creating app folders, try again.', {
            position: toast.POSITION.TOP_RIGHT,
            autoClose: 5000
          });
        }
      }
    );

    this.setApplicationLoaderStatus(false);
  }

  async handleFolderCopy() {
    this.setApplicationLoaderStatus(true);

    const { currentApplicationsFolder } = this.props;

    const folderSelected =
      this.state.folderTitle === undefined
        ? this.state.defaultFolderTitle
        : this.state.folderTitle;
    const folder = Utils.trimSlashes(folderSelected);
    if (!Utils.isValidFolder(`/${folder}/`)) {
      toast.error('Enter a valid folder path!', {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 5000
      });

      this.setApplicationLoaderStatus(false);
      return;
    }
    const folderUrl = `${Utils.getBaseUrl(this.props.webId) + folder}`;

    await StorageBackend.createAppFolderForCopying(
      this.props.webId,
      folder
    ).then(created => {
      if (created) {
        StorageBackend.deepCopy(currentApplicationsFolder, folderUrl).then(
          () => {
            Log.info(`Copied ${currentApplicationsFolder} to ${folderUrl}.`);
            this.props.handleUpdateApplicationsFolder(folderUrl);
            this.props.handleUpdateChooseFolderDialogState(false);
          },
          err => Log.err(err)
        );
      } else {
        toast.error('Error creating app folders, try again.', {
          position: toast.POSITION.TOP_RIGHT,
          autoClose: 5000
        });
      }
    });

    this.setApplicationLoaderStatus(false);
  }

  async handleFolderConfirm() {
    this.setApplicationLoaderStatus(true);

    const folderSelected =
      this.state.folderTitle === undefined
        ? this.state.defaultFolderTitle
        : this.state.folderTitle;
    const folder = Utils.trimSlashes(folderSelected);
    if (!Utils.isValidFolder(`/${folder}/`)) {
      toast.error('Enter a valid folder path!', {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 5000
      });

      this.setApplicationLoaderStatus(false);
      return;
    }
    const folderUrl = `${Utils.getBaseUrl(this.props.webId) + folder}`;
    await StorageBackend.createAppFolders(this.props.webId, folder).then(
      created => {
        if (created) {
          this.props.handleUpdateApplicationsFolder(folderUrl);
          this.props.handleUpdateChooseFolderDialogState(false);
        } else {
          toast.error('Error creating app folders, try again.', {
            position: toast.POSITION.TOP_RIGHT,
            autoClose: 5000
          });
        }
      }
    );

    this.setApplicationLoaderStatus(false);
  }

  render() {
    const { loadingIsActive } = this.state;
    return (
      <div>
        <Dialog
          open={this.props.chooseFolderDialogIsOpen}
          onClose={this.handleClose}
          aria-labelledby="form-dialog-title"
        >
          <LoadingOverlay active={loadingIsActive} spinner>
            <DialogTitle id="form-dialog-title">Choose your folder</DialogTitle>
            <DialogContent>
              <DialogContentText>
                Choose the folder in your Personal Storage Space where
                LinkedPipes Applications Storage is going to store your
                published applications and configuration. Press `New`, to simply
                create a new folder.
              </DialogContentText>
              <TextField
                autoFocus
                margin="dense"
                value={this.state.folderTitle}
                onChange={this.handleChangeFolderTitle}
                id="name"
                label="Storage folder title"
                fullWidth
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={this.handleClose} color="primary">
                Cancel
              </Button>
              {/* <Button onClick={this.handleFolderMove} color="primary">
                Move
              </Button>
              <Button onClick={this.handleFolderCopy} color="primary">
                Copy
              </Button> */}
              <Button onClick={this.handleFolderConfirm} color="primary">
                New
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
    chooseFolderDialogIsOpen: state.globals.chooseFolderDialogIsOpen
  };
};

const mapDispatchToProps = dispatch => {
  const handleUpdateChooseFolderDialogState = state =>
    dispatch(globalActions.setChooseFolderDialogState({ state }));

  const handleUpdateApplicationsFolder = value =>
    dispatch(userActions.updateApplicationsFolder({ value }));

  return {
    handleUpdateChooseFolderDialogState,
    handleUpdateApplicationsFolder
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(StoragePickFolderDialog);
