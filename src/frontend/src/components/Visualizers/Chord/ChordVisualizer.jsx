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
  selectedPipelineExecution: string,
  isPublished: boolean,
  theme: Object,
  height: number,
  width: number,
  selectedNodes: Array<{ label: string, uri: string }>
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

const areEqual = (
  a: Array<{ label: string, uri: string }>,
  b: Array<{ label: string, uri: string }>
) => {
  if (!a || !b) return false;
  if (a.length !== b.length) return false;
  const aUris = new Set(a.map(node => node.uri));
  return b.reduce((acc, node) => acc && aUris.has(node.uri), true);
};

class ChordVisualizer extends React.PureComponent<Props, State> {
  elementVizDiv: { clientHeight: number, clientWidth: number };

  constructor(props: Props) {
    super(props);
    this.elementVizDiv = null;
    this.state = {
      dataLoadingStatus: 'loading',
      matrix: [],
      groupColors: [],
      groupLabels: [],
      size: 150
    };
  }

  // static getDerivedStateFromProps(nextProps, prevState) {
  //   const newFiltersState = nextProps.filtersState;
  //   const selectedNodes = newFiltersState.filterGroups[0].selectedOptions.map(
  //     node => node.uri
  //   );
  //   if (!isArrayEqual(selectedNodes, prevState.selectedNodes)) {
  //     return { selectedNodes };
  //   }
  //   return null;
  // }

  async componentDidMount() {
    const { handleSetCurrentApplicationData, isPublished } = this.props;
    this.elementVizDiv = document.getElementById('viz-div');
    const selectedNodes = this.props.selectedNodes || [];

    if (this.elementVizDiv) {
      if (!isPublished) {
        handleSetCurrentApplicationData({
          endpoint: 'chord',
          graphIri: this.props.selectedResultGraphIri,
          etlExecutionIri: this.props.selectedPipelineExecution,
          visualizerType: 'CHORD',
          applicationData: { selectedNodes }
        });
      }

      // If there are no selected nodes, then bring all the data
      if (selectedNodes.length === 0) {
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
          size: Math.min(
            this.elementVizDiv.clientHeight,
            this.elementVizDiv.clientWidth
          )
        });
      } else {
        // Fetch data
        const labels = selectedNodes.map(node => node.label);

        const matrixRequest = await VisualizersService.getChordData(
          this.props.selectedResultGraphIri,
          selectedNodes.map(node => node.uri)
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
          size: Math.min(
            this.elementVizDiv.clientHeight,
            this.elementVizDiv.clientWidth
          )
        });
      }
    }
  }

  async componentDidUpdate(prevProps) {
    this.elementVizDiv = document.getElementById('viz-div'); // is this necessary?
    const size = Math.min(
      this.elementVizDiv.clientHeight,
      this.elementVizDiv.clientWidth
    );
    // Typical usage (don't forget to compare props):
    if (!areEqual(prevProps.selectedNodes, this.props.selectedNodes)) {
      const selectedNodes = this.props.selectedNodes;
      // If there are no selected nodes, then bring all the data
      if (selectedNodes.length === 0) {
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
          groupLabels: labels
        });
      } else {
        // Fetch data
        const labels = selectedNodes.map(node => node.label);

        const matrixRequest = await VisualizersService.getChordData(
          this.props.selectedResultGraphIri,
          selectedNodes.map(node => node.uri)
        );
        const matrixData = await matrixRequest.data;

        const colors = palette('sol-accent', labels.length).map(
          color => `#${color}`
        );

        this.setState({
          dataLoadingStatus: 'ready',
          matrix: matrixData,
          groupColors: colors,
          groupLabels: labels
        });
      }
      // if (!this.props.isPublished) {
      //   this.props.handleSetCurrentApplicationData({
      //     selectedNodes
      //   });
      // }
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
