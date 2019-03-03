import React, { PureComponent } from 'react';
import HomeComponent from './HomeComponent';
import { SocketContext, AuthenticationService, Log } from '@utils';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { userActions } from '@ducks/userDuck';
import { withWebId } from '@inrupt/solid-react-components';

class HomeContainer extends PureComponent {
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

  handleSetUserSockets = () => {
    const { socket } = this.props;
  };

  render() {
    return <HomeComponent classes={undefined} />;
  }
}

HomeContainer.propTypes = {
  handleSetUserProfile: PropTypes.any,
  socket: PropTypes.any,
  userProfile: PropTypes.any,
  webId: PropTypes.any
};

const HomeContainerWithSocket = props => (
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
