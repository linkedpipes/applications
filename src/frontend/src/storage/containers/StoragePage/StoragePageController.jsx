// @flow
import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import StorageSharedPage from './StorageSharedAppsBrowserContainer';
import StoragePage from './StorageAppsBrowserContainer';
import { connect } from 'react-redux';
import { GoogleAnalyticsWrapper } from '@utils';

const styles = () => ({
  root: {
    flexGrow: 1
  }
});

type Props = {
  location: Object,
  applicationsBrowserTabIndex: number
};

class StoragePageController extends React.Component<Props> {
  componentDidMount() {
    const page = this.props.location.pathname;
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
    applicationsBrowserTabIndex: state.globals.applicationsBrowserTabIndex
  };
};

export default connect(mapStateToProps)(
  withStyles(styles)(StoragePageController)
);
