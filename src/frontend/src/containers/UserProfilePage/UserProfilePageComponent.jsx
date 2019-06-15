// @flow
import React from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import FormControl from '@material-ui/core/FormControl';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import PermIdentityIcon from '@material-ui/icons/PermIdentityOutlined';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import withStyles from '@material-ui/core/styles/withStyles';

const styles = theme => ({
  main: {
    width: 'auto',
    display: 'block', // Fix IE 11 issue.
    marginLeft: theme.spacing(3),
    marginRight: theme.spacing(3),
    [theme.breakpoints.up(400 + theme.spacing(6))]: {
      width: 500,
      marginLeft: 'auto',
      marginRight: 'auto'
    }
  },
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: `${theme.spacing(2)}px ${theme.spacing(3)}px ${theme.spacing(3)}px`
  },
  avatar: {
    margin: theme.spacing()
    // backgroundColor: theme.palette.secondary.main
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing()
  },
  submit: {
    marginTop: theme.spacing(3)
  }
});

type Props = {
  classes: Object,
  userProfile: Object,
  onHandleLogoutClicked: Function,
  onHandlePasswordReset: Function
};

const UserProfilePageContainer = ({
  classes,
  userProfile,
  onHandleLogoutClicked,
  onHandlePasswordReset
}: Props) => {
  return (
    <main className={classes.main}>
      <CssBaseline />
      <Paper elevation={2} className={classes.paper}>
        <Avatar className={classes.avatar}>
          <PermIdentityIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          User Profile
        </Typography>
        <form className={classes.form}>
          <FormControl margin="normal" fullWidth>
            <InputLabel shrink htmlFor="webId">
              Web ID
            </InputLabel>
            <Input
              readOnly
              id="Web ID"
              name="webId"
              value={userProfile.webId}
            />
          </FormControl>
          <FormControl margin="normal" fullWidth>
            <InputLabel shrink htmlFor="name">
              Name
            </InputLabel>
            <Input name="name" value={userProfile.name} id="name" />
          </FormControl>
          <Button
            fullWidth
            variant="contained"
            onClick={onHandlePasswordReset}
            color="primary"
            className={classes.submit}
          >
            Reset Password
          </Button>
          <Button
            fullWidth
            variant="contained"
            onClick={onHandleLogoutClicked}
            color="primary"
            className={classes.submit}
          >
            Logout
          </Button>
        </form>
      </Paper>
    </main>
  );
};

export default withStyles(styles)(UserProfilePageContainer);
