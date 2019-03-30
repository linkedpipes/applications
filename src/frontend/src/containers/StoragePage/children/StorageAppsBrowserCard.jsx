// @flow
import React, { PureComponent } from 'react';
import { withStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import Button from '@material-ui/core/Button';
import GridListTile from '@material-ui/core/GridListTile';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { VisualizerIcon } from '@components';
import { VISUALIZER_TYPE } from '@constants';
import { Link } from 'react-router-dom';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import { StorageToolbox } from '@utils';
import IconButton from '@material-ui/core/IconButton';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import { toast } from 'react-toastify';

const styles = {
  root: {
    justifyContent: 'center'
  },
  card: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column'
  },
  cardContent: {
    flexGrow: 1
  },
  media: {
    objectFit: 'cover'
  }
};

type Props = {
  classes: {
    root: {},
    card: {},
    cardContent: {},
    media: {}
  },
  singleTileData: {
    applicationTitle: string,
    applicationIri: string,
    author: {}
  }
};

type State = {
  open: boolean,
  textValue: string,
  anchorEl: any
};

class StorageAppsBrowserCard extends PureComponent<Props, State> {
  state = {
    open: false,
    textValue: '',
    anchorEl: undefined
  };

  handleClickOpen = () => {
    this.setState({ open: true });
  };

  handleClose = () => {
    this.setState({ open: false });
  };

  handleChange = e => {
    const textValue = e.target.value;
    this.setState({ textValue });
  };

  handleMenuClick = event => {
    this.setState({ anchorEl: event.currentTarget });
  };

  handleDeleteApp = () => {
    const applicationIri = this.props.singleTileData.applicationIri;
    StorageToolbox.removeAppFromStorage(applicationIri).then(error => {
      if (!error) {
        this.setState({ anchorEl: null });
        toast.success('Deleted application!', {
          position: toast.POSITION.TOP_RIGHT,
          autoClose: 2000
        });
      } else {
        toast.error('Error! Unable to delete published application!', {
          position: toast.POSITION.TOP_RIGHT,
          autoClose: 2000
        });
      }
    });
  };

  handleMenuClose = () => {
    this.setState({ anchorEl: null });
  };

  handleShare = () => {
    this.setState({ open: false });
    StorageToolbox.shareApp(
      this.props.singleTileData.applicationIri,
      this.state.textValue
    );
  };

  render() {
    const { classes, singleTileData } = this.props;
    const { anchorEl } = this.state;
    const { handleMenuClick, handleMenuClose, handleDeleteApp } = this;
    return (
      <GridListTile>
        <Card className={classes.card}>
          <CardHeader
            action={
              <IconButton
                aria-owns={anchorEl ? 'simple-menu' : undefined}
                aria-haspopup="true"
                onClick={handleMenuClick}
              >
                <MoreVertIcon />
              </IconButton>
            }
          />
          <Menu
            id="simple-menu"
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={this.handleMenuClose}
          >
            <MenuItem onClick={handleMenuClose}>Share</MenuItem>
            <MenuItem onClick={handleMenuClose}>Rename</MenuItem>
            <MenuItem onClick={handleDeleteApp}>Delete</MenuItem>
          </Menu>
          <CardActionArea style={{ textAlign: 'center' }}>
            <VisualizerIcon
              visualizerType={VISUALIZER_TYPE.MAP}
              style={{ color: 'white', fontSize: '75px' }}
            />
            <CardContent className={classes.cardContent}>
              <Typography gutterBottom variant="h5" component="h2">
                {singleTileData.applicationTitle}
              </Typography>
              <Typography component="p">{singleTileData.author}</Typography>
            </CardContent>
          </CardActionArea>
        </Card>
        <Dialog
          open={this.state.open}
          onClose={this.handleClose}
          aria-labelledby="form-dialog-title"
        >
          <DialogTitle id="form-dialog-title">Subscribe</DialogTitle>
          <DialogContent>
            <DialogContentText>
              To share the application with someone, you need to provide his
              WebID.
            </DialogContentText>
            <TextField
              autoFocus
              margin="dense"
              onChange={this.handleChange}
              id="name"
              label="WebID"
              fullWidth
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleClose} color="primary">
              Cancel
            </Button>
            <Button onClick={this.handleShare} color="primary">
              Share
            </Button>
          </DialogActions>
        </Dialog>
      </GridListTile>
    );
  }
}

export default withStyles(styles)(StorageAppsBrowserCard);
