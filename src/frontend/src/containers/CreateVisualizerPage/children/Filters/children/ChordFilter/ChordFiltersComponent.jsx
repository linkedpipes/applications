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
import IconButton from '@material-ui/core/IconButton';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import { VisualizersService } from '@utils';

type Props = {
  selectedResultGraphIri: string,
  classes: {
    menu: { marginTop: string, marginLeft: string },
    icon: { display: string },
    progress: number,
    formControl: {},
    selectEmpty: string,
    option: {},
    formGroup: {}
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
  }>,
  selectedNode: ?{
    label: string,
    uri: string,
    visible: boolean,
    enabled: boolean,
    selected: boolean
  },
  anchorEl: any
};

const styles = theme => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: 100
  },
  selectEmpty: {
    marginTop: theme.spacing(2)
  },
  formGroup: {
    display: 'block'
  },
  option: {
    display: 'inline'
  },
  icon: { display: 'inline' },
  menu: { marginTop: '2rem', marginLeft: '1rem' }
});

class ChordFiltersComponent extends React.Component<Props, State> {
  conceptsFetched: Set<string>;

  isMounted = false;

  constructor(props: Props) {
    super(props);
    (this: any).handleChange = this.handleChange.bind(this);
    (this: any).handleClick = this.handleClick.bind(this);
    (this: any).handleClose = this.handleClose.bind(this);
    // Initialize nodes with the ones passed from props
    this.state = {
      nodes: this.props.nodes || [],
      selectedNode: null,
      anchorEl: null
    };
  }

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

  handleClick = node => event => {
    this.setState({
      anchorEl: event.currentTarget,
      selectedNode: node
    });
  };

  handleClose = () => {
    this.setState({
      anchorEl: null
    });
  };

  render() {
    const { classes, editingMode } = this.props;
    return (
      <React.Fragment>
        <ExpansionPanelDetails>
          <FormGroup disabled row className={classes.formGroup}>
            {this.state.nodes.map(
              node =>
                (editingMode || node.visible) && (
                  <div>
                    {editingMode && (
                      <IconButton
                        className={classes.icon}
                        onClick={this.handleClick(node)}
                      >
                        <MoreVertIcon />
                      </IconButton>
                    )}
                    <FormControlLabel
                      key={node.uri}
                      className={classes.option}
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
                  </div>
                )
            )}
          </FormGroup>
        </ExpansionPanelDetails>
        <Menu
          anchorEl={this.state.anchorEl}
          open={Boolean(this.state.anchorEl)}
          onClose={this.handleClose}
          className={classes.menu}
        >
          {this.state.selectedNode && (
            <React.Fragment>
              <MenuItem onClick={this.handleClose}>
                <Checkbox
                  checked={this.state.selectedNode.enabled}
                  onChange={event => {
                    const checked = event.target.checked;
                    this.setState(prevState => ({
                      nodes: prevState.nodes.map(node => {
                        if (
                          node.uri ===
                          (prevState.selectedNode && prevState.selectedNode.uri)
                        ) {
                          return { ...node, enabled: checked };
                        }
                        return node;
                      })
                    }));
                  }}
                  value={this.state.selectedNode.enabled}
                />
                Enabled for interaction
              </MenuItem>
              <MenuItem onClick={this.handleClose}>
                <Checkbox
                  checked={this.state.selectedNode.visible}
                  onChange={event => {
                    const checked = event.target.checked;
                    this.setState(prevState => ({
                      nodes: prevState.nodes.map(node => {
                        if (
                          node.uri ===
                          (prevState.selectedNode && prevState.selectedNode.uri)
                        ) {
                          return { ...node, visible: checked };
                        }
                        return node;
                      })
                    }));
                  }}
                  value={this.state.selectedNode.visible}
                />
                Visible to the end user
              </MenuItem>
            </React.Fragment>
          )}
        </Menu>
      </React.Fragment>
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
