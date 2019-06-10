// @flow
import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import { VisualizersService } from '@utils';
import { connect } from 'react-redux';
import { filtersActions } from '@ducks/filtersDuck';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import uuid from 'uuid';
import lodash from 'lodash';

type Props = {
  selectedResultGraphIri: string,
  classes: {
    progress: number,
    formControl: string,
    selectEmpty: string
  },
  selectedNodes: Array<{
    label: string,
    uri: string
  }>,
  onApplyFilter: Function,
  editingMode: boolean,
  registerCallback: Function,
  name: string
};

type State = {
  nodes: Array<{
    label: { languageMap: { nolang: string } },
    uri: string,
    checked: boolean
  }>,
  selectedNodes: Array<{
    label: string,
    uri: string
  }>
};

const styles = theme => ({
  formControl: {
    margin: theme.spacing.unit,
    minWidth: 100
  },
  selectEmpty: {
    marginTop: theme.spacing.unit * 2
  }
});

const isArrayEqual = (x, y) => {
  return lodash(x)
    .differenceWith(y, lodash.isEqual)
    .isEmpty();
};

class ChordFiltersComponent extends React.Component<Props, State> {
  conceptsFetched: Set<string>;

  constructor(props: Props) {
    super(props);
    this.state = {
      nodes: [], // Initialize with the props
      selectedNodes: []
    };
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (!isArrayEqual(nextProps.selectedNodes, prevState.selectedNodes)) {
      return { selectedNodes: nextProps.selectedNodes };
    }
    return null;
  }

  async componentDidMount() {
    // Get all the nodes
    let nodes = [];
    const getNodesResponse = await VisualizersService.getChordNodes(
      this.props.selectedResultGraphIri
    );
    nodes = getNodesResponse.data || [];

    //
    if (
      this.props.editingMode &&
      (this.props.selectedNodes || []).length === 0
    ) {
      this.setState({
        nodes: nodes.map(node => {
          return { ...node, checked: true };
        }),
        selectedNodes: nodes.map(node => ({
          uri: node.uri,
          label: node.label.languageMap.nolang
        }))
      });
    } else {
      const selectedNodes = this.props.selectedNodes.map(node => node.uri);
      this.setState({
        nodes: nodes.map(node => {
          return { ...node, checked: selectedNodes.includes(node.uri) };
        }),
        selectedNodes: this.props.selectedNodes
      });
    }

    // Register callback
    this.props.registerCallback(this.handleApplyFilter);
  }

  handleApplyFilter = async () => {
    await this.props.onApplyFilter(this.props.name, this.state.nodes);
  };

  handleChange = uri => event => {
    const checked = event.target.checked;
    this.setState(prevState => ({
      nodes: prevState.nodes.map(node => {
        if (node.uri === uri) {
          return { ...node, checked };
        }
        return node;
      })
    }));
  };

  render() {
    // const { classes } = this.props;
    return (
      <ExpansionPanelDetails>
        <FormGroup>
          {(this.state.nodes || []).map(node => (
            <span key={node.uri}>
              <FormControlLabel
                key={uuid.v4()}
                control={
                  <Checkbox
                    value={node.uri}
                    checked={node.checked}
                    onChange={this.handleChange(node.uri)}
                  />
                }
                label={node.label.languageMap.nolang}
              />
              {/* <FormControlLabel
                control={<Switch checked value="checkedA" color="primary" />}
                label="Enabled"
              />
              <FormControlLabel
                control={<Switch checked value="checkedA" color="primary" />}
                label="Visible"
              /> */}
            </span>
          ))}
        </FormGroup>
      </ExpansionPanelDetails>
    );
  }
}

const mapDispatchToProps = dispatch => {
  const onApplyFilter = (filterName, nodes) =>
    dispatch(
      filtersActions.setSelectedNodes(
        filterName,
        nodes
          .filter(node => node.checked)
          .map(node => ({
            uri: node.uri,
            label: node.label.languageMap.nolang
          }))
      )
    );
  return {
    onApplyFilter
  };
};

export default connect(
  null,
  mapDispatchToProps
)(withStyles(styles)(ChordFiltersComponent));
