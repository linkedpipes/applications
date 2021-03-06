// @flow
import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { DiscoverHeaderComponent } from './DiscoverHeaderComponent';
import { globalActions } from '@ducks/globalDuck';

type Props = {
  handleSetDiscoverTabIndex: Function,
  discoverTabIndex: Number
};

const tabTitle = [];

class DiscoverHeaderContainer extends PureComponent<Props> {
  handleTabChange = (event, tabIndex) => {
    this.props.handleSetDiscoverTabIndex(tabIndex);
  };

  render() {
    const { discoverTabIndex } = this.props;
    const { handleTabChange } = this;

    return (
      <DiscoverHeaderComponent
        discoverTabIndex={discoverTabIndex}
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
