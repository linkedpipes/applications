// @flow
import * as React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Labels from './VisualizerControllerLabelsComponent';
import Toolbox from './VisualizerControllerToolboxComponent';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Dialog from '@material-ui/core/Dialog';
import Button from '@material-ui/core/Button';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import DialogTitle from '@material-ui/core/DialogTitle';
import withMobileDialog from '@material-ui/core/withMobileDialog';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { CssBaseline } from '@material-ui/core';

type Props = {
  classes: { root: {}, header: {}, textField: {} },
  headerParams: { title: string, subtitle?: string },
  onTitleChange?: (event: {}) => void,
  handlePublishClicked: Function,
  handleAppTitleChanged: Function,
  publishDialogOpen: boolean,
  handleClosePublishDialog: Function,
  handleProceedToApplicationClicked: Function,
  handleCopyLinkClicked: Function,
  fullScreen: any,
  appIri: string
};

const styles = () => ({
  root: {
    flex: 1,
    flexGrow: 1
  },
  header: {
    marginBottom: '1rem',
    marginLeft: '1rem',
    marginTop: '1rem',
    right: '-1rem'
  },

  textField: {
    flexGrow: 1
  }
});

const VisualizerControllerHeaderComponent = ({
  classes,
  handlePublishClicked,
  headerParams,
  handleAppTitleChanged,
  publishDialogOpen,
  handleClosePublishDialog,
  handleProceedToApplicationClicked,
  handleCopyLinkClicked,
  fullScreen,
  appIri
}: Props) => (
  <div className={classes.root}>
    <AppBar className={classes.header} position="static" color="default">
      <Toolbar>
        <Labels
          title={headerParams.title}
          subtitle={headerParams.subtitle}
          handleAppTitleChanged={handleAppTitleChanged}
        />
        <Toolbox handlePublishClicked={handlePublishClicked} />
      </Toolbar>
    </AppBar>
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
            onChange={{}}
            value={appIri}
            autoFocus
            style={{
              textDecoration: 'none'
            }}
          />
        </CopyToClipboard>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={handleProceedToApplicationClicked}
          color="primary"
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
