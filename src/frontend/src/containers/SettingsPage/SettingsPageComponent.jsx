// @flow
import React from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import SettingsIcon from '@material-ui/icons/SettingsOutlined';
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
  onHandleChangeFolder: Function,
  onHandleChangeColorTheme: Function
};

const SettingsPageComponent = ({
  classes,
  userProfile,
  onHandleChangeFolder,
  onHandleChangeColorTheme
}: Props) => {
  return (
    <main className={classes.main}>
      <CssBaseline />
      <Paper elevation={2} className={classes.paper}>
        <Avatar className={classes.avatar}>
          <SettingsIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Settings
        </Typography>
        <form className={classes.form}>
          <FormControl margin="normal" fullWidth>
            <InputLabel shrink htmlFor="appFolder">
              Application folder
            </InputLabel>
            <Input
              readOnly
              id="Web ID"
              name="appFolder"
              value={userProfile.applicationsFolder}
            />
          </FormControl>
          <FormControlLabel
            control={
              <Checkbox
                onChange={onHandleChangeColorTheme}
                value="remember"
                color="primary"
              />
            }
            label="Light theme"
          />
          <Button
            fullWidth
            variant="contained"
            color="primary"
            onClick={onHandleChangeFolder}
          >
            Change folder
          </Button>
        </form>
      </Paper>
    </main>
  );
};

export default withStyles(styles)(SettingsPageComponent);
