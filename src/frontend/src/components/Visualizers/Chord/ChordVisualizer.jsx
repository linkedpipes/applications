// @flow
import React from 'react';
import { withStyles, withTheme } from '@material-ui/core/styles';
import { VisualizersService } from '@utils';
import CircularProgress from '@material-ui/core/CircularProgress';
import ChordDiagram from 'react-chord-diagram';
import palette from 'google-palette';
import _ from 'lodash';

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

const styles = theme => ({
  filterSideBar: {
    overflowY: 'auto'
  },
  card: {},
  input: {},
  theme
});

const areEqual = (
  a: Array<{
    label: string,
    uri: string,
    visible: boolean,
    enabled: boolean,
    selected: boolean
  }>,
  b: Array<{
    label: string,
    uri: string,
    visible: boolean,
    enabled: boolean,
    selected: boolean
  }>
) => {
  if (!a || !b) return false;
  if (a.length !== b.length) return false;
  for (let i = 0; i < a.length; i += 1) {
    let eq = false;
    for (let j = 0; j < b.length; j += 1) {
      if (_.isEqual(a[i], b[j])) {
        eq = true;
        break;
      }
    }
    if (!eq) return false;
  }
  return true;
};

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
    if (!areEqual(prevProps.nodes, this.props.nodes)) {
      const nodes = this.props.nodes;
      // If there are no selected nodes, then bring all the data
      // (should never happen)
      if (this.props.nodes.length === 0) {
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
