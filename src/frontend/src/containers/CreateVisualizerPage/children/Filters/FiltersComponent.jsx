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
import ChordFiltersComponent from './children/ChordFilter';
import { connect } from 'react-redux';
import { filtersActions } from '@ducks/filtersDuck';
import Emoji from 'react-emoji-render';
import uuid from 'uuid';

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

  registerCallback = callback => {
    this.applyCallbacks.push(callback);
  };

  getFilter = (filterType, filterLabel, selectedOptions) => {
    switch (filterType) {
      case 'NODES_FILTER':
        // editingMode
        return (
          <ChordFiltersComponent
            key={uuid.v4()}
            editingMode={this.props.editingMode}
            registerCallback={this.registerCallback}
            selectedNodes={selectedOptions.items}
            selectedResultGraphIri={this.props.selectedResultGraphIri}
            name={filterLabel}
          />
        );
      default:
        return <div key={uuid.v4()}> Unknown filter type </div>;
    }
  };

  getComponents = () => {
    const {
      classes,
      editingMode,
      filtersState,
      handleToggleEnabled,
      handleToggleVisible
    } = this.props;

    const filtersAvailable = filtersState !== undefined;

    if (!filtersAvailable) {
      return (
        <div className={classes.root}>
          <Typography variant="h4" className={classes.filterTitle}>
            <Emoji text="No Filters available 😕" />
          </Typography>
        </div>
      );
    }

    return (
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

        {(Object.values(filtersState.filterGroups) || []).map(
          filterGroup =>
            typeof filterGroup !== 'string' &&
            !(filterGroup instanceof String) &&
            (editingMode || filterGroup.visible) && (
              <div>
                <ExpansionPanel
                  key={uuid.v4()}
                  disabled={!filterGroup.enabled && !editingMode}
                >
                  <ExpansionPanelSummary
                    id={filterGroup.label}
                    key={uuid.v4()}
                    expandIcon={<ExpandMoreIcon />}
                  >
                    <Typography key={uuid.v4()} className={classes.heading}>
                      {filterGroup.label}
                    </Typography>
                    {editingMode && (
                      <div>
                        <FormControlLabel
                          key={uuid.v4()}
                          control={
                            <Switch
                              key={uuid.v4()}
                              checked={filterGroup.enabled}
                              value={filterGroup.enabled}
                              color="primary"
                            />
                          }
                          label={filterGroup.enabled ? 'Enabled' : 'Disabled'}
                        />
                        <FormControlLabel
                          key={uuid.v4()}
                          control={
                            <Switch
                              key={uuid.v4()}
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
                  {this.getFilter(
                    filterGroup.filterType,
                    filterGroup.label,
                    filterGroup.selectedOptions
                  )}
                </ExpansionPanel>
              </div>
            )
        )}
      </div>
    );
  };

  render() {
    return this.getComponents();
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
