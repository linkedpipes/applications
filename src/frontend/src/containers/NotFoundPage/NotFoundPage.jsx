// @flow
import React, { PureComponent } from 'react';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';
import { GoogleAnalyticsWrapper } from '@utils';

const styles = theme => ({
  root: {
    textAlign: 'center',
    paddingTop: theme.spacing.unit * 20,
    position: 'absolute',
    left: '50%',
    top: '40%',
    transform: 'translate(-50%, -50%)'
  },
  button: {
    margin: theme.spacing.unit
  },
  input: {
    display: 'none'
  }
});

type Props = {
  classes: Object,
  location: Object
};

class NotFoundPage extends PureComponent<Props> {
  componentDidMount() {
    const page = this.props.location.pathname;
    GoogleAnalyticsWrapper.trackPage(page);
  }

  render() {
    const { classes } = this.props;
    return (
      <div className={classes.root}>
        <Typography variant="h1" gutterBottom>
          404
        </Typography>
        <Typography variant="h2" gutterBottom>
          Page not found...
        </Typography>
      </div>
    );
  }
}

export default withStyles(styles)(NotFoundPage);
