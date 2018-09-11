import React from "react";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import connect from "react-redux/lib/connect/connect";
import {
  showDatasourcesDialog,
  hideDatasourcesDialog
} from "../actions/dialogs";
import { addSource } from "../actions/datasources";

class AddDatasourceDialog extends React.Component {
  state = {
    name: "",
    url: ""
  };

  handleClickOpen = () => {
    this.props.dispatch(showDatasourcesDialog());
  };

  handleClose = () => {
    this.props.dispatch(hideDatasourcesDialog());
  };

  handleAddDatasource = () => {
    const name = this.state.name;
    const url = this.state.url;

    this.props.dispatch(addSource({ name: name, url: url }));
    this.props.dispatch(hideDatasourcesDialog());
  };

  render() {
    const { isVisible } = this.props;

    return (
      <div>
        <Dialog
          open={isVisible}
          onClose={this.handleClose}
          aria-labelledby="form-dialog-title"
        >
          <DialogTitle id="form-dialog-title">Add new data source</DialogTitle>
          <DialogContent>
            <TextField
              value={this.state.name}
              onChange={e => this.setState({ name: e.target.value })}
              autoFocus
              margin="dense"
              id="name"
              label="Title"
              fullWidth
            />
            <TextField
              value={this.state.url}
              onChange={e => this.setState({ url: e.target.value })}
              margin="dense"
              id="name"
              label="URL"
              fullWidth
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleClose} color="primary">
              Cancel
            </Button>
            <Button onClick={this.handleAddDatasource} color="primary">
              Add
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    isVisible: state.dialogs
  };
};

export default connect(mapStateToProps)(AddDatasourceDialog);
