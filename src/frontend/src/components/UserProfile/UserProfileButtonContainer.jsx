// @flow
import React, { PureComponent } from 'react';
import UserProfileButtonComponent from './UserProfileButtonComponent';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { SocketContext } from '@utils';
import authClient from 'solid-auth-client';

type Props = {
  history: Object,
  resetReduxStore: Function,
  socket: Object,
  webId: string
};

type State = {
  anchorElement: Object
};
class UserProfileButtonContainer extends PureComponent<Props, State> {
  state = {
    anchorElement: null
  };

  handleMenuOpen = event => {
    this.setState({ anchorElement: event.currentTarget });
  };

  clearCookies = () => {
    const cookies = document.cookie.split('; ');
    // eslint-disable-next-line no-plusplus
    for (let c = 0; c < cookies.length; c++) {
      const d = window.location.hostname.split('.');
      while (d.length > 0) {
        const cookieBase = `${encodeURIComponent(
          cookies[c].split(';')[0].split('=')[0]
        )}=; expires=Thu, 01-Jan-1970 00:00:01 GMT; domain=${d.join(
          '.'
        )} ;path=`;
        const p = window.location.pathname.split('/');
        document.cookie = `${cookieBase}/`;
        while (p.length > 0) {
          document.cookie = cookieBase + p.join('/');
          p.pop();
        }
        d.shift();
      }
    }
  };

  performLogout = async () => {
    try {
      await authClient.logout();
      // Remove localStorage
      localStorage.removeItem('solid-auth-client');
      // Clear cookies
      this.clearCookies();
      // Redirect to login page
      this.props.history.push('/login');
    } catch (error) {
      // console.log(`Error: ${error}`);
    }
  };

  handleLogout = () => {
    this.props.socket.emit('leave', this.props.webId);
    this.props.resetReduxStore();
    this.setState({ anchorElement: null });
    this.performLogout();
  };

  handleMenuClose = () => {
    this.setState({ anchorElement: null });
  };

  render() {
    const { anchorElement } = this.state;
    const { handleMenuClose, handleMenuOpen, handleLogout } = this;
    const profileMenuIsOpen = Boolean(anchorElement);

    return (
      <UserProfileButtonComponent
        profileMenuIsOpen={profileMenuIsOpen}
        anchorElement={anchorElement}
        onHandleMenuOpen={handleMenuOpen}
        onHandleMenuClose={handleMenuClose}
        onHandleLogoutClicked={handleLogout}
      />
    );
  }
}

const UserProfileButtonContainerWithSockets = props => (
  <SocketContext.Consumer>
    {socket => <UserProfileButtonContainer {...props} socket={socket} />}
  </SocketContext.Consumer>
);

const mapStateToProps = state => {
  return {
    webId: state.user.webId
  };
};

const mapDispatchToProps = dispatch => {
  const resetReduxStore = () => dispatch({ type: 'USER_LOGOUT' });

  return {
    resetReduxStore
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(UserProfileButtonContainerWithSockets));
