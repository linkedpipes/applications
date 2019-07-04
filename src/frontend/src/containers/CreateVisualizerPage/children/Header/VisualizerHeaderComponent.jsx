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
import { Container } from '@material-ui/core';

type Props = {
  classes: {
    root: {},
    header: {},
    textField: {},
    heroContent: {},
    heroButtons: {}
  },
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

  heroContent: {
    backgroundColor: theme.palette.background.paper,
    padding: theme.spacing(8, 0, 6)
  },

  textField: {
    flexGrow: 1,
    width: '100%',
    fontSize: 40,
    marginTop: '1rem'
  },
  button: {
    margin: theme.spacing(1)
  },

  heroButtons: {
    marginTop: theme.spacing(4)
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
  <React.Fragment>
    <Paper
      elevation={2}
      className={classes.heroContent}
      position="static"
      color="default"
    >
      <Container maxWidth="lg">
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
          align="center"
          placeholder="Enter your application title..."
          onChange={handleAppTitleChanged}
          margin="dense"
          gutterBottom
        />
        <Typography align="center" variant="h6" color="textSecondary">
          {selectedVisualizer
            ? `This is a LinkedPipes Application based on ${GlobalUtils.getBeautifiedVisualizerTitle(
                selectedVisualizer.visualizer.visualizerCode
              )} visualizer`
            : 'Unkown visualizer type'}
        </Typography>
        <div className={classes.heroButtons}>
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
        </div>
      </Container>
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
  </React.Fragment>
);

export default withStyles(styles)(VisualizerHeaderComponent);
