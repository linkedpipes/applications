import React from 'react';
import PropTypes from 'prop-types';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import LockIcon from '@material-ui/icons/LockOutlined';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import withStyles from '@material-ui/core/styles/withStyles';
import {
  AuthButton,
  LoggedIn,
  LoggedOut,
  Value,
  Image,
  List,
  Link,
  Label
} from '@solid/react';
import UploadFilePopup from './UploadFilePopup';

const styles = theme => ({
  main: {
    width: 'auto',
    display: 'block', // Fix IE 11 issue.
    marginLeft: theme.spacing.unit * 3,
    marginRight: theme.spacing.unit * 3,
    [theme.breakpoints.up(400 + theme.spacing.unit * 3 * 2)]: {
      width: 400,
      marginLeft: 'auto',
      marginRight: 'auto'
    }
  },
  paper: {
    marginTop: theme.spacing.unit * 8,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: `${theme.spacing.unit * 2}px ${theme.spacing.unit * 3}px ${theme
      .spacing.unit * 3}px`
  },
  avatar: {
    margin: theme.spacing.unit,
    backgroundColor: theme.palette.secondary.main
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing.unit
  },
  submit: {
    marginTop: theme.spacing.unit * 3
  }
});

let _interopRequireDefault = require('@babel/runtime/helpers/interopRequireDefault');
let _solidAuthClient = _interopRequireDefault(require('solid-auth-client'));

class StorageDashboard extends React.Component {
  state = {
    loggedIn: false
  };

  handleSolidLogin = e => {
    e.preventDefault();

    _solidAuthClient.default.popupLogin({
      popupUri: 'popup.html'
    });
  };

  handleLoginConfirmed = () => {
    this.setState({ loggedIn: true });
  };

  handleLogoutConfirmed = () => {
    this.setState({ loggedIn: false });
  };

  render() {
    const { classes } = this.props;
    const { loggedIn } = this.state;
    const self = this;
    return (
      <div className={classes.main}>
        <CssBaseline />
        <Paper className={classes.paper}>
          <Avatar className={classes.avatar}>
            <LockIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Welcome to LPApps Storage 😀
          </Typography>
          <form className={classes.form}>
            <LoggedOut>
              <Button
                type="submit"
                fullWidth
                hidden={!loggedIn}
                variant="contained"
                color="primary"
                onClick={e => {
                  self.handleSolidLogin(e);
                }}
                className={classes.submit}
              >
                Sign in via WebID
              </Button>
            </LoggedOut>
            <LoggedIn>
              <UploadFilePopup />
            </LoggedIn>
          </form>
        </Paper>
      </div>
    );
  }
}

StorageDashboard.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(StorageDashboard);
