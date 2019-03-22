// @flow
import React, { PureComponent } from 'react';
import { withStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
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
import { StorageToolbox } from '@utils';

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
  textValue: string
};

class StorageAppsBrowserCard extends PureComponent<Props, State> {
  state = {
    open: false,
    textValue: ''
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

  handleShare = () => {
    this.setState({ open: false });
    StorageToolbox.shareApp(
      this.props.singleTileData.applicationIri,
      this.state.textValue
    );
  };

  render() {
    const { classes, singleTileData } = this.props;
    return (
      <GridListTile>
        <Card className={classes.card}>
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
          <CardActions classes={{ root: classes.root }}>
            <Link
              to={{
                pathname: `/map?applicationIri=${singleTileData.applicationIri}`
              }}
              target="_blank"
            >
              <Button size="small" color="primary">
                Open
              </Button>
            </Link>
            <Button size="small" color="primary" onClick={this.handleClickOpen}>
              Share
            </Button>
          </CardActions>
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
