// @flow
import React from 'react';
import DiscoverExamplesContainer from './DiscoverExamplesContainer';
import DiscoverSelectorContainer from './DiscoverSelectorContainer';
import Grid from '@material-ui/core/Grid';
import { withStyles } from '@material-ui/core';

type Props = {
  classes: { root: { width: string } },
  onInputExampleClicked: any => void,
  onNextClicked: () => void
};

const styles = () => ({
  root: {
    width: '100%'
  }
});

const DiscoverInputSourcesComponent = ({
  classes,
  onInputExampleClicked,
  onNextClicked
}: Props) => (
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

DiscoverInputSourcesComponent.propTypes = {};

export default withStyles(styles)(DiscoverInputSourcesComponent);
