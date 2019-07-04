// @flow
import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { DiscoverHeaderComponent } from './DiscoverHeaderComponent';
import { globalActions } from '@ducks/globalDuck';

type Props = {
  onDrawerToggle: Function,
  handleSetDashboardTabIndex: Function,
  dashboardTabIndex: Number
};

const tabTitle = [];

const sectionLabel = 'Create Application';

class DiscoverHeaderContainer extends PureComponent<Props> {
  handleTabChange = (event, tabIndex) => {
    this.props.handleSetDashboardTabIndex(tabIndex);
  };

  render() {
    const { onDrawerToggle, dashboardTabIndex } = this.props;
    const { handleTabChange } = this;

    return (
      <DiscoverHeaderComponent
        onDrawerToggle={onDrawerToggle}
        dashboardTabIndex={dashboardTabIndex}
        sectionLabel={sectionLabel}
        tabTitles={tabTitle}
        onHandleTabChange={handleTabChange}
      />
    );
  }
}

const mapStateToProps = state => {
  return {
    dashboardTabIndex: state.globals.dashboardTabIndex
  };
};

const mapDispatchToProps = dispatch => {
  const handleSetDashboardTabIndex = index =>
    dispatch(globalActions.setSelectedDashboardTabIndex(index));

  return {
    handleSetDashboardTabIndex
  };
};

export const DiscoverHeader = connect(
  mapStateToProps,
  mapDispatchToProps
)(DiscoverHeaderContainer);
