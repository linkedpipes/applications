import React, { PureComponent } from 'react';
import UserProfileButtonComponent from './UserProfileButtonComponent';
import auth from 'solid-auth-client';
import { withRouter } from 'react-router-dom';
import { Log } from '@utils';

class UserProfileButtonContainer extends PureComponent {
  state = {
    anchorElement: null
  };

  handleMenuOpen = event => {
    this.setState({ anchorElement: event.currentTarget });
  };

  handleLogout = () => {
    const self = this;
    self.setState({ anchorElement: null });
    auth.logout().then(() => {
      Log.info('Logout successfull', 'UserProfileButton');
      self.props.history.push('/login');
    });
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

export default withRouter(UserProfileButtonContainer);
