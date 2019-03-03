import React, { PureComponent } from 'react';
import AuthorizationComponent from './AuthorizationComponent';
import auth from 'solid-auth-client';
import Snackbar from '@material-ui/core/Snackbar';

class AuthorizationContainer extends PureComponent {
  state = {
    session: null,
    idp: null,
    webIdFieldValue: '',
    withWebId: true,
    error: null,
    snackbarOpen: false
  };

  componentDidUpdate(prevProps, prevState) {
    // Reset error state after user choose provider
    if (prevProps.idp !== '' && prevProps.idp !== this.props.idp) {
      this.setState({ error: null });
    }
  }

  isWebIdValid = webId => {
    const regex = new RegExp(
      /[(http(s)?)://(www.)?a-zA-Z0-9@:%._+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_+.~#?&//=]*)/,
      'i',
      'g'
    );
    return regex.test(webId);
  };

  // eslint-disable-next-line consistent-return
  handleSignIn = event => {
    event.preventDefault();
    const idp = 'https://inrupt.net/auth';
    const callbackUri = `${window.location.origin}/dashboard`;

    const { withWebId } = this.state;

    if (!idp) {
      const errorMessage = withWebId
        ? 'Valid WebID is required'
        : 'Solid Provider is required';
      // @TODO: better error handling will be here
      throw new Error(errorMessage, 'idp');
    }

    if (idp && withWebId && !this.isWebIdValid(idp)) {
      throw new Error('WeibID is not valid', 'idp');
    }

    const session = auth.login(idp, {
      callbackUri
    });

    if (session) {
      return this.setState({ session });
    }
    // @TODO: better error handling will be here
    throw new Error('Something is wrong, please try again...', 'unknow');
  };

  onProviderSelect = event => {
    const idp = event && event.value;
    this.setState({ idp: idp || '', error: !idp });
  };

  optionToggle = () =>
    this.setState({ withWebId: !this.state.withWebId, idp: '', error: null });

  onChangeInput = event => {
    this.setState({ [event.target.name]: event.target.value });
    if (this.isWebIdValid(event.target.value)) {
      this.setState({ error: null });
    }
  };

  handleWebIdFieldChange = e => {
    const value = e.target.value;
    this.setState({ webIdFieldValue: value });
  };

  handleCloseSnackbar = () => {
    this.setState({ snackbarOpen: false });
  };

  render() {
    const { handleSignIn, snackbarOpen, handleWebIdFieldChange } = this;
    return (
      <AuthorizationComponent
        onWebIdFieldChange={handleWebIdFieldChange}
        onSignInClick={handleSignIn}
      />
      <Snackbar
          anchorOrigin={{ 'top', 'center' }}
          open={snackbarOpen}
          onClose={this.handleCloseSnackbar}
          ContentProps={{
            'aria-describedby': 'message-id',
          }}
          message={<span id="message-id">Error, WebID is invalid! Try again...</span>}
        />
    );
  }
}

export default AuthorizationContainer;
