// @flow
import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { ApplicationsBrowserHeaderComponent } from './ApplicationsBrowserHeaderComponent';
import { globalActions } from '@ducks/globalDuck';

type Props = {
  onDrawerToggle: Function,
  handleSetApplicationsBrowserTabIndex: Function,
  applicationsBrowserTabIndex: Number
};

const tabTitle = [
  { titleLabel: 'My Applications' },
  { titleLabel: 'Shared Applications' }
];

const sectionLabel = 'Applications Browser';

class ApplicationsBrowserContainer extends PureComponent<Props> {
  handleTabChange = (event, tabIndex) => {
    this.props.handleSetApplicationsBrowserTabIndex(tabIndex);
  };

  render() {
    const { onDrawerToggle, applicationsBrowserTabIndex } = this.props;
    const { handleTabChange } = this;

    return (
      <ApplicationsBrowserHeaderComponent
        onDrawerToggle={onDrawerToggle}
        applicationsBrowserTabIndex={applicationsBrowserTabIndex}
        sectionLabel={sectionLabel}
        tabTitles={tabTitle}
        onHandleTabChange={handleTabChange}
      />
    );
  }
}

const mapStateToProps = state => {
  return {
    applicationsBrowserTabIndex: state.globals.applicationsBrowserTabIndex
  };
};

const mapDispatchToProps = dispatch => {
  const handleSetApplicationsBrowserTabIndex = index =>
    dispatch(globalActions.setSelectedApplicationsBrowserTabIndex(index));

  return {
    handleSetApplicationsBrowserTabIndex
  };
};

export const ApplicationsBrowserHeader = connect(
  mapStateToProps,
  mapDispatchToProps
)(ApplicationsBrowserContainer);
