import React, { PureComponent } from 'react';
import UserProfileButtonComponent from './UserProfileButtonComponent';
import auth from 'solid-auth-client';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import { Log } from '@utils';

class UserProfileButtonContainer extends PureComponent {
  state = {
    anchorElement: null
  };

  handleMenuOpen = event => {
    this.setState({ anchorElement: event.currentTarget });
  };

  handleLogout = () => {
    const { history } = this.props;
    this.setState({ anchorElement: null });
    auth.logout().then(() => {
      Log.info('Logout successfull', 'UserProfileButton');
      // history.push('/login');
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

UserProfileButtonContainer.propTypes = {
  history: PropTypes.any
};

export default withRouter(UserProfileButtonContainer);
