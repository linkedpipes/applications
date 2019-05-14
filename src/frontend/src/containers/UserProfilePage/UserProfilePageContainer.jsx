// @flow
import React, { PureComponent } from 'react';
import UserProfilePageComponent from './UserProfilePageComponent';
import { connect } from 'react-redux';
import { withAuthorization, GlobalUtils } from '@utils';

type Props = {
  userProfile: Object,
  history: Object,
  resetReduxStore: Function
};

class UserProfilePageContainer extends PureComponent<Props> {
  performLogout = async () => {
    await this.props.resetReduxStore();

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
      // console.log(`Error: ${error}`);
    }
  };

  performPasswordReset = async () => {
    const { webId } = this.props.userProfile;

    const domain = GlobalUtils.urlDomain(webId);

    const resetUrl = `https://${domain}/account/password/reset`;

    window.open(resetUrl, '_blank');

    this.performLogout();
  };

  render() {
    const { userProfile } = this.props;
    const { performLogout, performPasswordReset } = this;
    return (
      <UserProfilePageComponent
        userProfile={userProfile}
        onHandleLogoutClicked={performLogout}
        onHandlePasswordReset={performPasswordReset}
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
