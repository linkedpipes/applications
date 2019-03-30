// @flow
import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import { VisualizersService } from '@utils';
import { CircularProgress } from '@material-ui/core';
import ChordDiagram from 'react-chord-diagram';

type Props = {
  classes: {
    progress: number
  },
  selectedResultGraphIri: string
};

type State = {
  dataLoadingStatus: string,
  matrix: Array<Array<any>>
};

const styles = theme => ({
  root: {
    height: '72vh'
  },
  filterSideBar: {
    overflowY: 'auto'
  },
  card: {},
  input: {},
  progress: {
    margin: theme.spacing.unit * 2,
    alignItems: 'center'
  }
});

class ChordVisualizer extends React.PureComponent<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { dataLoadingStatus: 'loading', matrix: [] };
  }

  async componentDidMount() {
    const response = await VisualizersService.getChordData(
      'https://applications.linkedpipes.com/generated-data/'
    );
    const jsonData = await response.data;
    this.setState({
      dataLoadingStatus: 'ready',
      matrix: jsonData
    });
  }

  render() {
    return this.state.dataLoadingStatus !== 'ready' ? (
      <CircularProgress />
    ) : (
      <ChordDiagram matrix={this.state.matrix} componentId={1} />
    );
  }
}

// groupLabels={['Black', 'Yellow', 'Brown', 'Orange']}
// groupColors={['#000000', '#FFDD89', '#957244', '#F26223']}

export default withStyles(styles)(ChordVisualizer);
