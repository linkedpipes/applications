// @flow
import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { DiscoverHeaderComponent } from './DiscoverHeaderComponent';
import { globalActions } from '@ducks/globalDuck';

type Props = {
  onDrawerToggle: Function,
  handleSetDiscoverTabIndex: Function,
  discoverTabIndex: Number
};

const tabTitle = [];

const sectionLabel = 'Create Application';

class DiscoverHeaderContainer extends PureComponent<Props> {
  handleTabChange = (event, tabIndex) => {
    this.props.handleSetDiscoverTabIndex(tabIndex);
  };

  render() {
    const { onDrawerToggle, discoverTabIndex } = this.props;
    const { handleTabChange } = this;

    return (
      <DiscoverHeaderComponent
        onDrawerToggle={onDrawerToggle}
        discoverTabIndex={discoverTabIndex}
        sectionLabel={sectionLabel}
        tabTitles={tabTitle}
        onHandleTabChange={handleTabChange}
      />
    );
  }
}

const mapStateToProps = state => {
  return {
    discoverTabIndex: state.globals.discoverTabIndex
  };
};

const mapDispatchToProps = dispatch => {
  const handleSetDiscoverTabIndex = index =>
    dispatch(globalActions.setSelectedDiscverTabIndex(index));

  return {
    handleSetDiscoverTabIndex
  };
};

export const DiscoverHeader = connect(
  mapStateToProps,
  mapDispatchToProps
)(DiscoverHeaderContainer);
