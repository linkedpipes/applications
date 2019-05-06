// @flow
import React, { PureComponent, Fragment } from 'react';
import SettingsPageComponent from './SettingsPageComponent';
import { StoragePickFolderDialog } from '@storage';
import { connect } from 'react-redux';
import { withAuthorization } from '@utils';
import { globalActions } from '@ducks/globalDuck';

type Props = {
  userProfile: Object,
  handleUpdateChooseFolderDialogState: Function,
  setColorTheme: Function,
  colorThemeIsLight: Boolean
};

class SettingsPageContainer extends PureComponent<Props> {
  constructor(props) {
    super(props);
    (this: any).handleChangeFolder = this.handleChangeFolder.bind(this);
    (this: any).handleChangeColor = this.handleChangeColor.bind(this);
  }

  handleChangeFolder() {
    const { handleUpdateChooseFolderDialogState } = this.props;
    handleUpdateChooseFolderDialogState(true);
  }

  handleChangeColor() {
    const { setColorTheme, colorThemeIsLight } = this.props;
    setColorTheme(!colorThemeIsLight);
  }

  render() {
    const { userProfile } = this.props;
    const { handleChangeFolder, handleChangeColor } = this;
    return (
      <Fragment>
        <SettingsPageComponent
          onHandleChangeFolder={handleChangeFolder}
          onHandleChangeColorTheme={handleChangeColor}
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
    colorThemeIsLight: state.globals.colorThemeIsLight
  };
};

const mapDispatchToProps = dispatch => {
  const handleUpdateChooseFolderDialogState = state =>
    dispatch(globalActions.setChooseFolderDialogState({ state }));

  const setColorTheme = isLight =>
    dispatch(globalActions.setLightColorTheme(isLight));

  return {
    handleUpdateChooseFolderDialogState,
    setColorTheme
  };
};

export default withAuthorization(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(SettingsPageContainer)
);
