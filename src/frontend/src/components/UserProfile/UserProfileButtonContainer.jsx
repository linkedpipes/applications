// @flow
import React, { PureComponent } from 'react';
import UserProfileButtonComponent from './UserProfileButtonComponent';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { globalActions } from '@ducks/globalDuck';
import { SocketContext, GlobalUtils, Log } from '@utils';

type Props = {
  history: Object,
  resetReduxStore: Function,
  handleSetInboxDialogState: Function,
  currentInboxInvitations: Array<Object>
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
      const authClient = await import(
        /* webpackChunkName: "solid-auth-client" */ 'solid-auth-client'
      );
      await authClient.logout();
      // Remove localStorage
      localStorage.removeItem('solid-auth-client');
      // Clear cookies
      GlobalUtils.clearCookies();
      // Redirect to login page
      this.props.history.push('/login');
    } catch (error) {
      Log.error(error);
    }
  };

  handleLogout = () => {
    this.props.resetReduxStore();
    this.setState({ anchorElement: null });
    this.performLogout();
  };

  handleMenuClose = () => {
    this.setState({ anchorElement: null });
  };

  handleOpenProfile = () => {
    this.props.history.push('/profile');
    this.handleMenuClose();
  };

  handleOpenSettings = () => {
    this.props.history.push('/settings');
    this.handleMenuClose();
  };

  handleSetInboxDialogOpen = () => {
    const { handleSetInboxDialogState } = this.props;
    handleSetInboxDialogState(true);
  };

  render() {
    const { anchorElement } = this.state;
    const {
      handleMenuClose,
      handleMenuOpen,
      handleLogout,
      handleOpenProfile,
      handleOpenSettings,
      handleSetInboxDialogOpen
    } = this;
    const { currentInboxInvitations } = this.props;
    const profileMenuIsOpen = Boolean(anchorElement);

    return (
      <UserProfileButtonComponent
        profileMenuIsOpen={profileMenuIsOpen}
        anchorElement={anchorElement}
        onHandleMenuOpen={handleMenuOpen}
        onHandleMenuClose={handleMenuClose}
        onHandleLogoutClicked={handleLogout}
        onHandleOpenProfile={handleOpenProfile}
        onHandleOpenSettings={handleOpenSettings}
        onHandleSetInboxDialogOpen={handleSetInboxDialogOpen}
        currentInboxInvitations={currentInboxInvitations}
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
    webId: state.user.webId,
    currentInboxInvitations: state.user.inboxInvitations
  };
};

const mapDispatchToProps = dispatch => {
  const resetReduxStore = () => dispatch({ type: 'USER_LOGOUT' });

  const handleSetInboxDialogState = isOpen =>
    dispatch(globalActions.setInboxDialogState(isOpen));

  return {
    resetReduxStore,
    handleSetInboxDialogState
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(UserProfileButtonContainerWithSockets));
