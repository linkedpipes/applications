// @flow
import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { DashboardHeaderComponent } from './DashboardHeaderComponent';
import { globalActions } from '@ducks/globalDuck';

type Props = {
  handleSetDashboardTabIndex: Function,
  dashboardTabIndex: Number
};

const tabTitle = [
  { titleLabel: 'Quick Start', id: 'quickstart_tab' },
  { titleLabel: 'Discoveries', id: 'discoveries_tab' },
  { titleLabel: 'Pipeline Executions', id: 'pipeline_executions_tab' }
];

const sectionLabel = 'Dashboard';

class DashboardHeaderContainer extends PureComponent<Props> {
  handleTabChange = (event, tabIndex) => {
    this.props.handleSetDashboardTabIndex(tabIndex);
  };

  render() {
    const { dashboardTabIndex } = this.props;
    const { handleTabChange } = this;

    return (
      <DashboardHeaderComponent
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

export const DashboardHeader = connect(
  mapStateToProps,
  mapDispatchToProps
)(DashboardHeaderContainer);
