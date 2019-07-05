// @flow
import React from 'react';
import DiscoverSelectorContainer from './DiscoverSelectorContainer';
import { withStyles } from '@material-ui/core/styles';

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
    <DiscoverSelectorContainer
      onInputExampleClicked={onInputExampleClicked}
      onNextClicked={onNextClicked}
    />
  </div>
);

DiscoverInputSourcesComponent.propTypes = {};

export default withStyles(styles)(DiscoverInputSourcesComponent);
