import React, { PureComponent } from 'react';
import UserProfileButtonComponent from './UserProfileButtonComponent';

class UserProfileButtonContainer extends PureComponent {
  state = {
    auth: true,
    anchorElement: null
  };

  handleMenuOpen = event => {
    this.setState({ anchorElement: event.currentTarget });
  };

  handleMenuClose = () => {
    this.setState({ anchorElement: null });
  };

  render() {
    const { auth, anchorElement } = this.state;
    const { handleMenuClose, handleMenuOpen } = this;
    const profileMenuIsOpen = Boolean(anchorElement);

    return (
      auth && (
        <UserProfileButtonComponent
          profileMenuIsOpen={profileMenuIsOpen}
          anchorElement={anchorElement}
          onHandleMenuOpen={handleMenuOpen}
          onHandleMenuClose={handleMenuClose}
        />
      )
    );
  }
}

export default UserProfileButtonContainer;
