// @flow
import React, { PureComponent } from 'react';
import { AuthorizationComponent } from './AuthorizationComponent';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { connect } from 'react-redux';
import Particles from 'react-particles-js';
import { StorageAuthenticationManager } from 'linkedpipes-storage';
import { Log, GoogleAnalyticsWrapper } from '@utils';

const providers = {
  Inrupt: 'https://inrupt.net/auth',
  'Solid Community': 'https://solid.community/auth',
  'LinkedPipes PODs': 'https://lpapps.co:8443/auth',
  '': ''
};

type Props = {
  location: Object
};

type State = {
  webIdFieldValue: string,
  withWebIdStatus: boolean,
  // eslint-disable-next-line react/no-unused-state
  session: Object,
  providerTitle: string
};

class Authorization extends PureComponent<Props, State> {
  state = {
    webIdFieldValue: '',
    withWebIdStatus: false,
    // eslint-disable-next-line react/no-unused-state
    session: null,
    providerTitle: ''
  };

  componentDidMount() {
    const page = this.props.location.pathname;
    GoogleAnalyticsWrapper.trackPage(page);
  }

  isWebIdValid = webId => {
    const regex = new RegExp(
      /[(http(s)?)://(www.)?a-zA-Z0-9@:%._+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_+.~#?&//=]*)/,
      'ig'
    );
    return regex.test(webId);
  };

  login = async (idp, callbackUri) => {
    const session = await StorageAuthenticationManager.currentSession();
    if (!session)
      await StorageAuthenticationManager.login(idp, {
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
      event.preventDefault();

      const { withWebIdStatus, providerTitle, webIdFieldValue } = this.state;
      const prevPath = !this.props.location.state
        ? 'dashboard'
        : this.props.location.state.prevPath;

      const callbackUri = `${window.location.origin}/${prevPath}`;
      const webIdValue = webIdFieldValue;
      const providerLink = providers[providerTitle];

      if (
        (withWebIdStatus && !this.isWebIdValid(webIdValue)) ||
        (!withWebIdStatus && providerLink === '')
      ) {
        toast.error('Error WebID/Provider is not valid! Try again...', {
          position: toast.POSITION.TOP_RIGHT
        });
      }

      const ldp = withWebIdStatus ? webIdValue : providerLink;

      const newSession = this.login(ldp, callbackUri);
      // eslint-disable-next-line react/no-unused-state
      this.setState({ session: newSession });
      return;
    } catch (error) {
      Log.error(error, 'UserService'); // eslint-disable-line no-console
    }
  };

  handleWebIdFieldChange = e => {
    const value = e.target.value;
    this.setState({ webIdFieldValue: value, withWebIdStatus: true });

    if (this.state.providerTitle !== '') {
      this.setState({ providerTitle: '' });
    }
  };

  onSetWithWebId = event => {
    Log.info(event.target.value, 'AuthorizationContainer');
    this.setState(prevState => ({
      withWebIdStatus: !prevState.withWebIdStatus
    }));
  };

  handleProviderChange = event => {
    this.setState({
      providerTitle: event.target.value,
      withWebIdStatus: false
    });
    if (this.state.webIdFieldValue !== '') {
      this.setState({ webIdFieldValue: '' });
    }
  };

  render() {
    const {
      handleSignIn,
      handleWebIdFieldChange,
      onSetWithWebId,
      handleProviderChange
    } = this;
    const { providerTitle, webIdFieldValue } = this.state;
    return (
      <div
        className="container"
        style={{ width: '100%', height: '100vh', position: 'relative' }}
      >
        <Particles
          style={{ width: '100%', position: 'absolute', zIndex: '-1' }}
          params={{
            particles: {
              number: {
                value: 50
              },
              size: {
                value: 3
              }
            },
            interactivity: {
              events: {
                onhover: {
                  enable: true,
                  mode: 'grab'
                }
              }
            }
          }}
        />
        <AuthorizationComponent
          onWebIdFieldChange={handleWebIdFieldChange}
          onSignInClick={handleSignIn}
          onSetWithWebId={onSetWithWebId}
          providerTitle={providerTitle}
          webIdFieldValue={webIdFieldValue}
          handleProviderChange={handleProviderChange}
        />
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    webId: state.user.webId
  };
};

export const AuthorizationContainer = connect(mapStateToProps)(Authorization);
