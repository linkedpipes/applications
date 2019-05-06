import React, { Component } from 'react';
import AuthorizationComponent from './AuthorizationComponent';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Log } from '@utils';
import authClient from 'solid-auth-client';
import { connect } from 'react-redux';

const providers = {
  Inrupt: 'https://inrupt.net/auth',
  'Solid Community': 'https://solid.community/auth',
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

  login = async (idp, callbackUri) => {
    const session = await authClient.currentSession();
    if (!session)
      await authClient.login(idp, {
        // callbackUri,
        storage: localStorage
      });
    else {
      Log.info(`Logged in as ${session.webId}`);
      this.login(idp, callbackUri);
    }
    return session;
  };

  // eslint-disable-next-line consistent-return
  handleSignIn = event => {
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

      const newSession = this.login(ldp, callbackUri);
      // eslint-disable-next-line react/no-unused-state
      this.setState({ newSession });
      return;
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

const mapStateToProps = state => {
  return {
    webId: state.user.webId
  };
};

export default connect(mapStateToProps)(AuthorizationContainer);
