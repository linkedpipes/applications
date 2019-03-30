// @flow
import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import { VisualizersService } from '@utils';
import { CircularProgress } from '@material-ui/core';
import ChordDiagram from 'react-chord-diagram';
import palette from 'google-palette';

type Props = {
  classes: {
    progress: number
  },
  selectedResultGraphIri?: string
};

type State = {
  dataLoadingStatus: string,
  matrix: Array<Array<any>>,
  groupColors: Array<string>,
  groupLabels: Array<string>
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
  static defaultProps = {
    selectedResultGraphIri:
      'https://applications.linkedpipes.com/generated-data/'
  };

  constructor(props: Props) {
    super(props);
    this.state = {
      dataLoadingStatus: 'loading',
      matrix: [],
      groupColors: [],
      groupLabels: []
    };
  }

  async componentDidMount() {
    const nodesRequest = await VisualizersService.getChordNodes();
    const nodesResponse = await nodesRequest.data;
    const nodeUris = nodesResponse.map(node => node.uri);

    const matrixRequest = await VisualizersService.getChordData(null, nodeUris);
    const matrixData = await matrixRequest.data;

    const colors = palette('sol-accent', nodeUris.length).map(
      color => `#${color}`
    );

    this.setState({
      dataLoadingStatus: 'ready',
      matrix: matrixData,
      groupColors: colors,
      groupLabels: nodeUris
    });
  }

  render() {
    return this.state.dataLoadingStatus !== 'ready' ? (
      <CircularProgress />
    ) : (
      <ChordDiagram
        groupLabels={this.state.groupLabels}
        groupColors={this.state.groupColors}
        matrix={this.state.matrix}
        componentId={1}
        style={{ color: 'white' }}
      />
    );
  }
}

export default withStyles(styles)(ChordVisualizer);
