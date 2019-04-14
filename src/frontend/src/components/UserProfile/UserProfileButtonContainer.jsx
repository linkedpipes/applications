// @flow
import React, { PureComponent } from 'react';
import UserProfileButtonComponent from './UserProfileButtonComponent';
import { logout } from 'solid-auth-client';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { SocketContext } from '@utils';
import { withWebId } from '@inrupt/solid-react-components';

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

  performLogout = async () => {
    try {
      await logout();
      // Remove localStorage
      localStorage.removeItem('solid-auth-client');
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

const mapDispatchToProps = dispatch => {
  const resetReduxStore = () => dispatch({ type: 'USER_LOGOUT' });

  return {
    resetReduxStore
  };
};

export default connect(
  null,
  mapDispatchToProps
)(withRouter(withWebId(UserProfileButtonContainerWithSockets)));
