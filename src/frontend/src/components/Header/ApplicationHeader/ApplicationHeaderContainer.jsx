// @flow
import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { ApplicationHeaderComponent } from './ApplicationHeaderComponent';
import { globalActions } from '@ducks/globalDuck';

type Props = {
  handleSetApplicationSetupTabIndex: Function,
  applicationSetupTabIndex: Number
};

const tabTitle = [];

class ApplicationHeaderContainer extends PureComponent<Props> {
  handleTabChange = (event, tabIndex) => {
    this.props.handleSetApplicationSetupTabIndex(tabIndex);
  };

  render() {
    const { applicationSetupTabIndex } = this.props;
    const { handleTabChange } = this;

    return (
      <ApplicationHeaderComponent
        applicationSetupTabIndex={applicationSetupTabIndex}
        tabTitles={tabTitle}
        onHandleTabChange={handleTabChange}
      />
    );
  }
}

const mapStateToProps = state => {
  return {
    applicationSetupTabIndex: state.globals.applicationSetupTabIndex
  };
};

const mapDispatchToProps = dispatch => {
  const handleSetApplicationSetupTabIndex = index =>
    dispatch(globalActions.setSelectedApplicationSetupTabIndex(index));

  return {
    handleSetApplicationSetupTabIndex
  };
};

export const ApplicationHeader = connect(
  mapStateToProps,
  mapDispatchToProps
)(ApplicationHeaderContainer);
