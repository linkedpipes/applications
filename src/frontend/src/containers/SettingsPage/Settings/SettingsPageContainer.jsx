// @flow
import React, { PureComponent, Fragment } from 'react';
import { SettingsPageComponent } from './SettingsPageComponent';
import { connect } from 'react-redux';
import { globalActions } from '@ducks/globalDuck';
import { StoragePickFolderDialog } from '@storage';
import { withAuthorization } from '@utils';

type Props = {
  userProfile: Object,
  handleUpdateChooseFolderDialogState: Function
};

class SettingsPage extends PureComponent<Props> {
  constructor(props) {
    super(props);
    (this: any).handleChangeFolder = this.handleChangeFolder.bind(this);
  }

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

export const SettingsPageContainer = withAuthorization(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(SettingsPage)
);
