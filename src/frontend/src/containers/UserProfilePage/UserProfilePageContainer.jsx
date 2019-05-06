// @flow
import React, { PureComponent } from 'react';
import UserProfilePageComponent from './UserProfilePageComponent';
import { connect } from 'react-redux';
import { withAuthorization, GlobalUtils } from '@utils';
import authClient from 'solid-auth-client';

type Props = {
  userProfile: Object,
  history: Object,
  resetReduxStore: Function
};

class UserProfilePageContainer extends PureComponent<Props> {
  performLogout = async () => {
    await this.props.resetReduxStore();

    try {
      await authClient.logout();
      // Remove localStorage
      localStorage.removeItem('solid-auth-client');
      // Clear cookies
      GlobalUtils.clearCookies();
      // Redirect to login page
      this.props.history.push('/login');
    } catch (error) {
      // console.log(`Error: ${error}`);
    }
  };

  render() {
    const { userProfile } = this.props;
    const { performLogout } = this;
    return (
      <UserProfilePageComponent
        userProfile={userProfile}
        onHandleLogoutClicked={performLogout}
      />
    );
  }
}

const mapStateToProps = state => {
  return {
    userProfile: state.user
  };
};

const mapDispatchToProps = dispatch => {
  const resetReduxStore = () => dispatch({ type: 'USER_LOGOUT' });

  return {
    resetReduxStore
  };
};

export default withAuthorization(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(UserProfilePageContainer)
);
