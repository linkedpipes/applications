// @flow
import * as React from 'react';
import Dialog from '@material-ui/core/Dialog';
import Button from '@material-ui/core/Button';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import DialogTitle from '@material-ui/core/DialogTitle';
import Paper from '@material-ui/core/Paper';
import InputBase from '@material-ui/core/InputBase';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';
import InputAdornment from '@material-ui/core/InputAdornment';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { GlobalUtils } from '@utils';

type Props = {
  classes: { root: {}, header: {}, textField: {} },
  handlePublishClicked: Function,
  handleEmbedClicked: Function,
  handleAppTitleChanged: Function,
  publishDialogOpen: boolean,
  embedDialogOpen: boolean,
  handleClosePublishDialog: Function,
  handleCloseEmbedDialog: Function,
  handleProceedToApplicationClicked: Function,
  handleCopyLinkClicked: Function,
  appIri: string,
  selectedVisualizer: Object,
  selectedApplicationTitle: string,
  handleChangeHeight: Function,
  handleChangeWidth: Function,
  height: number,
  width: number
};

const styles = theme => ({
  root: {},
  header: {
    marginBottom: '1rem',
    marginTop: '1rem',
    padding: `${theme.spacing(2)}px ${theme.spacing(3)}px ${theme.spacing(3)}px`
  },
  textField: {
    flexGrow: 1,
    width: '100%',
    fontSize: 30,
    marginTop: '1rem'
  },
  button: {
    margin: theme.spacing(1)
  }
});

const VisualizerHeaderComponent = ({
  classes,
  handlePublishClicked,
  handleEmbedClicked,
  handleAppTitleChanged,
  publishDialogOpen,
  embedDialogOpen,
  handleClosePublishDialog,
  handleCloseEmbedDialog,
  handleProceedToApplicationClicked,
  handleCopyLinkClicked,
  selectedApplicationTitle,
  selectedVisualizer,
  appIri,
  height,
  width,
  handleChangeHeight,
  handleChangeWidth
}: Props) => (
  <div className={classes.root}>
    <Paper
      elevation={2}
      className={classes.header}
      position="static"
      color="default"
    >
      <Grid
        container
        direction="column"
        spacing={2}
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
              autoComplete="off"
              placeholder="Enter your application title..."
              onChange={handleAppTitleChanged}
              margin="dense"
            />
          </Grid>
          <Grid item>
            <Typography align="center" variant="h6">
              {selectedVisualizer
                ? GlobalUtils.getBeautifiedVisualizerTitle(
                    selectedVisualizer.visualizer.visualizerCode
                  )
                : 'Unkown visualizer type'}
            </Typography>
          </Grid>
        </Grid>
        <Grid container spacing={2} justify="center">
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
              onClick={handleEmbedClicked}
            >
              Embed
            </Button>
          </Grid>
        </Grid>
      </Grid>
    </Paper>
    <Dialog
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
            className={classes.textField}
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

    <Dialog
      open={embedDialogOpen}
      onClose={handleCloseEmbedDialog}
      aria-labelledby="responsive-dialog-title"
    >
      <DialogTitle id="responsive-dialog-title">
        {'Application published and ready to be embedded'}
      </DialogTitle>
      <DialogContent>
        <DialogContentText>
          Here is the code needed to embed the visualization into another
          website
        </DialogContentText>
      </DialogContent>
      <DialogContent>
        <TextField
          id="height-input"
          style={{
            textDecoration: 'none'
          }}
          className={classes.textField}
          variant="outlined"
          label="Height"
          value={height}
          onChange={handleChangeHeight}
          InputProps={{
            endAdornment: <InputAdornment position="end">px</InputAdornment>
          }}
        />
        <TextField
          id="width-input"
          style={{
            textDecoration: 'none'
          }}
          className={classes.textField}
          variant="outlined"
          label="Width"
          value={width}
          onChange={handleChangeWidth}
          InputProps={{
            endAdornment: <InputAdornment position="end">px</InputAdornment>
          }}
        />
        <CopyToClipboard
          text={`<iframe src="${appIri}" height="${height}" width="${width}"></iframe>`}
          onCopy={handleCopyLinkClicked}
        >
          <TextField
            color="primary"
            label="Click to copy"
            variant="outlined"
            fullWidth
            className={classes.textField}
            value={`<iframe src="${appIri}" height="${height}" width="${width}></iframe>`}
            autoFocus
            style={{
              textDecoration: 'none'
            }}
          />
        </CopyToClipboard>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCloseEmbedDialog} color="primary" autoFocus>
          Close
        </Button>
      </DialogActions>
    </Dialog>
  </div>
);

export default withStyles(styles)(VisualizerHeaderComponent);
