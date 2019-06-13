import React from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import Paper from '@material-ui/core/Paper';
import { withStyles } from '@material-ui/core/styles';
import SolidProviderComponent from './children';
import Switch from '@material-ui/core/Switch';
import LpaLogo from '@assets/lpa_logo_small.svg';
import LpaTitle from '@assets/lpa_svg_title.svg';

const styles = theme => ({
  main: {
    width: 'auto',
    display: 'block', // Fix IE 11 issue.
    marginLeft: theme.spacing(3),
    marginRight: theme.spacing(3),
    [theme.breakpoints.up(400 + theme.spacing(6))]: {
      width: 400,
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
    margin: theme.spacing(3),
    width: 150,
    height: 150
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
  classes: any,
  onWebIdFieldChange: Function,
  onSignInClick: Function,
  onSetWithWebId: Function,
  withWebIdStatus: Boolean,
  handleProviderChange: Function,
  providerTitle: String
};

const AuthorizationComponent = ({
  classes,
  onWebIdFieldChange,
  onSignInClick,
  withWebIdStatus,
  onSetWithWebId,
  handleProviderChange,
  providerTitle
}: Props) => (
  <main className={classes.main}>
    <CssBaseline />
    <Paper elevation={2} className={classes.paper}>
      <Avatar className={classes.avatar}>
        <img src={LpaLogo} alt="" width="150" height="150" />
      </Avatar>

      <img src={LpaTitle} alt="" width="300" height="50" />

      <form className={classes.form}>
        {withWebIdStatus ? (
          <FormControl margin="normal" required fullWidth>
            <InputLabel htmlFor="component-simple">Web ID</InputLabel>
            <Input
              id="webId"
              name="webId"
              autoComplete="webId"
              autoFocus
              onChange={onWebIdFieldChange}
            />
          </FormControl>
        ) : (
          <SolidProviderComponent
            providerTitle={providerTitle}
            handleChange={handleProviderChange}
          />
        )}
        <FormControlLabel
          control={
            <Switch
              id="with-web-id-checkbox"
              checked={withWebIdStatus}
              onChange={onSetWithWebId}
              value="checkedA"
              color="primary"
            />
          }
          label="With WebID"
        />
        <Button
          type="submit"
          id="sign-in-button"
          fullWidth
          variant="contained"
          color="primary"
          onClick={onSignInClick}
          className={classes.submit}
        >
          Sign in
        </Button>
      </form>
    </Paper>
  </main>
);

export default withStyles(styles)(AuthorizationComponent);
