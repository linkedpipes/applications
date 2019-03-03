import React, { PureComponent } from 'react';
import AuthorizationComponent from './AuthorizationComponent';
import auth from 'solid-auth-client';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

class AuthorizationContainer extends PureComponent {
  state = {
    session: null,
    idp: null,
    webIdFieldValue: '',
    error: null
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
    const webIdValue = this.state.webIdFieldValue;

    if (!this.isWebIdValid(webIdValue)) {
      toast.error('Error WebID is not valid! Try again...', {
        position: toast.POSITION.BOTTOM_RIGHT
      });
    } else {
      const session = auth.login(idp, {
        callbackUri
      });

      if (session) {
        return this.setState({ session });
      }
    }
  };

  handleWebIdFieldChange = e => {
    const value = e.target.value;
    this.setState({ webIdFieldValue: value });
  };

  render() {
    const { handleSignIn, snackbarOpen, handleWebIdFieldChange } = this;
    return (
      <div>
        <AuthorizationComponent
          onWebIdFieldChange={handleWebIdFieldChange}
          onSignInClick={handleSignIn}
        />
        <ToastContainer />
      </div>
    );
  }
}

export default AuthorizationContainer;
