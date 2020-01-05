// @flow
import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Switch from '@material-ui/core/Switch';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Button from '@material-ui/core/Button';
import ChordFiltersComponent from './children/ChordFilter';
import {
  TreemapFiltersComponent,
  TreemapNodesFilterComponent
} from './children/TreemapFilter';
import MapSchemeFilterComponent from './children/MapFilter';
import { connect } from 'react-redux';
import { filtersActions } from '@ducks/filtersDuck';

const styles = theme => ({
  root: {
    width: '100%'
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
    flexBasis: '33.33%',
    flexShrink: 0
  },
  secondaryHeading: {
    fontSize: theme.typography.pxToRem(15),
    color: theme.palette.text.secondary
  },
  filterSpan: {
    paddingLeft: '1rem'
  },
  filterTitle: {
    paddingBottom: '1rem'
  },
  filterWrapper: {
    paddingBottom: '1rem'
  }
});

type Props = {
  classes: {
    root: {},
    filterTitle: {
      paddingBottom: string
    },
    filterWrapper: { paddingBottom: string },
    filterSpan: {},
    heading: {}
  },
  editingMode: boolean,
  selectedResultGraphIri: string,
  filtersState: {
    enabled: boolean,
    visible: boolean,
    filterGroups: {
      [key: string]: {
        label: string,
        enabled: boolean,
        options: Array<{ selected: boolean }>,
        filterType: string,
        visible: boolean
      },
      schemeFilter: any
    }
  },
  handleToggleEnabled: Function,
  handleToggleVisible: Function
};

type State = {
  filtersState: {}
};

class FiltersComponent extends React.Component<Props, State> {
  applyCallbacks: Array<Function> = [];

  registerCallback = callback => {
    this.applyCallbacks.push(callback);
  };

  getFilter = (filterGroup, enabled) => {
    const { filterType, filterLabel } = filterGroup;
    switch (filterType) {
      case 'NODES_FILTER':
        return (
          <ChordFiltersComponent
            editingMode={this.props.editingMode}
            registerCallback={this.registerCallback}
            nodes={filterGroup.options || []}
            selectedResultGraphIri={this.props.selectedResultGraphIri}
            name={filterLabel}
            enabled={enabled}
          />
        );
      case 'MAP_SCHEMES_FILTER':
        return (
          <MapSchemeFilterComponent
            editingMode={this.props.editingMode}
            registerCallback={this.registerCallback}
            filters={filterGroup.filters || []}
            selectedResultGraphIri={this.props.selectedResultGraphIri}
            name={filterLabel}
            enabled={enabled}
          />
        );
      case 'SCHEME_FILTER':
        return (
          <TreemapFiltersComponent
            editingMode={this.props.editingMode}
            registerCallback={this.registerCallback}
            schemes={filterGroup.options || []}
            selectedResultGraphIri={this.props.selectedResultGraphIri}
            name={filterLabel}
            enabled={enabled}
          />
        );
      case 'TREEMAP_NODES_FILTER':
        return (
          <TreemapNodesFilterComponent
            editingMode={this.props.editingMode}
            registerCallback={this.registerCallback}
            concepts={filterGroup.options || []}
            selectedScheme={
              (
                this.props.filtersState.filterGroups.schemeFilter.options || []
              ).find(e => e.selected) || null
            }
            selectedResultGraphIri={this.props.selectedResultGraphIri}
            name={filterLabel}
            enabled={enabled}
          />
        );
      default:
        return <div> Unknown filter type </div>;
    }
  };

  handleSwitchChange = name => event => {
    const newValue = event.target.checked;
    this.setState(prevState => {
      return {
        filtersState: {
          ...prevState.filtersState,
          [name]: newValue
        }
      };
    });
  };

  render() {
    const {
      classes,
      editingMode,
      filtersState,
      handleToggleEnabled,
      handleToggleVisible
    } = this.props;

    return (
      filtersState && (
        <div className={classes.root}>
          <Typography variant="h4" className={classes.filterTitle}>
            Filters
            <span className={classes.filterSpan}>
              <Button
                onClick={() => {
                  this.applyCallbacks.forEach(cb => {
                    cb();
                  });
                }}
                variant="contained"
                size="small"
                color="primary"
              >
                Apply filters
              </Button>
            </span>
            {editingMode && (
              <div>
                <FormControlLabel
                  control={
                    <Switch
                      onChange={handleToggleEnabled}
                      checked={filtersState.enabled}
                      value={filtersState.enabled}
                      color="primary"
                    />
                  }
                  label={filtersState.enabled ? 'Enabled' : 'Disabled'}
                />
                <FormControlLabel
                  control={
                    <Switch
                      onChange={handleToggleVisible}
                      checked={filtersState.visible}
                      value={filtersState.visible}
                      color="primary"
                    />
                  }
                  label={filtersState.visible ? 'Visible' : 'Hidden'}
                />
              </div>
            )}
          </Typography>

          {(Object.values(filtersState.filterGroups) || []).map(
            (filterGroup: Object) =>
              filterGroup !== 'FilterGroup' &&
              (editingMode || filterGroup.visible) && (
                <div className={classes.filterWrapper} key={filterGroup.label}>
                  <ExpansionPanel key={filterGroup.label}>
                    <ExpansionPanelSummary
                      id={filterGroup.label}
                      expandIcon={<ExpandMoreIcon />}
                    >
                      <Typography className={classes.heading}>
                        {filterGroup.label}
                      </Typography>
                    </ExpansionPanelSummary>
                    {this.getFilter(filterGroup, filtersState.enabled)}
                  </ExpansionPanel>
                </div>
              )
          )}
        </div>
      )
    );
  }
}

const mapStateToProps = state => {
  return {
    filtersState: state.filters.filtersState
  };
};

const mapDispatchToProps = dispatch => {
  const handleToggleEnabled = event =>
    dispatch(filtersActions.toggleEnabledWithSolid(event.target.checked));

  const handleToggleVisible = event =>
    dispatch(filtersActions.toggleVisibleWithSolid(event.target.checked));

  return {
    handleToggleEnabled,
    handleToggleVisible
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(FiltersComponent));
