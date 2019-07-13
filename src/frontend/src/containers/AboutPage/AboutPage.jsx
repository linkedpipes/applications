// @flow
import React, { PureComponent } from 'react';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';
import { globalActions } from '@ducks/globalDuck';
import { connect } from 'react-redux';
import { GoogleAnalyticsWrapper } from '@utils/';

const styles = theme => ({
  root: {
    textAlign: 'center',
    paddingTop: theme.spacing(20)
  },
  button: {
    margin: theme.spacing(1)
  },
  input: {
    display: 'none'
  }
});

type Props = {
  classes: Object,
  location: Object,
  selectedNavigationItem: string,
  handleSetSelectedNavigationItem: Function
};

class AboutPageContainer extends PureComponent<Props> {
  componentDidMount() {
    const page = this.props.location.pathname;

    const {
      selectedNavigationItem,
      handleSetSelectedNavigationItem
    } = this.props;

    if (selectedNavigationItem !== 'about') {
      handleSetSelectedNavigationItem('about');
    }

    GoogleAnalyticsWrapper.trackPage(page);
  }

  render() {
    const { classes } = this.props;

    return (
      <div className={classes.root}>
        <Typography variant="h1" gutterBottom>
          FAQ
        </Typography>
        <Typography variant="h2" gutterBottom>
          To be implemented...
        </Typography>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    selectedNavigationItem: state.globals.selectedNavigationItem
  };
};

const mapDispatchToProps = dispatch => {
  const handleSetSelectedNavigationItem = item => {
    dispatch(globalActions.setSelectedNavigationItem(item));
  };

  return {
    handleSetSelectedNavigationItem
  };
};

export const AboutPage = withStyles(styles)(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(AboutPageContainer)
);
