import React, { Component } from 'react';
import AuthorizationComponent from './AuthorizationComponent';
import { login } from 'solid-auth-client';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Log, withWebId } from '@utils';

const providers = {
  Inrupt: 'https://inrupt.net/auth',
  'Solid Community': 'https://solid.community',
  '': ''
};

class AuthorizationContainer extends Component {
  state = {
    webIdFieldValue: '',
    withWebIdStatus: false,
    // eslint-disable-next-line react/no-unused-state
    session: null,
    providerTitle: ''
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
      const { withWebIdStatus, providerTitle, webIdFieldValue } = this.state;
      event.preventDefault();
      const callbackUri = `${window.location.origin}/dashboard`;
      const webIdValue = webIdFieldValue;
      const providerLink = providers[providerTitle];

      if (
        (withWebIdStatus && !this.isWebIdValid(webIdValue)) ||
        (!withWebIdStatus && providerLink === '')
      ) {
        toast.error('Error WebID/Provider is not valid! Try again...', {
          position: toast.POSITION.BOTTOM_CENTER
        });
      }

      const ldp = withWebIdStatus ? webIdValue : providerLink;

      const session = await login(ldp, {
        callbackUri,
        storage: localStorage
      });

      if (session) {
        // eslint-disable-next-line react/no-unused-state
        return this.setState({ session });
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

  handleProviderChange = event => {
    this.setState({ providerTitle: event.target.value });
  };

  render() {
    const {
      handleSignIn,
      handleWebIdFieldChange,
      onSetWithWebId,
      handleProviderChange
    } = this;
    const { withWebIdStatus, providerTitle } = this.state;
    return (
      <div>
        <AuthorizationComponent
          onWebIdFieldChange={handleWebIdFieldChange}
          onSignInClick={handleSignIn}
          onSetWithWebId={onSetWithWebId}
          withWebIdStatus={withWebIdStatus}
          providerTitle={providerTitle}
          handleProviderChange={handleProviderChange}
        />
        <ToastContainer />
      </div>
    );
  }
}

export default withWebId(AuthorizationContainer);
