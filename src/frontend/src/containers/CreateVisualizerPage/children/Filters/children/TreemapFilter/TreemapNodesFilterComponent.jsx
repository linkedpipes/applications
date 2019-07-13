// @flow
import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';
import { filtersActions } from '@ducks/filtersDuck';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import Checkbox from '@material-ui/core/Checkbox';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import IconButton from '@material-ui/core/IconButton';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import { VisualizersService, GlobalUtils } from '@utils';

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
  concepts: Array<{
    label: string,
    uri: string,
    visible: boolean,
    enabled: boolean,
    selected: boolean
  }>,
  selectedScheme: { uri: string },
  onApplyFilter: Function,
  editingMode: boolean,
  registerCallback: Function,
  name: string,
  enabled: boolean
};

type State = {
  concepts: Array<{
    label: string,
    uri: string,
    visible: boolean,
    enabled: boolean,
    selected: boolean
  }>,
  selectedConcept: ?{
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

class TreemapNodesFilterComponent extends React.Component<Props, State> {
  conceptsFetched: Set<string>;

  isMounted = false;

  constructor(props: Props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.handleApplyFilter = this.handleApplyFilter.bind(this);
    // Initialize nodes with the ones passed from props
    this.state = {
      concepts: this.props.concepts || [],
      selectedConcept: null,
      anchorEl: null
    };
  }

  async componentDidMount() {
    this.isMounted = true;
    // Get all the nodes
    if (
      this.props.editingMode &&
      this.props.concepts.length === 0 &&
      this.props.selectedScheme
    ) {
      let concepts = [];

      // Fetch nodes
      const getConceptsResponse = await VisualizersService.getSkosScheme(
        this.props.selectedScheme,
        this.props.selectedResultGraphIri
      );

      concepts = (getConceptsResponse.data || [])
        // .filter(concept => !!concept.parentId)
        .map(concept => ({
          uri: concept.id,
          label: GlobalUtils.getLanguageLabel(
            concept.label.languageMap,
            concept.id
          ),
          visible: true,
          enabled: true,
          selected: true
        }));

      // Dispatch setNodes
      this.setState(
        {
          concepts
        },
        () => {
          this.props.onApplyFilter(
            this.props.name,
            this.state.concepts,
            this.props.editingMode
          );
        }
      );
    } else {
      // Dispatch setNodes
      this.props.onApplyFilter(
        this.props.name,
        this.state.concepts,
        this.props.editingMode
      );
    }

    // Register callback
    this.props.registerCallback(this.handleApplyFilter);
  }

  async componentWillReceiveProps(nextProps) {
    const nextScheme = nextProps.selectedScheme;
    if (
      (nextScheme && nextScheme.uri) !==
      (this.props.selectedScheme && this.props.selectedScheme.uri)
    ) {
      let concepts = [];

      // Fetch nodes
      const getConceptsResponse = await VisualizersService.getSkosScheme(
        nextScheme.uri,
        this.props.selectedResultGraphIri
      );

      concepts = (getConceptsResponse.data || [])
        .filter(concept => !!concept.parentId)
        .map(concept => ({
          uri: concept.id,
          label: GlobalUtils.getLanguageLabel(
            concept.label.languageMap,
            concept.uri
          ),
          visible: true,
          enabled: true,
          selected: true
        }));

      // Dispatch setNodes
      this.setState(
        {
          concepts
        },
        () => {
          this.props.onApplyFilter(
            this.props.name,
            this.state.concepts,
            this.props.editingMode
          );
        }
      );
    }
  }

  componentWillUnmount = () => {
    this.isMounted = false;
  };

  handleApplyFilter = () => {
    this.props.onApplyFilter(
      this.props.name,
      this.state.concepts,
      this.props.editingMode
    );
  };

  handleChange = uri => event => {
    if (this.isMounted) {
      const checked = event.target.checked;
      this.setState(prevState => ({
        concepts: prevState.concepts.map(concept => {
          if (concept.uri === uri) {
            return { ...concept, selected: checked };
          }
          return concept;
        })
      }));
    }
  };

  handleClick = node => event => {
    this.setState({
      anchorEl: event.currentTarget,
      selectedConcept: node
    });
  };

  handleClose = () => {
    this.setState({
      anchorEl: null
    });
  };

  render() {
    const { classes, editingMode, enabled } = this.props;
    return (
      <React.Fragment>
        <ExpansionPanelDetails>
          <FormControl>
            <FormGroup row className={classes.formGroup}>
              {this.state.concepts.length
                ? this.state.concepts.map(
                    concept =>
                      (editingMode || concept.visible) && (
                        <div>
                          {editingMode && (
                            <IconButton
                              className={classes.icon}
                              onClick={this.handleClick(concept)}
                            >
                              <MoreVertIcon />
                            </IconButton>
                          )}
                          <FormControlLabel
                            key={concept.uri}
                            className={classes.option}
                            control={
                              <Checkbox
                                value={concept.uri}
                                checked={concept.selected}
                                onChange={this.handleChange(concept.uri)}
                              />
                            }
                            label={concept.label}
                            disabled={!enabled || !concept.enabled}
                          />
                        </div>
                      )
                  )
                : 'No options available'}
            </FormGroup>
          </FormControl>
        </ExpansionPanelDetails>
        <Menu
          anchorEl={this.state.anchorEl}
          open={Boolean(this.state.anchorEl)}
          onClose={this.handleClose}
          className={classes.menu}
        >
          {this.state.selectedConcept && (
            <React.Fragment>
              <MenuItem onClick={this.handleClose}>
                <Checkbox
                  checked={this.state.selectedConcept.enabled}
                  onChange={event => {
                    const checked = event.target.checked;
                    this.setState(prevState => ({
                      concepts: prevState.concepts.map(concept => {
                        if (
                          concept.uri ===
                          (prevState.selectedConcept &&
                            prevState.selectedConcept.uri)
                        ) {
                          return { ...concept, enabled: checked };
                        }
                        return concept;
                      })
                    }));
                  }}
                  value={this.state.selectedConcept.enabled}
                />
                Enabled for interaction
              </MenuItem>
              <MenuItem onClick={this.handleClose}>
                <Checkbox
                  checked={this.state.selectedConcept.visible}
                  onChange={event => {
                    const checked = event.target.checked;
                    this.setState(prevState => ({
                      concepts: prevState.concepts.map(concept => {
                        if (
                          concept.uri ===
                          (prevState.selectedConcept &&
                            prevState.selectedConcept.uri)
                        ) {
                          return { ...concept, visible: checked };
                        }
                        return concept;
                      })
                    }));
                  }}
                  value={this.state.selectedConcept.visible}
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
)(withStyles(styles)(TreemapNodesFilterComponent));
