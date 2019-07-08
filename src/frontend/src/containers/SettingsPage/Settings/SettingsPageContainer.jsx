// @flow
import React, { PureComponent, Fragment } from 'react';
import { SettingsPageComponent } from './SettingsPageComponent';
import { connect } from 'react-redux';
import { globalActions } from '@ducks/globalDuck';
import { userActions } from '@ducks/userDuck';
import UserService from '@utils/user.service';
import { StoragePickFolderDialog } from '@storage';
import { withAuthorization } from '@utils';

type Props = {
  userProfile: Object,
  handleUpdateChooseFolderDialogState: Function,
  setColorTheme: Function,
  colorThemeIsLight: Boolean
};

class SettingsPage extends PureComponent<Props> {
  constructor(props) {
    super(props);
    (this: any).handleChangeFolder = this.handleChangeFolder.bind(this);
    (this: any).handleChangeColor = this.handleChangeColor.bind(this);
  }

  handleChangeFolder() {
    const { handleUpdateChooseFolderDialogState } = this.props;
    handleUpdateChooseFolderDialogState(true);
  }

  async handleChangeColor() {
    const { setColorTheme, colorThemeIsLight, userProfile } = this.props;
    await UserService.setColorTheme(userProfile.webId, !colorThemeIsLight);
    setColorTheme(!colorThemeIsLight);
  }

  render() {
    const { userProfile, colorThemeIsLight } = this.props;
    const { handleChangeFolder, handleChangeColor } = this;
    return (
      <Fragment>
        <SettingsPageComponent
          onHandleChangeFolder={handleChangeFolder}
          onHandleChangeColorTheme={handleChangeColor}
          colorThemeIsLight={colorThemeIsLight}
          userProfile={userProfile}
        />
        <StoragePickFolderDialog />
      </Fragment>
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
  const handleUpdateChooseFolderDialogState = state =>
    dispatch(globalActions.setChooseFolderDialogState({ state }));

  const setColorTheme = isLight =>
    dispatch(userActions.setLightColorTheme(isLight));

  return {
    handleUpdateChooseFolderDialogState,
    setColorTheme
  };
};

export const SettingsPageContainer = withAuthorization(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(SettingsPage)
);
