// @flow
import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { SettingsHeaderComponent } from './SettingsHeaderComponent';
import { globalActions } from '@ducks/globalDuck';

type Props = {
  handleSetSettingsTabIndex: Function,
  settingsTabIndex: Number
};

const tabTitle = [
  { titleLabel: 'User Profile' },
  { titleLabel: 'Application Storage' }
];

const sectionLabel = 'Settings';

class SettingsHeaderContainer extends PureComponent<Props> {
  handleTabChange = (event, tabIndex) => {
    this.props.handleSetSettingsTabIndex(tabIndex);
  };

  render() {
    const { settingsTabIndex } = this.props;
    const { handleTabChange } = this;

    return (
      <SettingsHeaderComponent
        settingsTabIndex={settingsTabIndex}
        sectionLabel={sectionLabel}
        tabTitles={tabTitle}
        onHandleTabChange={handleTabChange}
      />
    );
  }
}

const mapStateToProps = state => {
  return {
    settingsTabIndex: state.globals.settingsTabIndex
  };
};

const mapDispatchToProps = dispatch => {
  const handleSetSettingsTabIndex = index =>
    dispatch(globalActions.setSelectedSettingsTabIndex(index));

  return {
    handleSetSettingsTabIndex
  };
};

export const SettingsHeader = connect(
  mapStateToProps,
  mapDispatchToProps
)(SettingsHeaderContainer);
