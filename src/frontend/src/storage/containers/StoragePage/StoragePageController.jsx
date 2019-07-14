// @flow
import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import StorageSharedPage from './StorageSharedAppsBrowserContainer';
import StoragePage from './StorageAppsBrowserContainer';
import { connect } from 'react-redux';
import { globalActions } from '@ducks/globalDuck';
import { GoogleAnalyticsWrapper } from '@utils';

const styles = () => ({
  root: {
    flexGrow: 1
  }
});

type Props = {
  location: Object,
  applicationsBrowserTabIndex: number,

  handleSetSelectedNavigationItem: Function,
  selectedNavigationItem: string
};

class StoragePageController extends React.Component<Props> {
  componentDidMount() {
    const page = this.props.location.pathname;

    const {
      selectedNavigationItem,
      handleSetSelectedNavigationItem
    } = this.props;

    if (selectedNavigationItem !== 'applications') {
      handleSetSelectedNavigationItem('applications');
    }

    GoogleAnalyticsWrapper.trackPage(page);
  }

  getContent = tabIndex => {
    switch (tabIndex) {
      case 0:
        return <StoragePage />;
      case 1:
        return <StorageSharedPage />;
      default:
        return <StoragePage />;
    }
  };

  render() {
    const { applicationsBrowserTabIndex } = this.props;

    return (
      <React.Fragment>
        {this.getContent(applicationsBrowserTabIndex)}
      </React.Fragment>
    );
  }
}

const mapStateToProps = state => {
  return {
    applicationsBrowserTabIndex: state.globals.applicationsBrowserTabIndex,
    selectedNavigationItem: state.globals.selectedNavigationItem
  };
};

const mapDispatchToProps = dispatch => {
  const handleSetSelectedNavigationItem = item => {
    dispatch(globalActions.setSelectedNavigationItem(item));
  };

  return { handleSetSelectedNavigationItem };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(StoragePageController));
