// @flow
import React, { PureComponent } from 'react';
import { UserProfilePage } from './UserProfilePageComponent';
import { connect } from 'react-redux';
import {
  withAuthorization,
  GlobalUtils,
  GoogleAnalyticsWrapper,
  Log
} from '@utils';

type Props = {
  userProfile: Object,
  history: Object,
  resetReduxStore: Function,
  location: Object
};

class UserProfilePageContainer extends PureComponent<Props> {
  componentDidMount() {
    const page = this.props.location.pathname;
    GoogleAnalyticsWrapper.trackPage(page);
  }

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
      Log.error(error);
    }
  };

  performPasswordReset = async () => {
    const { webId } = this.props.userProfile;

    let domain = GlobalUtils.urlDomain(webId);

    if (domain.includes('lpsolid')) {
      domain = `${domain}:8443`;
    }

    const resetUrl = `https://${domain}/account/password/reset`;

    window.open(resetUrl, '_blank');

    this.performLogout();
  };

  render() {
    const { userProfile } = this.props;
    const { performLogout, performPasswordReset } = this;
    return (
      <UserProfilePage
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
