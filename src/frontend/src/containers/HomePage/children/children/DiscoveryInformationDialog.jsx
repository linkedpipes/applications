// @flow
import React, { PureComponent } from 'react';
import { withStyles } from '@material-ui/core/styles';
import DialogTitle from '@material-ui/core/DialogTitle';
import Dialog from '@material-ui/core/Dialog';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
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
        <Paper className={classes.paper}>
          <Grid container spacing={16}>
            <Grid item>
              <Typography align="left">{`SPARQL IRI: ${
                selectedValue.sparqlEndpointIri
              }`}</Typography>
            </Grid>
            <Grid item>
              <Typography align="left">{`Data sample IRI: ${
                selectedValue.dataSampleIri
              }`}</Typography>
            </Grid>
            <Grid item>
              <Typography align="left">{`Named Graph IRI: ${
                selectedValue.namedGraph
              }`}</Typography>
            </Grid>
          </Grid>
        </Paper>
        <div />
      </Dialog>
    );
  }
}

export default withStyles(styles)(DiscoveryInformationDialog);
