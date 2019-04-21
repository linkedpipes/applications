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
import { withWebId } from '@utils';

type Props = {
  handleUpdateChooseFolderDialogState: Function,
  handleUpdateApplicationsFolder: Function,
  chooseFolderDialogIsOpen: boolean,
  webId: string
};

type State = {
  folderTitle: any,
  defaultFolderTitle: string
};

class StoragePickFolderDialog extends PureComponent<Props, State> {
  state = {
    folderTitle: undefined,
    defaultFolderTitle: 'linkedpipes'
  };

  constructor(props) {
    super(props);
    this.handleFolderConfirm = this.handleFolderConfirm.bind(this);
  }

  handleClickOpen = () => {
    this.props.handleUpdateChooseFolderDialogState(true);
  };

  handleClose = () => {};

  handleChangeFolderTitle = event => {
    this.setState({ folderTitle: event.target.value });
  };

  handleFolderConfirm: () => void;

  async handleFolderConfirm() {
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
      return;
    }
    const folderUrl = `${Utils.getBaseUrl(this.props.webId) + folder}/`;
    await StorageBackend.createAppFolders(this.props.webId, folderUrl).then(
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
  }

  render() {
    return (
      <div>
        <Dialog
          open={this.props.chooseFolderDialogIsOpen}
          onClose={this.handleClose}
          aria-labelledby="form-dialog-title"
        >
          <DialogTitle id="form-dialog-title">Choose your folder</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Choose the title of the folder where LinkedPipes Applications
              Storage is going to store your published applications and
              configuration. Or press continue to stick to the default title.
            </DialogContentText>
            <TextField
              autoFocus
              margin="dense"
              value={this.state.folderTitle}
              defaultValue={this.state.defaultFolderTitle}
              onChange={this.handleChangeFolderTitle}
              id="name"
              label="Storage folder title"
              fullWidth
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleFolderConfirm} color="primary">
              Choose title
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
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

export default withWebId(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(StoragePickFolderDialog)
);
