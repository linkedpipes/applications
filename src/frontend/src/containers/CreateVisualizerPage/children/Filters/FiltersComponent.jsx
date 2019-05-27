// flow
import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Switch from '@material-ui/core/Switch';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Button from '@material-ui/core/Button';
import uuid from 'uuid';
import ChordFiltersComponent from './children/ChordFilter';
import { connect } from 'react-redux';
import { filtersActions } from '@ducks/filtersDuck';

type Props = {
  classes: {
    root: {},
    filterTitle: {
      paddingBottom: string
    }
  },
  editingMode: boolean,
  selectedResultGraphIri: string,
  filtersState: {},
  handleToggleEnabled: Function,
  handleToggleVisible: Function
};

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
  }
});

class FiltersComponent extends React.Component<Props> {
  applyCallbacks: Array<Function> = [];

  state = {
    filtersState: {
      enabled: false,
      visible: false,
      filterGroups: [
        {
          label: 'Nodes',
          enabled: false,
          visible: false,
          type: 'NODES_FILTER',
          filters: [
            { label: 'Nodes', visible: true, enabled: true },
            { label: 'Nodes Copy', visible: false, enabled: true }
          ]
        }
      ]
    }
  };

  registerCallback = callback => {
    this.applyCallbacks.push(callback);
  };

  getFilter = filterGroup => {
    switch (filterGroup) {
      case 'NODES_FILTER':
        // editingMode
        return (
          <ChordFiltersComponent
            editingMode={this.props.editingMode}
            registerCallback={this.registerCallback}
            selectedNodes={this.state.filters}
            selectedResultGraphIri={this.props.selectedResultGraphIri}
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
              {editingMode && (
                <span>
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
                </span>
              )}
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
          </Typography>

          {(this.state.filtersState.filterGroups || [])
            .map(filterGroup => ({ ...filterGroup, uuid: uuid() }))
            .map(
              filterGroup =>
                (editingMode || filterGroup.visible) && (
                  <div>
                    <ExpansionPanel
                      key={filterGroup.uuid}
                      disabled={!filterGroup.enabled && !editingMode}
                    >
                      <ExpansionPanelSummary
                        id={filterGroup.uuid}
                        expandIcon={<ExpandMoreIcon />}
                      >
                        <Typography className={classes.heading}>
                          {filterGroup.label}
                        </Typography>
                        {editingMode && (
                          <div>
                            <FormControlLabel
                              control={
                                <Switch
                                  checked={filterGroup.enabled}
                                  value={filterGroup.enabled}
                                  color="primary"
                                />
                              }
                              label={
                                filterGroup.enabled ? 'Enabled' : 'Disabled'
                              }
                            />
                            <FormControlLabel
                              control={
                                <Switch
                                  checked={filterGroup.visible}
                                  value={filterGroup.visible}
                                  color="primary"
                                />
                              }
                              label={filterGroup.visible ? 'Visible' : 'Hidden'}
                            />
                          </div>
                        )}
                      </ExpansionPanelSummary>
                      {this.getFilter(filterGroup.type)}
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
    dispatch(filtersActions.toggleEnabled(event.target.checked));

  const handleToggleVisible = event =>
    dispatch(filtersActions.toggleVisible(event.target.checked));

  return {
    handleToggleEnabled,
    handleToggleVisible
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(FiltersComponent));
