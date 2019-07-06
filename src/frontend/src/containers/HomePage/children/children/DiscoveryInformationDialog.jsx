// @flow
import React, { PureComponent } from 'react';
import { withStyles } from '@material-ui/core/styles';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
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
    padding: theme.spacing(4),
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
          <Typography variant="subtitle1" style={{ display: 'inline' }}>
            SPARQL IRI:
          </Typography>{' '}
          <Typography variant="body1">
            {selectedValue.sparqlEndpointIri
              ? selectedValue.sparqlEndpointIri
              : 'N/A'}
          </Typography>
          <br />
          <Typography variant="subtitle1" style={{ display: 'inline' }}>
            Data sample IRI:
          </Typography>{' '}
          <Typography variant="body1">
            {selectedValue.dataSampleIri ? selectedValue.dataSampleIri : 'N/A'}
          </Typography>
          <br />
          <Typography variant="subtitle1" style={{ display: 'inline' }}>
            Named Graph IRIs:
          </Typography>{' '}
          <Typography variant="body1">
            {selectedValue.namedGraphs
              ? selectedValue.namedGraphs.join(',\n')
              : 'N/A'}
          </Typography>
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
