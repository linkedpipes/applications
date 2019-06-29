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
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import { withStyles } from '@material-ui/core/styles';
import InputAdornment from '@material-ui/core/InputAdornment';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { GlobalUtils } from '@utils';
import ApplicationMetadata from '@storage/models/ApplicationMetadata';
import ShareIcon from '@material-ui/icons/ShareTwoTone';
import SettingsIcon from '@material-ui/icons/SettingsTwoTone';
import EditIcon from '@material-ui/icons/EditTwoTone';
import { DataRefreshControlDialog } from './children';

type Props = {
  classes: {
    root: {},
    header: {},
    textField: {},
    leftIcon: {},
    margin: {},
    formControl: {},
    dataRefreshTextField: {},
    menu: {}
  },
  handlePublishClicked: Function,
  handleEmbedClicked: Function,
  handleAppTitleChanged: Function,
  publishDialogOpen: boolean,
  embedDialogOpen: boolean,
  handleClosePublishDialog: Function,
  handleCloseEmbedDialog: Function,
  handleCopyLinkClicked: Function,
  appIri: string,
  selectedVisualizer: Object,
  handleChangeHeight: Function,
  handleChangeWidth: Function,
  height: number,
  width: number,
  selectedApplicationMetadata: ApplicationMetadata,
  deleteAppDialogOpen: boolean,
  handleDeleteAppDismissed: Function,
  handleDeleteAppConfirmed: Function,
  handleDeleteAppClicked: Function,
  handleMenuClose: Function,
  handleSharingMenuClick: Function,
  handleSettingsMenuClick: Function,
  sharingAnchorEl: Object,
  settingsAnchorEl: Object,
  modifiedSelectedApplicationTitle: string,
  handleRenameFieldChanged: Function,
  handleOpenRenameDialog: Function,
  handleCloseRenameDialog: Function,
  handleRenameConfirmed: Function,
  handleOpenAccessControlDialog: Function,
  renameDialogOpen: boolean,
  handleDataRefreshConfirmed: Function,
  dataRefreshDialogOpen: boolean,
  handleDataRefreshValueChange: Function,
  handleDataRefreshToggleClicked: Function,
  selectedPipelineExecution: Object,
  handleDataRefreshClicked: Function,
  handleDataRefreshDismissed: Function,
  selectedDataRefreshInterval: Function,
  handleDataRefreshTypeChange: Function
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
  },

  leftIcon: {
    marginRight: theme.spacing(1)
  },

  dataRefreshTextField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1)
  },

  formControl: {
    margin: theme.spacing(1),
    minWidth: 120
  },

  menu: {
    width: 200
  }
});

const EditVisualizerHeaderComponent = ({
  classes,
  handlePublishClicked,
  handleEmbedClicked,
  handleAppTitleChanged,
  publishDialogOpen,
  embedDialogOpen,
  handleClosePublishDialog,
  handleCloseEmbedDialog,
  handleCopyLinkClicked,
  selectedVisualizer,
  appIri,
  height,
  width,
  handleChangeHeight,
  handleChangeWidth,
  selectedApplicationMetadata,
  deleteAppDialogOpen,
  handleDeleteAppDismissed,
  handleDeleteAppConfirmed,
  handleDeleteAppClicked,
  handleOpenAccessControlDialog,
  handleMenuClose,
  handleSharingMenuClick,
  handleSettingsMenuClick,
  sharingAnchorEl,
  settingsAnchorEl,
  modifiedSelectedApplicationTitle,
  handleRenameFieldChanged,
  handleOpenRenameDialog,
  handleCloseRenameDialog,
  handleRenameConfirmed,
  renameDialogOpen,
  handleDataRefreshClicked,
  handleDataRefreshConfirmed,
  dataRefreshDialogOpen,
  handleDataRefreshDismissed,
  selectedDataRefreshInterval,
  handleDataRefreshTypeChange,
  handleDataRefreshValueChange,
  handleDataRefreshToggleClicked,
  selectedPipelineExecution
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
              value={selectedApplicationMetadata.configuration.title}
              className={classes.textField}
              readOnly
              variant="outlined"
              id="edit-application-title-field"
              placeholder="Enter your application title..."
              onChange={handleAppTitleChanged}
              margin="dense"
            />
          </Grid>
          <Grid item>
            <Typography align="center" variant="h6">
              {selectedVisualizer
                ? GlobalUtils.getBeautifiedVisualizerTitle(
                    selectedApplicationMetadata.configuration.endpoint
                  )
                : 'Unkown visualizer type'}
            </Typography>
          </Grid>
        </Grid>
        <Grid container spacing={2} justify="center">
          <Grid item>
            <Button
              id="edit-app-publish-button"
              variant="outlined"
              color="primary"
              onClick={handleOpenRenameDialog}
            >
              <EditIcon className={classes.leftIcon} />
              Rename
            </Button>
          </Grid>
          <Grid item>
            <Button
              variant="outlined"
              color="primary"
              onClick={handleSharingMenuClick}
            >
              <ShareIcon className={classes.leftIcon} />
              Share
            </Button>
          </Grid>
          <Grid item>
            <Button
              variant="outlined"
              color="primary"
              onClick={handleSettingsMenuClick}
            >
              <SettingsIcon className={classes.leftIcon} />
              Settings
            </Button>
          </Grid>
        </Grid>
      </Grid>
    </Paper>

    <Menu
      id="simple-menu"
      anchorEl={sharingAnchorEl}
      open={Boolean(sharingAnchorEl)}
      onClose={handleMenuClose}
    >
      <MenuItem onClick={handlePublishClicked}>Get Published URL</MenuItem>
      <MenuItem onClick={handleEmbedClicked}>Get Embed URL</MenuItem>
      <MenuItem onClick={handleOpenAccessControlDialog}>
        Access control
      </MenuItem>
    </Menu>

    <Menu
      id="simple-menu"
      anchorEl={settingsAnchorEl}
      open={Boolean(settingsAnchorEl)}
      onClose={handleMenuClose}
    >
      <MenuItem onClick={handleDataRefreshClicked}>
        Setup Data Refreshing
      </MenuItem>
      <MenuItem onClick={handleDeleteAppClicked}>Delete Application</MenuItem>
    </Menu>

    <Dialog
      open={deleteAppDialogOpen}
      aria-labelledby="responsive-dialog-title"
    >
      <DialogTitle id="delete-responsive-dialog-title">
        {'Are you sure you want to unpublish and delete the application?'}
      </DialogTitle>
      <DialogActions>
        <Button onClick={handleDeleteAppDismissed} color="primary" autoFocus>
          No
        </Button>
        <Button onClick={handleDeleteAppConfirmed} color="primary" autoFocus>
          Yes
        </Button>
      </DialogActions>
    </Dialog>

    <Dialog
      open={renameDialogOpen}
      onClose={handleCloseRenameDialog}
      aria-labelledby="responsive-dialog-title"
    >
      <DialogTitle id="responsive-dialog-title">
        {'Provide a new title for your application!'}
      </DialogTitle>
      <DialogContent>
        <DialogContentText>
          Modify the title and hit Rename button. Click cancel to close the
          dialog and revert changes.
        </DialogContentText>
      </DialogContent>
      <DialogContent>
        <TextField
          className={classes.textField}
          color="primary"
          label="Application title"
          autoComplete="off"
          variant="outlined"
          fullWidth
          value={modifiedSelectedApplicationTitle}
          onChange={handleRenameFieldChanged}
          autoFocus
          style={{
            textDecoration: 'none'
          }}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCloseRenameDialog} color="primary" autoFocus>
          Close
        </Button>
        <Button onClick={handleRenameConfirmed} color="primary" autoFocus>
          Rename
        </Button>
      </DialogActions>
    </Dialog>

    <Dialog
      open={publishDialogOpen}
      onClose={handleClosePublishDialog}
      aria-labelledby="responsive-dialog-title"
    >
      <DialogTitle id="responsive-dialog-title">
        {'Copy and share your application with the world!'}
      </DialogTitle>
      <DialogContent>
        <DialogContentText>
          Click on the field with link to copy the public view URL to your
          clipboard.
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
      </DialogActions>
    </Dialog>

    <Dialog
      open={embedDialogOpen}
      onClose={handleCloseEmbedDialog}
      aria-labelledby="responsive-dialog-title"
    >
      <DialogTitle id="responsive-dialog-title">
        {'Generate an embed URL'}
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

    <DataRefreshControlDialog
      handleDataRefreshClicked={handleDataRefreshClicked}
      handleDataRefreshConfirmed={handleDataRefreshConfirmed}
      dataRefreshDialogOpen={dataRefreshDialogOpen}
      handleDataRefreshDismissed={handleDataRefreshDismissed}
      selectedDataRefreshInterval={selectedDataRefreshInterval}
      handleDataRefreshTypeChange={handleDataRefreshTypeChange}
      handleDataRefreshValueChange={handleDataRefreshValueChange}
      handleDataRefreshToggleClicked={handleDataRefreshToggleClicked}
      selectedPipelineExecution={selectedPipelineExecution}
    />
  </div>
);

export default withStyles(styles)(EditVisualizerHeaderComponent);
