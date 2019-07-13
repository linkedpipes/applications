// @flow
import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';
import { filtersActions } from '@ducks/filtersDuck';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import FormLabel from '@material-ui/core/FormLabel';
import FormControl from '@material-ui/core/FormControl';
import Divider from '@material-ui/core/Divider';
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
    formControl: string,
    selectEmpty: string,
    formControl: {
      margin: number,
      minWidth: number,
      display: string
    },
    selectEmpty: {
      marginTop: number
    },
    panelDetails: {
      display: string
    },
    formGroup: {
      display: string
    },
    option: {
      display: string
    },
    divider: {
      marginBottom: string
    }
  },
  filters: Array<{
    filterUri: string,
    filterLabel: string,
    options: Array<{
      uri: string,
      label: string,
      selected: boolean,
      enabled: boolean,
      visible: boolean
    }>
  }>,
  enabled: boolean,
  onApplyFilter: Function,
  editingMode: boolean,
  registerCallback: Function,
  onApplyFilterWithSolid: Function
};

type State = {
  anchorEl: any,
  selectedFilterUri: ?string,
  selectedOption: {
    uri: string,
    label: string,
    selected: boolean,
    enabled: boolean,
    visible: boolean
  },
  filters: Array<{
    filterUri: string,
    filterLabel: string,
    options: Array<{
      uri: string,
      label: string,
      selected: boolean,
      enabled: boolean,
      visible: boolean
    }>
  }>
};

const styles = theme => ({
  formControl: {
    margin: theme.spacing(),
    minWidth: 100,
    display: 'block'
  },
  selectEmpty: {
    marginTop: theme.spacing(2)
  },
  panelDetails: {
    display: 'block'
  },
  formGroup: {
    display: 'block'
  },
  option: {
    display: 'inline'
  },
  icon: { display: 'inline' },
  divider: {
    marginBottom: '1rem'
  },
  menu: { marginTop: '2rem', marginLeft: '1rem' }
});

const processProperties = propertiesResponse => {
  const filters = propertiesResponse;
  return (
    Object.entries(filters)
      .map(entry => {
        const topUri: string = entry[0];
        // $FlowFixMe
        return Object.entries(entry[1]).map(entry2 => ({
          filterUri: topUri,
          // $FlowFixMe
          filterLabel: entry2[1].schemeLabel.languageMap.cs,
          // $FlowFixMe
          options: Object.entries(entry2[1].concepts).map(entry3 => ({
            uri: entry3[0],
            // $FlowFixMe
            label: entry3[1].languageMap.cs,
            selected: true,
            visible: true,
            enabled: true
          }))
        }));
      })
      // $FlowFixMe
      .flat()
  );
};

class MapSchemeFilterComponent extends React.Component<Props, State> {
  conceptsFetched: Set<string>;

  isMounted = false;

  constructor(props: Props) {
    super(props);
    (this: any).handleChange = this.handleChange.bind(this);
    (this: any).handleClick = this.handleClick.bind(this);
    (this: any).handleClose = this.handleClose.bind(this);
    (this: any).handleApplyFilter = this.handleApplyFilter.bind(this);
    // Initialize nodes with the ones passed from props
    this.state = {
      anchorEl: null,
      selectedOption: {},
      selectedFilterUri: null,
      filters: this.props.filters || []
    };
  }

  async componentDidMount() {
    this.isMounted = true;
    // Get all the nodes
    if (this.props.editingMode && this.props.filters.length === 0) {
      let filters = [];

      const getNodesResponse = await VisualizersService.getProperties(
        this.props.selectedResultGraphIri
      );
      filters = processProperties(getNodesResponse.data.filters);
      // Dispatch setNodes
      this.setState(
        {
          filters
        },
        () => {
          this.props.onApplyFilterWithSolid(
            this.state.filters,
            this.props.editingMode
          );
        }
      );
    } else {
      // Dispatch setNodes
      this.props.onApplyFilter(this.state.filters);
    }
    // Register callback
    this.props.registerCallback(this.handleApplyFilter);
  }

  componentWillReceiveProps(nextProps) {
    if (this.isMounted && !this.props.editingMode) {
      const filters = nextProps.filters;

      this.setState(
        {
          filters
        },
        () => {
          this.props.onApplyFilter(this.state.filters);
        }
      );
    }
  }

  componentWillUnmount = () => {
    this.isMounted = false;
  };

  handleApplyFilter = async () => {
    if (this.props.editingMode) {
      await this.props.onApplyFilterWithSolid(
        this.state.filters,
        this.props.editingMode
      );
    } else {
      await this.props.onApplyFilter(this.state.filters);
    }
  };

  handleClick = (filterUri, option) => event => {
    this.setState({
      anchorEl: event.currentTarget,
      selectedFilterUri: filterUri,
      selectedOption: option
    });
  };

  handleClose = () => {
    this.setState({
      anchorEl: null
    });
  };

  handleVisibleChange = () => {};

  handleChange = ({ filterUri, optionUri }) => event => {
    if (this.isMounted) {
      const checked = event.target.checked;
      this.setState(prevState => ({
        filters: prevState.filters.map(filter => {
          if (filter.filterUri === filterUri) {
            return {
              ...filter,
              options: filter.options.map(option => {
                if (option.uri === optionUri) {
                  return { ...option, selected: checked };
                }
                return option;
              })
            };
          }
          return filter;
        })
      }));
    }
  };

  render() {
    const { classes, editingMode, enabled } = this.props;

    return (
      <React.Fragment>
        <ExpansionPanelDetails className={classes.panelDetails}>
          {this.state.filters &&
            this.state.filters.map(filter => (
              <div key={filter.filterLabel}>
                <FormControl
                  disabled={!enabled && !editingMode}
                  row
                  className={classes.formControl}
                >
                  <FormLabel component="legend">{filter.filterLabel}</FormLabel>
                  <FormGroup row className={classes.formGroup}>
                    {filter &&
                      filter.options.map(
                        option =>
                          (editingMode || option.visible) && (
                            <div>
                              {this.props.editingMode && (
                                <IconButton
                                  className={classes.icon}
                                  onClick={this.handleClick(
                                    filter.filterUri,
                                    option
                                  )}
                                >
                                  <MoreVertIcon />
                                </IconButton>
                              )}
                              <FormControlLabel
                                control={
                                  <React.Fragment>
                                    <Checkbox
                                      onChange={this.handleChange({
                                        filterUri: filter.filterUri,
                                        optionUri: option.uri
                                      })}
                                      checked={option.selected}
                                      value={option}
                                    />
                                  </React.Fragment>
                                }
                                label={option.label}
                                className={classes.option}
                                key={option.uri}
                                disabled={!option.enabled || !enabled}
                              />
                            </div>
                          )
                      )}
                  </FormGroup>
                </FormControl>
                <Divider className={classes.divider} variant="middle" />
              </div>
            ))}
        </ExpansionPanelDetails>
        <Menu
          anchorEl={this.state.anchorEl}
          open={Boolean(this.state.anchorEl)}
          onClose={this.handleClose}
          className={classes.menu}
        >
          {this.state.selectedOption && [
            <MenuItem
              onClick={() => {
                const newChecked = !this.state.selectedOption.enabled;
                this.setState(prevState => {
                  return {
                    filters: prevState.filters.map(f => {
                      if (f.filterUri === prevState.selectedFilterUri) {
                        return {
                          ...f,
                          options: f.options.map(o => {
                            if (
                              o.uri ===
                              (prevState.selectedOption &&
                                prevState.selectedOption.uri)
                            ) {
                              return {
                                ...o,
                                enabled: newChecked
                              };
                            }
                            return o;
                          })
                        };
                      }
                      return f;
                    })
                  };
                });
                this.handleClose();
              }}
            >
              <Checkbox
                checked={this.state.selectedOption.enabled}
                value={this.state.selectedOption.enabled}
              />
              Enabled for interaction
            </MenuItem>,
            <MenuItem
              onClick={() => {
                const newVisible = !this.state.selectedOption.visible;
                this.setState(prevState => {
                  return {
                    filters: prevState.filters.map(f => {
                      if (f.filterUri === prevState.selectedFilterUri) {
                        return {
                          ...f,
                          options: f.options.map(o => {
                            if (
                              o.uri ===
                              (prevState.selectedOption &&
                                prevState.selectedOption.uri)
                            ) {
                              return {
                                ...o,
                                visible: newVisible
                              };
                            }
                            return o;
                          })
                        };
                      }
                      return f;
                    })
                  };
                });
                this.handleClose();
              }}
            >
              <Checkbox
                checked={this.state.selectedOption.visible}
                value={this.state.selectedOption.visible}
              />
              Visible to the end user
            </MenuItem>
          ]}
        </Menu>
      </React.Fragment>
    );
  }
}

const mapDispatchToProps = dispatch => {
  const onApplyFilter = filters =>
    dispatch(filtersActions.setSelectedMapOptions(filters));

  const onApplyFilterWithSolid = (filters, isEditing) =>
    dispatch(filtersActions.setSelectedMapOptionsWithSolid(filters, isEditing));
  return {
    onApplyFilter,
    onApplyFilterWithSolid
  };
};

export default connect(
  null,
  mapDispatchToProps
)(withStyles(styles)(MapSchemeFilterComponent));
