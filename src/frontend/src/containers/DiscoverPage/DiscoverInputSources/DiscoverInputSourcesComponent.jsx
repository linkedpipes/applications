import React from 'react';
import DiscoverExamplesContainer from './DiscoverExamplesContainer';
import DiscoverSelectorContainer from './DiscoverSelectorContainer';
import PropTypes from 'prop-types';
import Grid from '@material-ui/core/Grid';
import { withStyles } from '@material-ui/core';

const styles = () => ({
  root: {
    width: '100%'
  }
});

const DiscoverInputSourcesComponent = ({
  classes,
  onInputExampleClicked,
  onNextClicked
}) => (
  <div className={classes.root}>
    <Grid container spacing={24}>
      <Grid item xs={8} sm={8}>
        <DiscoverSelectorContainer
          onInputExampleClicked={onInputExampleClicked}
          onNextClicked={onNextClicked}
        />
      </Grid>
      <Grid item xs={4} sm={4}>
        <DiscoverExamplesContainer
          onInputExampleClicked={onInputExampleClicked}
        />
      </Grid>
    </Grid>
  </div>
);

DiscoverInputSourcesComponent.propTypes = {
  classes: PropTypes.object.isRequired,
  onInputExampleClicked: PropTypes.any,
  onNextClicked: PropTypes.any,
};

export default withStyles(styles)(DiscoverInputSourcesComponent);
