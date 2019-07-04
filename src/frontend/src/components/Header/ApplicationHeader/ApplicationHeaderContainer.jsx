// @flow
import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { ApplicationHeaderComponent } from './ApplicationHeaderComponent';
import { globalActions } from '@ducks/globalDuck';

type Props = {
  onDrawerToggle: Function,
  handleSetApplicationSetupTabIndex: Function,
  applicationSetupTabIndex: Number
};

const tabTitle = [];

const sectionLabel = 'Application Control & Setup';

class ApplicationHeaderContainer extends PureComponent<Props> {
  handleTabChange = (event, tabIndex) => {
    this.props.handleSetApplicationSetupTabIndex(tabIndex);
  };

  render() {
    const { onDrawerToggle, applicationSetupTabIndex } = this.props;
    const { handleTabChange } = this;

    return (
      <ApplicationHeaderComponent
        onDrawerToggle={onDrawerToggle}
        applicationSetupTabIndex={applicationSetupTabIndex}
        sectionLabel={sectionLabel}
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
