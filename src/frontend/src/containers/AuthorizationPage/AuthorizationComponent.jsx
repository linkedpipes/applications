import React from 'react';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import FormControl from '@material-ui/core/FormControl';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import Paper from '@material-ui/core/Paper';
import { withStyles } from '@material-ui/core/styles';
import SolidProviderComponent from './children';
import LpaLogo from '@assets/lpa_logo_small.svg';
import LpaTitle from '@assets/lpa_svg_title.svg';
import { Typography } from '@material-ui/core';

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
    marginTop: theme.spacing(),
    textAlign: 'center'
  },
  submit: {
    marginTop: theme.spacing(3)
  }
});

type Props = {
  classes: any,
  onWebIdFieldChange: Function,
  onSignInClick: Function,
  handleProviderChange: Function,
  providerTitle: string,
  webIdFieldValue: string
};

const Authorization = ({
  classes,
  onWebIdFieldChange,
  onSignInClick,
  handleProviderChange,
  providerTitle,
  webIdFieldValue
}: Props) => (
  <main className={classes.main}>
    <CssBaseline />
    <br />
    <Paper elevation={2} className={classes.paper}>
      <img className={classes.avatar} src={LpaLogo} alt="" />

      <img src={LpaTitle} alt="" width="300" height="50" />

      <form className={classes.form}>
        <SolidProviderComponent
          providerTitle={providerTitle}
          handleChange={handleProviderChange}
        />
        <Typography variant="subtitle2">or</Typography>
        <FormControl margin="normal" required fullWidth>
          <InputLabel htmlFor="component-simple">Web ID</InputLabel>
          <Input
            id="webId"
            name="webId"
            autoComplete="webId"
            value={webIdFieldValue}
            onChange={onWebIdFieldChange}
          />
        </FormControl>

        <Button
          type="submit"
          id="sign-in-button"
          fullWidth
          variant="contained"
          disabled={webIdFieldValue === '' && providerTitle === ''}
          color="primary"
          onClick={onSignInClick}
          className={classes.submit}
        >
          Authenticate
        </Button>
        <Button
          fullWidth
          variant="outlined"
          color="primary"
          className={classes.submit}
        >
          Learn more about WebID and SOLID
        </Button>
      </form>
    </Paper>
  </main>
);

export const AuthorizationComponent = withStyles(styles)(Authorization);
