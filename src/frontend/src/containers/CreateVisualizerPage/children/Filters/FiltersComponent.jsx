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
import MenuItem from '@material-ui/core/MenuItem';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import FormGroup from '@material-ui/core/FormGroup';

type Props = {
  classes: {
    root: {},
    filterTitle: {
      paddingBottom: string
    }
  },
  filtersEnabled: boolean,
  filtersVisible: boolean,
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

class FiltersComponent extends React.PureComponent<Props> {
  state = {
    expanded: null,
    filtersEnabled: true,
    filtersVisible: true,
    filters: [
      { label: 'Nodes', visible: true, enabled: true },
      { label: 'Nodes Copy', visible: false, enabled: true }
    ]
  };

  handleChange = panel => (event, expanded) => {
    this.setState({
      expanded: expanded ? panel : false
    });
  };

  handleSwitchChange = name => event => {
    this.setState({ [name]: event.target.checked });
  };

  render() {
    const { classes, editingMode } = this.props;
    const { expanded, filtersEnabled, filtersVisible } = this.state;

    return (
      <div className={classes.root}>
        <Typography variant="h4" className={classes.filterTitle}>
          Filters
          <span className={classes.filterSpan}>
            {editingMode && (
              <div>
                <FormControlLabel
                  control={
                    <Switch
                      onChange={this.handleSwitchChange('filtersEnabled')}
                      checked={filtersEnabled}
                      value={filtersEnabled}
                      color="primary"
                    />
                  }
                  label={filtersEnabled ? 'Enabled' : 'Disabled'}
                />
                <FormControlLabel
                  control={
                    <Switch
                      onChange={this.handleSwitchChange('filtersVisible')}
                      checked={filtersVisible}
                      value={filtersVisible}
                      color="primary"
                    />
                  }
                  label={filtersVisible ? 'Visible' : 'Hidden'}
                />
              </div>
            )}
            <Button variant="contained" size="small" color="primary">
              Apply filters
            </Button>
          </span>
        </Typography>

        {(this.state.filters || []).map(filter => (
          <ExpansionPanel
            expanded={expanded === filter.label}
            onChange={this.handleChange(filter.label)}
            key={filter.label}
          >
            <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
              <Typography className={classes.heading}>
                {filter.label}
              </Typography>
              <FormControlLabel
                control={
                  <Switch
                    checked={filter.enabled}
                    value={filter.enabled}
                    color="primary"
                  />
                }
                label={filter.enabled ? 'Enabled' : 'Disabled'}
              />
              <FormControlLabel
                control={
                  <Switch
                    checked={filter.visible}
                    value={filter.visible}
                    color="primary"
                  />
                }
                label={filter.visible ? 'Visible' : 'Hidden'}
              />
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

                <span>
                  <FormControlLabel
                    control={<Checkbox checked />}
                    label={'Node 1'}
                  />
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
              </FormGroup>
            </ExpansionPanelDetails>
          </ExpansionPanel>
        ))}
      </div>
    );
  }
}

export default withStyles(styles)(FiltersComponent);
