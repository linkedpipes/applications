// @flow
import React, { PureComponent } from 'react';
import { withStyles } from '@material-ui/core/styles';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import Dialog from '@material-ui/core/Dialog';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import blue from '@material-ui/core/colors/blue';

const styles = theme => ({
  avatar: {
    backgroundColor: blue[100],
    color: blue[600]
  },
  paper: {
    padding: theme.spacing.unit * 4,
    textAlign: 'center',
    color: theme.palette.text.secondary
  }
});

type Props = {
  classes: Object,
  onClose: Function,
  selectedValue: Object
};

class DiscoveryInformationDialog extends PureComponent<Props> {
  handleClose = () => {
    this.props.onClose(this.props.selectedValue);
  };

  handleListItemClick = value => {
    this.props.onClose(value);
  };

  render() {
    const { classes, onClose, selectedValue, ...other } = this.props;

    return (
      <Dialog
        onClose={this.handleClose}
        aria-labelledby="simple-dialog-title"
        {...other}
      >
        <DialogTitle id="simple-dialog-title">
          Discovery Execution Info
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            <Typography component={'span'} align="left">{`SPARQL IRI: ${
              selectedValue.sparqlEndpointIri
            }`}</Typography>
            <Typography component={'span'} align="left">{`Data sample IRI: ${
              selectedValue.dataSampleIri
            }`}</Typography>
            <Typography component={'span'} align="left">{`Named Graph IRI: ${
              selectedValue.namedGraph
            }`}</Typography>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={this.handleClose} color="primary" autoFocus>
            Close
          </Button>
        </DialogActions>
        <div />
      </Dialog>
    );
  }
}

export default withStyles(styles)(DiscoveryInformationDialog);
