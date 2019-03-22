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
import DialogTitle from '@material-ui/core/DialogTitle';
import withMobileDialog from '@material-ui/core/withMobileDialog';

type Props = {
  checkedPublished?: boolean,
  classes: { root: {}, header: {} },
  onRefreshSwitchChange?: (event: {}, checked: boolean) => void,
  headerParams: { title: string, subtitle?: string },
  onTitleChange?: (event: {}) => void,
  handlePublishClicked: Function,
  handleAppTitleChanged: Function,
  publishDialogOpen: boolean,
  handleClosePublishDialog: Function,
  handleProceedToApplicationClicked: Function,
  fullScreen: any
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
  fullScreen
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
        {'Your Application has been published!'}
      </DialogTitle>
      <DialogContent>
        <DialogContentText>
          Click `Browse` to proceed to Application Browser, edit and share your
          applications.
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={handleProceedToApplicationClicked}
          color="primary"
          autoFocus
        >
          Proceed
        </Button>
      </DialogActions>
    </Dialog>
  </div>
);

export default withMobileDialog()(
  withStyles(styles)(VisualizerControllerHeaderComponent)
);
