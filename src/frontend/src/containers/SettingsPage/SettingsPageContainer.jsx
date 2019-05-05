// @flow
import React, { PureComponent, Fragment } from 'react';
import SettingsPageComponent from './SettingsPageComponent';
import { StoragePickFolderDialog } from '@storage';
import { connect } from 'react-redux';
import { withAuthorization } from '@utils';
import { globalActions } from '@ducks/globalDuck';

type Props = {
  userProfile: Object,
  handleUpdateChooseFolderDialogState: Function
};

class SettingsPageContainer extends PureComponent<Props> {
  componentDidMount() {}

  handleChangeFolder() {
    const { handleUpdateChooseFolderDialogState } = this.props;
    handleUpdateChooseFolderDialogState(true);
  }

  render() {
    const { userProfile } = this.props;
    const { handleChangeFolder } = this;
    return (
      <Fragment>
        <SettingsPageComponent
          onHandleChangeFolder={handleChangeFolder}
          userProfile={userProfile}
        />
        <StoragePickFolderDialog />
      </Fragment>
    );
  }
}

const mapStateToProps = state => {
  return {
    userProfile: state.user
  };
};

const mapDispatchToProps = dispatch => {
  const handleUpdateChooseFolderDialogState = state =>
    dispatch(globalActions.setChooseFolderDialogState({ state }));

  return {
    handleUpdateChooseFolderDialogState
  };
};

export default withAuthorization(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(SettingsPageContainer)
);
