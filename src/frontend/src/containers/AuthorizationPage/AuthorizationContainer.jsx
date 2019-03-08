import React, { Component } from 'react';
import AuthorizationComponent from './AuthorizationComponent';
import auth from 'solid-auth-client';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { withWebId } from '@inrupt/solid-react-components';
import { Log } from '@utils';

class AuthorizationContainer extends Component {
  state = {
    webIdFieldValue: '',
    withWebIdStatus: false
  };

  isWebIdValid = webId => {
    const regex = new RegExp(
      /[(http(s)?)://(www.)?a-zA-Z0-9@:%._+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_+.~#?&//=]*)/,
      'i',
      'g'
    );
    return regex.test(webId);
  };

  // eslint-disable-next-line consistent-return
  handleSignIn = async event => {
    try {
      event.preventDefault();
      const idp = 'https://inrupt.net/auth';
      const callbackUri = `${window.location.origin}/dashboard`;
      const webIdValue = this.state.webIdFieldValue;

      if (!this.isWebIdValid(webIdValue)) {
        toast.error('Error WebID is not valid! Try again...', {
          position: toast.POSITION.BOTTOM_CENTER
        });
      } else {
        await auth.login(idp, {
          callbackUri,
          storage: localStorage
        });
      }
    } catch (error) {
      Log.error(error, 'AuthenticationService'); // eslint-disable-line no-console
    }
  };

  handleWebIdFieldChange = e => {
    const value = e.target.value;
    this.setState({ webIdFieldValue: value });
  };

  onSetWithWebId = event => {
    Log.info(event.target.value, 'AuthorizationContainer');
    this.setState(prevState => ({
      withWebIdStatus: !prevState.withWebIdStatus
    }));
  };

  render() {
    const { handleSignIn, handleWebIdFieldChange, onSetWithWebId } = this;
    const { withWebIdStatus } = this.state;
    return (
      <div>
        <AuthorizationComponent
          onWebIdFieldChange={handleWebIdFieldChange}
          onSignInClick={handleSignIn}
          onSetWithWebId={onSetWithWebId}
          withWebIdStatus={withWebIdStatus}
        />
        <ToastContainer />
      </div>
    );
  }
}

export default withWebId(AuthorizationContainer);
