// @flow
import React from 'react';
import ChordDiagram from 'react-chord-diagram';
import palette from 'google-palette';
import equal from 'fast-deep-equal';
import { withStyles, withTheme } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';
import { VisualizersService, GlobalUtils } from '@utils';

type Props = {
  classes: {},
  selectedResultGraphIri: string,
  handleSetCurrentApplicationData: Function,
  selectedPipelineExecution: string,
  isPublished: boolean,
  theme: Object,
  nodes: Array<{
    label: string,
    uri: string,
    visible: boolean,
    enabled: boolean,
    selected: boolean
  }>,
  height: number,
  width: number
};

type State = {
  dataLoadingStatus: string,
  matrix: Array<Array<any>>,
  groupColors: Array<string>,
  groupLabels: Array<string>
};

// Styles
const styles = theme => ({
  filterSideBar: {
    overflowY: 'auto'
  },
  card: {},
  input: {},
  theme
});

class ChordVisualizer extends React.PureComponent<Props, State> {
  elementVizDiv: any;

  constructor(props: Props) {
    super(props);
    this.elementVizDiv = null;
    this.state = {
      dataLoadingStatus: 'loading',
      matrix: [],
      groupColors: [],
      groupLabels: []
    };
  }

  async componentDidMount() {
    const {
      handleSetCurrentApplicationData,
      isPublished,
      selectedResultGraphIri
    } = this.props;
    this.elementVizDiv = document.getElementById('viz-div');
    const nodes = this.props.nodes || [];

    if (this.elementVizDiv) {
      if (!isPublished) {
        handleSetCurrentApplicationData({
          endpoint: 'chord',
          graphIri: this.props.selectedResultGraphIri,
          etlExecutionIri: this.props.selectedPipelineExecution,
          visualizerType: 'CHORD'
        });
      }

      // Should never happen
      if (nodes.length === 0) {
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
        const selectedNodes = nodes.filter(node => node.selected);
        const labels = selectedNodes.map(node => node.label);

        const matrixRequest = await VisualizersService.getChordData(
          selectedResultGraphIri,
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
          groupLabels: labels
        });
      }
    }
  }

  async componentDidUpdate(prevProps: Props) {
    // Typical usage (don't forget to compare props):
    if (!equal(prevProps.nodes, this.props.nodes)) {
      const nodes = this.props.nodes;
      // If there are no selected nodes, then bring all the data
      // (should never happen)
      if (this.props.nodes.length === 0) {
        const nodesRequest = await VisualizersService.getChordNodes(
          this.props.selectedResultGraphIri
        );
        const nodesResponse = await nodesRequest.data;
        const nodeUris = nodesResponse.map(node => node.uri);
        const labels = nodesResponse.map(node =>
          GlobalUtils.getLanguageLabel(node.label.languageMap, node.uri)
        );

        const matrixRequest = await VisualizersService.getChordData(
          this.props.selectedResultGraphIri,
          nodeUris
        );
        const matrixData = await matrixRequest.data;

        const colors = palette('sol-accent', nodeUris.length).map(
          color => `#${color}`
        );

        // eslint-disable-next-line react/no-did-update-set-state
        this.setState({
          dataLoadingStatus: 'ready',
          matrix: matrixData,
          groupColors: colors,
          groupLabels: labels
        });
      } else {
        // Fetch data
        const selectedNodes = nodes.filter(node => node.selected);
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
          groupLabels: labels
        });
      }
    }
  }

  render() {
    const { theme, height, width } = this.props;
    const size = Math.max(150, Math.min(width, height) - 200);
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

export default withStyles(styles)(withTheme(ChordVisualizer));
