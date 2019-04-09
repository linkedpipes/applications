// @flow
import React, { PureComponent } from 'react';
import UserProfileButtonComponent from './UserProfileButtonComponent';
import auth from 'solid-auth-client';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';

type Props = {
  history: Object,
  resetReduxStore: Function
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
      await auth.logout();
      // Remove localStorage
      localStorage.removeItem('solid-auth-client');
      // Redirect to login page
      this.props.history.push('/login');
    } catch (error) {
      // console.log(`Error: ${error}`);
    }
  };

  handleLogout = () => {
    this.setState({ anchorElement: null });
    this.performLogout();
    this.props.resetReduxStore();
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

const mapDispatchToProps = dispatch => {
  const resetReduxStore = () => dispatch({ type: 'USER_LOGOUT' });

  return {
    resetReduxStore
  };
};

export default connect(
  null,
  mapDispatchToProps
)(withRouter(UserProfileButtonContainer));
