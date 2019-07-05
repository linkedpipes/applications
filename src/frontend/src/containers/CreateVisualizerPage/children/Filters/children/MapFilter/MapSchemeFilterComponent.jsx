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
import Switch from '@material-ui/core/Switch';
import FormLabel from '@material-ui/core/FormLabel';
import FormControl from '@material-ui/core/FormControl';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import MoreVertIcon from '@material-ui/icons/MoreVert';

type Props = {
  selectedResultGraphIri: string,
  classes: {
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
  onApplyFilter: Function,
  editingMode: boolean,
  registerCallback: Function,
  name: string
};

type State = {
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
    display: 'block'
  },
  divider: {
    marginBottom: '1rem'
  }
});

const processProperties = propertiesResponse => {
  const filters = propertiesResponse;
  return Object.entries(filters)
    .map(entry => {
      const topUri = entry[0];
      return Object.entries(entry[1]).map(entry2 => ({
        filterUri: topUri,
        filterLabel: entry2[1].schemeLabel.languageMap.cs,
        options: Object.entries(entry2[1].concepts).map(entry3 => ({
          uri: entry3[0],
          label: entry3[1].languageMap.cs,
          selected: true,
          visible: true,
          enabled: true
        }))
      }));
    })
    .flat();
};

class MapSchemeFilterComponent extends React.Component<Props, State> {
  conceptsFetched: Set<string>;

  isMounted = false;

  constructor(props: Props) {
    super(props);
    (this: any).handleChange = this.handleChange.bind(this);
    // Initialize nodes with the ones passed from props
    this.state = {
      filters: this.props.filters || []
    };
  }

  async componentDidMount() {
    this.isMounted = true;
    // Get all the nodes
    if (true) {
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
          this.props.onApplyFilter(this.state.filters);
        }
      );
    } else {
      // Dispatch setNodes
      this.props.onApplyFilter(this.state.filters);
    }
    // Register callback
    this.props.registerCallback(this.handleApplyFilter);
  }

  componentWillUnmount = () => {
    this.isMounted = false;
  };

  handleApplyFilter = async () => {
    await this.props.onApplyFilter(this.state.filters);
  };

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
    const { classes } = this.props;

    return (
      <ExpansionPanelDetails className={classes.panelDetails}>
        {this.state.filters.map(filter => (
          <div key={filter.filterLabel}>
            <FormControl row className={classes.formControl}>
              <FormLabel component="legend">{filter.filterLabel}</FormLabel>
              <FormGroup row className={classes.formGroup}>
                {filter.options.map(option => (
                  <FormControlLabel
                    control={
                      <Checkbox
                        onChange={this.handleChange({
                          filterUri: filter.filterUri,
                          optionUri: option.uri
                        })}
                        checked={option.selected}
                        value={option}
                      />
                    }
                    label={option.label}
                    className={classes.option}
                    key={option.uri}
                  />
                ))}
              </FormGroup>
            </FormControl>
            <Divider className={classes.divider} variant="middle" />
          </div>
        ))}
      </ExpansionPanelDetails>
    );
  }
}

const mapDispatchToProps = dispatch => {
  const onApplyFilter = filters =>
    dispatch(filtersActions.setSelectedMapOptions(filters));
  return {
    onApplyFilter
  };
};

export default connect(
  null,
  mapDispatchToProps
)(withStyles(styles)(MapSchemeFilterComponent));
