// @flow
import React from 'react';
import { withStyles, withTheme } from '@material-ui/core/styles';
import { VisualizersService } from '@utils';
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
  size: number,
  selectedNodes: Set<string>,
  theme: Object
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
  },
  theme
});

const eqSet = (as, bs) => {
  if (!as || !bs) return false;
  if (as.size !== bs.size) return false;
  // eslint-disable-next-line no-restricted-syntax
  for (const a of as) if (!bs.has(a)) return false;
  return true;
};

class ChordVisualizer extends React.PureComponent<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      dataLoadingStatus: 'loading',
      matrix: [],
      groupColors: [],
      groupLabels: [],
      size: 500
    };
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
          selectedPipelineExecution: this.props.selectedPipelineExecution,
          visualizerCode: 'CHORD',
          selectedNodes: this.props.selectedNodes && [
            ...this.props.selectedNodes
          ]
        });
      }

      if (!this.props.selectedNodes || !this.props.selectedNodes.size) {
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
      } else {
        // Fetch data
        const nodesRequest = await VisualizersService.getChordNodes(
          this.props.selectedResultGraphIri
        );
        const nodesResponse = await nodesRequest.data;
        const labels = nodesResponse
          .filter(node => this.props.selectedNodes.has(node.uri))
          .map(node => node.label.languageMap.nolang);

        const matrixRequest = await VisualizersService.getChordData(
          this.props.selectedResultGraphIri,
          [...this.props.selectedNodes]
        );
        const matrixData = await matrixRequest.data;

        const colors = palette('sol-accent', labels.length).map(
          color => `#${color}`
        );

        // eslint-disable-next-line react/no-did-update-set-state
        this.setState({
          dataLoadingStatus: 'ready',
          matrix: matrixData,
          groupColors: colors,
          groupLabels: labels,
          size: Math.min(elementVizDiv.clientHeight, elementVizDiv.clientWidth)
        });
      }
    }
  }

  async componentDidUpdate(prevProps) {
    // Typical usage (don't forget to compare props):
    if (
      this.props.selectedNodes &&
      !eqSet(prevProps.selectedNodes, this.props.selectedNodes)
    ) {
      // Fetch data
      const nodesRequest = await VisualizersService.getChordNodes(
        this.props.selectedResultGraphIri
      );
      const nodesResponse = await nodesRequest.data;
      const labels = nodesResponse
        .filter(node => this.props.selectedNodes.has(node.uri))
        .map(node => node.label.languageMap.nolang);

      const matrixRequest = await VisualizersService.getChordData(
        this.props.selectedResultGraphIri,
        [...this.props.selectedNodes]
      );
      const matrixData = await matrixRequest.data;

      const colors = palette('sol-accent', labels.length).map(
        color => `#${color}`
      );

      // eslint-disable-next-line react/no-did-update-set-state
      this.setState({
        dataLoadingStatus: 'ready',
        matrix: matrixData,
        groupColors: colors,
        groupLabels: labels
      });

      if (!this.props.isPublished) {
        this.props.handleSetCurrentApplicationData({
          selectedNodes: [...this.props.selectedNodes]
        });
      }
    }

    const elementVizDiv = document.getElementById('viz-div');
    if (elementVizDiv && prevProps.size !== this.props.size) {
      // eslint-disable-next-line react/no-did-update-set-state
      this.setState({
        size: Math.min(elementVizDiv.clientHeight, elementVizDiv.clientWidth)
      });
    }
  }

  render() {
    const { theme } = this.props;
    const size = Math.max(this.state.size, 150);
    return this.state.dataLoadingStatus !== 'ready' ? (
      <CircularProgress />
    ) : (
      <ChordDiagram
        groupLabels={this.state.groupLabels}
        groupColors={this.state.groupColors}
        matrix={this.state.matrix}
        componentId={1}
        labelColors={this.state.groupLabels.map(
          () => theme.palette.text.primary
        )}
        height={size}
        width={size}
        style={{ font: '10px sans-serif', paddingBottom: '0' }}
      />
    );
  }
}

export default withStyles(styles)(withTheme()(ChordVisualizer));
