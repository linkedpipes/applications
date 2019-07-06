// @flow
import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';
import { filtersActions } from '@ducks/filtersDuck';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import Switch from '@material-ui/core/Switch';
// import _ from 'lodash';
import uuid from 'uuid';
import { VisualizersService } from '@utils';

type Props = {
  selectedResultGraphIri: string,
  classes: {
    progress: number,
    formControl: string,
    selectEmpty: string
  },
  nodes: Array<{
    label: string,
    uri: string,
    visible: boolean,
    enabled: boolean,
    selected: boolean
  }>,
  onApplyFilter: Function,
  editingMode: boolean,
  registerCallback: Function,
  name: string
};

type State = {
  nodes: Array<{
    label: string,
    uri: string,
    visible: boolean,
    enabled: boolean,
    selected: boolean
  }>
};

const styles = theme => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: 100
  },
  selectEmpty: {
    marginTop: theme.spacing(2)
  }
});

// const isArrayEqual = (x, y) => {
//   return _(x)
//     .differenceWith(y, _.isEqual)
//     .isEmpty();
// };

class ChordFiltersComponent extends React.Component<Props, State> {
  conceptsFetched: Set<string>;

  isMounted = false;

  constructor(props: Props) {
    super(props);
    (this: any).handleChange = this.handleChange.bind(this);
    // Initialize nodes with the ones passed from props
    this.state = {
      nodes: this.props.nodes || []
    };
  }

  // Currently messing with state
  // static getDerivedStateFromProps(nextProps, prevState) {
  //   if (nextProps.nodes.length && !areEqual(nextProps.nodes, prevState.nodes)) {
  //     return { nodes: nextProps.nodes };
  //   }
  //   return null;
  // }

  async componentDidMount() {
    this.isMounted = true;
    // Get all the nodes
    if (this.props.editingMode && !this.state.nodes.length) {
      let nodes = [];
      const getNodesResponse = await VisualizersService.getChordNodes(
        this.props.selectedResultGraphIri
      );
      nodes = (getNodesResponse.data || []).map(node => ({
        ...node,
        label: node.label.languageMap.nolang,
        visible: true,
        enabled: true,
        selected: true
      }));

      // Dispatch setNodes
      this.setState(
        {
          nodes
        },
        () => {
          this.props.onApplyFilter(
            this.props.name,
            this.state.nodes,
            this.props.editingMode
          );
        }
      );
    } else {
      // Dispatch setNodes
      this.props.onApplyFilter(
        this.props.name,
        this.state.nodes,
        this.props.editingMode
      );
    }

    // Register callback
    this.props.registerCallback(this.handleApplyFilter);
  }

  componentWillUnmount = () => {
    this.isMounted = false;
  };

  handleApplyFilter = async () => {
    await this.props.onApplyFilter(
      this.props.name,
      this.state.nodes,
      this.props.editingMode
    );
  };

  handleChange = uri => event => {
    if (this.isMounted) {
      const checked = event.target.checked;
      this.setState(prevState => ({
        nodes: prevState.nodes.map(node => {
          if (node.uri === uri) {
            return { ...node, selected: checked };
          }
          return node;
        })
      }));
    }
  };

  render() {
    return (
      <ExpansionPanelDetails>
        <FormGroup row>
          {this.state.nodes.map(node => (
            <span key={node.uri}>
              <FormControlLabel
                key={uuid.v4()}
                control={
                  <Checkbox
                    value={node.uri}
                    checked={node.selected}
                    onChange={this.handleChange(node.uri)}
                  />
                }
                label={node.label}
                disabled={!node.enabled}
              />
              {this.props.editingMode && (
                <span>
                  <FormControlLabel
                    control={
                      <Switch checked value="checkedA" color="primary" />
                    }
                    label="Enabled"
                  />
                  <FormControlLabel
                    control={
                      <Switch checked value="checkedA" color="primary" />
                    }
                    label="Visible"
                  />
                </span>
              )}
            </span>
          ))}
        </FormGroup>
      </ExpansionPanelDetails>
    );
  }
}

const mapDispatchToProps = dispatch => {
  const onApplyFilter = (filterName, nodes, isEditing) =>
    dispatch(
      filtersActions.setSelectedNodesWithSolid(filterName, nodes, isEditing)
    );
  return {
    onApplyFilter
  };
};

export default connect(
  null,
  mapDispatchToProps
)(withStyles(styles)(ChordFiltersComponent));
