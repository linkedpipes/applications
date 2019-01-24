import React, { Component } from "react";
import { render } from "react-dom";
import CssBaseline from "@material-ui/core/CssBaseline";
import { AppBar, Toolbar, Typography } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import LoginRegister from "react-mui-login-register";
import { setUserAuthenticationStatus } from "../../_actions/globals";
import connect from "react-redux/lib/connect/connect";

const styles = theme => ({
  root: {
    fontFamily: theme.typography.fontFamily,
    padding: 20
  },
  footer: {
    padding: "10px"
  },
  controls: {
    margin: [[theme.spacing.unit * 2, 0]],
    padding: theme.spacing.unit
  }
});

class AuthenticationScreen extends Component {
  state = {
    disableLocal: false,
    disableRegister: false,
    disableRegisterProviders: true
  };

  render() {
    const { classes } = this.props;

    const header = (
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" color="inherit">
            Welcome to LinkedPipes Applications
          </Typography>
        </Toolbar>
      </AppBar>
    );

    const footer = (
      <div className={classes.footer}>
        <Typography variant="caption" align="center">
          Footer Goes Here
        </Typography>
      </div>
    );

    return (
      <div className={classes.root}>
        <CssBaseline />
        <LoginRegister
          header={header}
          // footer={footer}
          onLogin={this.handleLogin}
          onRegister={this.handleRegister}
          // onRegisterWithProvider={this.handleRegisterWithProvider}
          disableLocal={this.state.disableLocal}
          disableRegister={this.state.disableRegister}
          providers={[]}
          // disableRegisterProviders={this.state.disableRegisterProviders}
        />
      </div>
    );
  }

  handleChange = name => event => {
    this.setState({ [name]: event.target.checked });
  };

  handleLogin = content => {
    alert(`Logging in with content '${JSON.stringify(content)}'`);
    this.props.dispatch(setUserAuthenticationStatus({ status: true }));
    this.props.history.push("/dashboard");
  };

  handleLoginWithProvider = providerId => {
    alert(`Logging in with provider '${providerId}'`);
  };

  handleRegister = content => {
    alert(`Registering with content '${JSON.stringify(content)}'`);
  };

  handleRegisterWithProvider = providerId => {
    alert(`Registering with provider '${providerId}'`);
  };
}

const mapStateToProps = state => {
  return {
    authenticationStatus:
      state.globals.authenticationStatus !== undefined
        ? state.globals.authenticationStatus
        : false
  };
};

export default connect(mapStateToProps)(
  withStyles(styles)(AuthenticationScreen)
);
