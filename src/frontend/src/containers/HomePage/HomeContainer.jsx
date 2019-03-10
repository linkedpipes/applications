// @flow
import React, { PureComponent } from 'react';
import HomeComponent from './HomeComponent';
import { SocketContext, AuthenticationService, Log } from '@utils';
import { connect } from 'react-redux';
import { userActions } from '@ducks/userDuck';
import { withWebId } from '@inrupt/solid-react-components';

type Props = {
  handleSetUserProfile: (userProfile: {}) => void,
  // socket: any,
  // userProfile: any,
  webId: string
};

class HomeContainer extends PureComponent<Props> {
  componentDidMount = () => {
    const { webId } = this.props;
    const { handleLoadUserProfile } = this;

    AuthenticationService.authorizeUser(webId)
      .then(res => {
        Log.info('Response from add user call:', 'AuthenticationService');
        Log.info(res, 'AuthenticationService');
        Log.info(res.data, 'AuthenticationService');
        setTimeout(() => {
          handleLoadUserProfile();
        }, 500);
      })
      .catch(error => {
        Log.error(error, 'HomeContainer');
        setTimeout(() => {
          handleLoadUserProfile();
        }, 500);
      });
  };

  handleLoadUserProfile = () => {
    const { webId, handleSetUserProfile } = this.props;
    AuthenticationService.getUserProfile(webId)
      .then(res => {
        Log.info(
          'Response from get user profile call:',
          'AuthenticationService'
        );
        Log.info(res, 'AuthenticationService');
        Log.info(res.data, 'AuthenticationService');

        return res.json();
      })
      .then(jsonResponse => {
        handleSetUserProfile(jsonResponse);
      })
      .catch(error => {
        Log.error(error, 'HomeContainer');
      });
  };

  // Does this do something?
  // handleSetUserSockets = () => {
  //   const { socket } = this.props;
  // };

  render() {
    return <HomeComponent />;
  }
}

const HomeContainerWithSocket = (props: Props) => (
  <SocketContext.Consumer>
    {socket => <HomeContainer {...props} socket={socket} />}
  </SocketContext.Consumer>
);

const mapStateToProps = state => {
  return {
    userProfile: state.user
  };
};

const mapDispatchToProps = dispatch => {
  const handleSetUserProfile = userProfile =>
    dispatch(userActions.setUserProfile(userProfile));
  return {
    handleSetUserProfile
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withWebId(HomeContainerWithSocket));
