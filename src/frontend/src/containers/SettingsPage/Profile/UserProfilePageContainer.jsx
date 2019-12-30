// @flow
import React, { PureComponent } from 'react';
import { UserProfilePage } from './UserProfilePageComponent';
import { connect } from 'react-redux';
import UserService from '@utils/user.service';
import { userActions } from '@ducks/userDuck';
import { solidAuthClient } from 'linkedpipes-storage';
import { withAuthorization, GlobalUtils, Log } from '@utils';

type Props = {
  userProfile: Object,
  history: Object,
  resetReduxStore: Function,
  setColorTheme: Function,
  colorThemeIsLight: Boolean
};

class UserProfilePageContainer extends PureComponent<Props> {
  constructor(props) {
    super(props);
    (this: any).handleChangeColor = this.handleChangeColor.bind(this);
  }

  performLogout = async () => {
    await this.props.resetReduxStore();

    try {
      await solidAuthClient.logout();
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

    if (domain.includes('lpapps')) {
      domain = `${domain}:8443`;
    }

    const resetUrl = `https://${domain}/account/password/reset`;

    window.open(resetUrl, '_blank');

    this.performLogout();
  };

  async handleChangeColor() {
    const { setColorTheme, colorThemeIsLight, userProfile } = this.props;
    await UserService.setColorTheme(userProfile.webId, !colorThemeIsLight);
    setColorTheme(!colorThemeIsLight);
  }

  render() {
    const { userProfile, colorThemeIsLight } = this.props;
    const { performLogout, performPasswordReset, handleChangeColor } = this;

    return (
      <UserProfilePage
        userProfile={userProfile}
        onHandleLogoutClicked={performLogout}
        onHandlePasswordReset={performPasswordReset}
        colorThemeIsLight={colorThemeIsLight}
        onHandleChangeColorTheme={handleChangeColor}
      />
    );
  }
}

const mapStateToProps = state => {
  return {
    userProfile: state.user,
    colorThemeIsLight: state.user.colorThemeIsLight
  };
};

const mapDispatchToProps = dispatch => {
  const resetReduxStore = () => dispatch({ type: 'USER_LOGOUT' });

  const setColorTheme = isLight =>
    dispatch(userActions.setLightColorTheme(isLight));

  return {
    resetReduxStore,
    setColorTheme
  };
};

export default withAuthorization(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(UserProfilePageContainer)
);
