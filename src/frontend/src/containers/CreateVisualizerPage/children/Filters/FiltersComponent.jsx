// flow
import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Switch from '@material-ui/core/Switch';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Button from '@material-ui/core/Button';
import Checkbox from '@material-ui/core/Checkbox';
import FormGroup from '@material-ui/core/FormGroup';
import uuid from 'uuid';

type Props = {
  classes: {
    root: {},
    filterTitle: {
      paddingBottom: string
    }
  },
  editingMode: boolean
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
  state = {
    filtersState: {
      enabled: true,
      visible: true,
      filterGroups: [
        {
          label: 'Nodes',
          enabled: true,
          visible: true,
          type: 'NODES_FILTER',
          filters: [
            { label: 'Nodes', visible: true, enabled: true },
            { label: 'Nodes Copy', visible: false, enabled: true }
          ]
        }
      ]
    }
  };

  getFilter = filterGroup => {
    switch (filterGroup) {
      case 'nodesFilter':
        return <div />;
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
    const { classes, editingMode } = this.props;
    const { filtersState } = this.state;

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
                        onChange={this.handleSwitchChange('enabled')}
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
                        onChange={this.handleSwitchChange('visible')}
                        checked={filtersState.visible}
                        value={filtersState.visible}
                        color="primary"
                      />
                    }
                    label={filtersState.visible ? 'Visible' : 'Hidden'}
                  />
                </span>
              )}
              <Button variant="contained" size="small" color="primary">
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
                      <ExpansionPanelDetails>
                        <FormGroup>
                          <span>
                            <FormControlLabel
                              control={<Checkbox checked />}
                              label={'Node 1'}
                            />
                            <FormControlLabel
                              control={
                                <Switch
                                  checked
                                  value="checkedA"
                                  color="primary"
                                />
                              }
                              label="Enabled"
                            />
                            <FormControlLabel
                              control={
                                <Switch
                                  checked
                                  value="checkedA"
                                  color="primary"
                                />
                              }
                              label="Visible"
                            />
                          </span>

                          <span>
                            <FormControlLabel
                              control={<Checkbox checked />}
                              label={'Node 1'}
                            />
                            <FormControlLabel
                              control={
                                <Switch
                                  checked
                                  value="checkedA"
                                  color="primary"
                                />
                              }
                              label="Enabled"
                            />
                            <FormControlLabel
                              control={
                                <Switch
                                  checked
                                  value="checkedA"
                                  color="primary"
                                />
                              }
                              label="Visible"
                            />
                          </span>
                        </FormGroup>
                      </ExpansionPanelDetails>
                    </ExpansionPanel>
                  </div>
                )
            )}
        </div>
      )
    );
  }
}

export default withStyles(styles)(FiltersComponent);
