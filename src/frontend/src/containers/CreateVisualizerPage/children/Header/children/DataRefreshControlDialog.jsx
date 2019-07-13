// @flow
import React, { PureComponent } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  Grid,
  TextField,
  MenuItem,
  DialogActions,
  Button,
  Container
} from '@material-ui/core';
import { withStyles } from '@material-ui/styles';

type Props = {
  dataRefreshDialogOpen: Boolean,
  classes: { dataRefreshTextField: {}, menu: {} },
  selectedDataRefreshInterval: { type: string, value: string },
  handleDataRefreshValueChange: Function,
  handleDataRefreshTypeChange: Function,
  handleDataRefreshDismissed: Function,
  handleDataRefreshConfirmed: Function,
  handleDataRefreshToggleClicked: Function,
  selectedPipelineExecution: Object
};

const styles = () => ({
  menu: {
    width: '100%'
  }
});

class DataRefreshControlDialog extends PureComponent<Props> {
  render() {
    const {
      dataRefreshDialogOpen,
      classes,
      selectedDataRefreshInterval,
      handleDataRefreshValueChange,
      handleDataRefreshTypeChange,
      handleDataRefreshDismissed,
      handleDataRefreshConfirmed,
      handleDataRefreshToggleClicked,
      selectedPipelineExecution
    } = this.props;

    return (
      <Container maxWidth="lg">
        <Dialog
          open={dataRefreshDialogOpen}
          aria-labelledby="responsive-dialog-title"
        >
          <DialogTitle id="delete-responsive-dialog-title">
            Data refresh
          </DialogTitle>
          <DialogContent>
            <DialogContentText>
              Configure whether application`s data needs to be refreshed within
              a certain time interval...
            </DialogContentText>
          </DialogContent>
          <Grid
            container
            direction="row"
            spacing={2}
            justify="center"
            alignItems="center"
          >
            <Grid item xs={12} sm={6}>
              <TextField
                label="Duration"
                type="number"
                fullWidth
                value={selectedDataRefreshInterval.value}
                onChange={handleDataRefreshValueChange}
                variant="outlined"
              />
            </Grid>
            <Grid item xs={6} sm={3}>
              <TextField
                id="outlined-select-currency"
                select
                label="Select"
                fullWidth
                value={selectedDataRefreshInterval.type}
                onChange={handleDataRefreshTypeChange}
                SelectProps={{
                  MenuProps: {
                    className: classes.menu
                  }
                }}
                variant="outlined"
              >
                <MenuItem value="Hours">{`Hour${
                  selectedDataRefreshInterval.value === '1' ? '' : 's'
                }`}</MenuItem>
                <MenuItem value="Days">{`Day${
                  selectedDataRefreshInterval.value === '1' ? '' : 's'
                }`}</MenuItem>
                <MenuItem value="Weeks">{`Week${
                  selectedDataRefreshInterval.value === '1' ? '' : 's'
                }`}</MenuItem>
              </TextField>
            </Grid>
          </Grid>
          <DialogContent />

          <DialogActions>
            <Button
              onClick={handleDataRefreshDismissed}
              color="primary"
              autoFocus
            >
              Close
            </Button>
            <Button
              onClick={handleDataRefreshToggleClicked}
              color="primary"
              autoFocus
            >
              {selectedPipelineExecution !== undefined &&
              selectedPipelineExecution.scheduleOn
                ? 'Disable'
                : 'Enable'}
            </Button>
            <Button
              onClick={handleDataRefreshConfirmed}
              disabled={selectedDataRefreshInterval.value === ''}
              color="primary"
              autoFocus
            >
              Update
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    );
  }
}

export default withStyles(styles)(DataRefreshControlDialog);
