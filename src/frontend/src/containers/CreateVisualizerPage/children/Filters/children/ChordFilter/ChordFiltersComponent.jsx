// @flow
import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import { VisualizersService } from '@utils';
import FormControl from '@material-ui/core/FormControl';
import { connect } from 'react-redux';
import { filtersActions } from '@ducks/filtersDuck';
import Button from '@material-ui/core/Button';
import FormLabel from '@material-ui/core/FormLabel';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';

type Props = {
  selectedResultGraphIri: string,
  classes: {
    progress: number,
    formControl: string,
    selectEmpty: string
  },
  nodes: Array<{ label: { languageMap: { nolang: string } }, uri: string }>,
  onApplyFilter: Function
};
type State = {
  nodes: Array<{
    label: { languageMap: { nolang: string } },
    uri: string,
    checked: boolean
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

class ChordFiltersComponent extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      nodes: [] // Initialize with the props
    };
  }

  async componentDidMount() {
    // Get nodes
    const getNodesResponse = await VisualizersService.getChordNodes(
      this.props.selectedResultGraphIri
    );
    const nodes = getNodesResponse.data;
    if (nodes.length) {
      this.setState({
        nodes: nodes.map(node => {
          return { ...node, checked: true };
        })
      });
    }
  }

  handleApplyFilter = async () => {
    // dispatch set selected scheme
    await this.props.onApplyFilter(this.state.nodes);
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

  conceptsFetched: Set<string>;

  // todo: add switch to define whether it is editable by users
  render() {
    const { classes } = this.props;
    return (
      <FormControl component="fieldset" className={classes.formControl}>
        <FormLabel component="legend">
          Nodes{' '}
          <Button
            onClick={this.handleApplyFilter}
            disabled={!this.state.nodes.length}
            variant="contained"
            size="small"
            color="primary"
          >
            Apply
          </Button>
        </FormLabel>
        <FormGroup>
          {(this.state.nodes || []).map(node => (
            <FormControlLabel
              key={node.uri}
              control={
                <Checkbox
                  checked={node.checked}
                  onChange={this.handleChange(node.uri)}
                  value={node.uri}
                />
              }
              label={node.label.languageMap.nolang}
            />
          ))}
        </FormGroup>
      </FormControl>
    );
  }
}

const mapDispatchToProps = dispatch => {
  const onApplyFilter = nodes =>
    dispatch(
      filtersActions.setSelectedNodes(
        new Set(nodes.filter(node => node.checked).map(node => node.uri))
      )
    );
  return {
    onApplyFilter
  };
};

const mapStateToProps = state => {
  return {
    nodes: state.filters.nodes
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(ChordFiltersComponent));
