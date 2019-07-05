// @flow
import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import SettingsPage from './Settings';
import ProfilePage from './Profile';
import { GoogleAnalyticsWrapper } from '@utils';
import { connect } from 'react-redux';

const styles = () => ({
  root: {
    flexGrow: 1
  }
});

type Props = {
  location: Object,
  settingsTabIndex: number
};

class StoragePageController extends React.Component<Props> {
  componentDidMount() {
    const page = this.props.location.pathname;
    GoogleAnalyticsWrapper.trackPage(page);
  }

  getContent = tabIndex => {
    switch (tabIndex) {
      case 0:
        return <ProfilePage />;
      case 1:
        return <SettingsPage />;
      default:
        return <ProfilePage />;
    }
  };

  render() {
    const { settingsTabIndex } = this.props;

    return <React.Fragment>{this.getContent(settingsTabIndex)}</React.Fragment>;
  }
}

const mapStateToProps = state => {
  return {
    settingsTabIndex: state.globals.settingsTabIndex
  };
};

export default connect(mapStateToProps)(
  withStyles(styles)(StoragePageController)
);
