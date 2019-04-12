// @flow
import * as React from 'react';
import {
  Dialog,
  Button,
  DialogActions,
  DialogContent,
  DialogContentText,
  Grid,
  TextField,
  DialogTitle,
  Paper,
  withMobileDialog,
  InputBase,
  Typography,
  withStyles
} from '@material-ui/core';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { getBeautifiedVisualizerTitle } from '@utils';

type Props = {
  classes: { root: {}, header: {}, textField: {} },
  headerParams: { title: string, subtitle?: string },
  handlePublishClicked: Function,
  handleAppTitleChanged: Function,
  publishDialogOpen: boolean,
  handleClosePublishDialog: Function,
  handleProceedToApplicationClicked: Function,
  handleCopyLinkClicked: Function,
  fullScreen: any,
  appIri: string,
  selectedVisualizer: Object,
  selectedApplicationTitle: string
};

const styles = theme => ({
  root: {
    flexGrow: 1
  },
  header: {
    marginBottom: '1rem',
    marginTop: '1rem',
    padding: `${theme.spacing.unit * 2}px ${theme.spacing.unit * 3}px ${theme
      .spacing.unit * 3}px`
  },
  textField: {
    flexGrow: 1,
    width: '100%',
    fontSize: 30
  },
  button: {
    margin: theme.spacing.unit
  }
});

const VisualizerControllerHeaderComponent = ({
  classes,
  handlePublishClicked,
  handleAppTitleChanged,
  publishDialogOpen,
  handleClosePublishDialog,
  handleProceedToApplicationClicked,
  handleCopyLinkClicked,
  fullScreen,
  selectedApplicationTitle,
  selectedVisualizer,
  appIri
}: Props) => (
  <div className={classes.root}>
    <Paper className={classes.header} position="static" color="default">
      <Grid
        container
        direction="column"
        spacing={16}
        justify="center"
        alignItems="center"
      >
        <Grid
          item
          xs={12}
          container
          direction="column"
          justify="center"
          alignItems="stretch"
        >
          <Grid item xs>
            <InputBase
              label="App title"
              inputProps={{
                style: { textAlign: 'center' }
              }}
              value={selectedApplicationTitle}
              className={classes.textField}
              variant="outlined"
              id="application-title-field"
              placeholder="Enter your application title..."
              onChange={handleAppTitleChanged}
              margin="normal"
            />
          </Grid>
          <Grid item>
            <Typography align="center" variant="h6">
              {selectedVisualizer
                ? getBeautifiedVisualizerTitle(
                    selectedVisualizer.visualizer.visualizerCode
                  )
                : 'Unkown visualizer type'}
            </Typography>
          </Grid>
        </Grid>
        <Grid container spacing={16} justify="center">
          <Grid item>
            <Button
              id="create-app-publish-button"
              variant="contained"
              color="primary"
              onClick={handlePublishClicked}
            >
              Publish
            </Button>
          </Grid>
          <Grid item>
            <Button
              variant="outlined"
              color="primary"
              onClick={handlePublishClicked}
            >
              Embed
            </Button>
          </Grid>
        </Grid>
      </Grid>
    </Paper>
    <Dialog
      fullScreen={fullScreen}
      open={publishDialogOpen}
      onClose={handleClosePublishDialog}
      aria-labelledby="responsive-dialog-title"
    >
      <DialogTitle id="responsive-dialog-title">
        {'Your Application has been Published!'}
      </DialogTitle>
      <DialogContent>
        <DialogContentText>
          Click `Browse Published Apps` to proceed to Application Browser, edit
          and share your applications. Click on the field with link to copy the
          public view URL to your clipboard.
        </DialogContentText>
      </DialogContent>
      <DialogContent>
        <CopyToClipboard text={appIri} onCopy={handleCopyLinkClicked}>
          <TextField
            color="primary"
            label="Click to copy"
            variant="outlined"
            fullWidth
            value={appIri}
            autoFocus
            style={{
              textDecoration: 'none'
            }}
          />
        </CopyToClipboard>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClosePublishDialog} color="primary" autoFocus>
          Close
        </Button>
        <Button
          onClick={handleProceedToApplicationClicked}
          color="primary"
          id="browse-published-button"
          autoFocus
        >
          Browse Published Apps
        </Button>
      </DialogActions>
    </Dialog>
  </div>
);

export default withMobileDialog()(
  withStyles(styles)(VisualizerControllerHeaderComponent)
);
