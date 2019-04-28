// @flow
import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import { VisualizersService, Log } from '@utils';
import CircularProgress from '@material-ui/core/CircularProgress';
import ChordDiagram from 'react-chord-diagram';
import palette from 'google-palette';
import uuid from 'uuid';

type Props = {
  classes: {
    progress: number
  },
  selectedResultGraphIri: string,
  handleSetCurrentApplicationData: Function,
  isPublished: boolean,
  size: number
};

type State = {
  dataLoadingStatus: string,
  matrix: Array<Array<any>>,
  groupColors: Array<string>,
  groupLabels: Array<string>,
  size: number
};

const styles = theme => ({
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
    this.state = {
      dataLoadingStatus: 'loading',
      matrix: [],
      groupColors: [],
      groupLabels: [],
      size: props.size
    };
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    const elementVizDiv = document.getElementById('viz-div');
    if (nextProps.size !== prevState.size && elementVizDiv) {
      return {
        size: Math.min(elementVizDiv.clientHeight, elementVizDiv.clientWidth)
      };
    }
    return null;
  }

  async componentDidMount() {
    const { handleSetCurrentApplicationData, isPublished } = this.props;
    const elementVizDiv = document.getElementById('viz-div');
    if (elementVizDiv) {
      if (!isPublished) {
        handleSetCurrentApplicationData({
          id: uuid.v4(),
          applicationEndpoint: 'chord',
          selectedResultGraphIri: this.props.selectedResultGraphIri,
          visualizerCode: 'CHORD'
        });
      }

      const nodesRequest = await VisualizersService.getChordNodes(
        this.props.selectedResultGraphIri
      );
      const nodesResponse = await nodesRequest.data;
      const nodeUris = nodesResponse.map(node => node.uri);
      const labels = nodesResponse.map(node => node.label.languageMap.nolang);

      const matrixRequest = await VisualizersService.getChordData(
        this.props.selectedResultGraphIri,
        nodeUris
      );
      const matrixData = await matrixRequest.data;

      const colors = palette('sol-accent', nodeUris.length).map(
        color => `#${color}`
      );

      this.setState({
        dataLoadingStatus: 'ready',
        matrix: matrixData,
        groupColors: colors,
        groupLabels: labels,
        size: Math.min(elementVizDiv.clientHeight, elementVizDiv.clientWidth)
      });
    }
  }

  render() {
    if (this.state.size < 150) {
      return (
        <div>
          Window too small to draw the visualization. Please resize window.
        </div>
      );
    }
    return this.state.dataLoadingStatus !== 'ready' ? (
      <CircularProgress />
    ) : (
      <ChordDiagram
        groupLabels={this.state.groupLabels}
        groupColors={this.state.groupColors}
        matrix={this.state.matrix}
        componentId={1}
        labelColors={this.state.groupLabels.map(() => 'whitesmoke')}
        height={this.state.size}
        width={this.state.size}
        style={{ font: '10px sans-serif' }}
      />
    );
  }
}

export default withStyles(styles)(ChordVisualizer);
