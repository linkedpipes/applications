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
    root: {}
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
  }
});

class FiltersComponent extends React.PureComponent<Props> {
  state = {
    expanded: null,
    filtersEnabled: true,
    filtersVisible: true
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
    const { classes } = this.props;
    const { expanded, filtersEnabled, filtersVisible } = this.state;

    return (
      <div className={classes.root}>
        <Typography variant="h4">
          Filters
          <span className={classes.filterSpan}>
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
            <Button variant="contained" size="small" color="primary">
              Apply filters
            </Button>
          </span>
        </Typography>

        <ExpansionPanel
          expanded={expanded === 'panel1'}
          onChange={this.handleChange('panel1')}
        >
          <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
            <Typography className={classes.heading}>Nodes</Typography>
            <FormControlLabel
              control={<Switch checked value="checkedA" color="primary" />}
              label="Enabled"
            />
            <FormControlLabel
              control={<Switch checked value="checkedA" color="primary" />}
              label="Visible"
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
                  control={<Switch checked value="checkedA" color="primary" />}
                  label="Enabled"
                />
                <FormControlLabel
                  control={<Switch checked value="checkedA" color="primary" />}
                  label="Visible"
                />
              </span>

              <span>
                <FormControlLabel
                  control={<Checkbox checked />}
                  label={'Node 1'}
                />
                <FormControlLabel
                  control={<Switch checked value="checkedA" color="primary" />}
                  label="Enabled"
                />
                <FormControlLabel
                  control={<Switch checked value="checkedA" color="primary" />}
                  label="Visible"
                />
              </span>

              <span>
                <FormControlLabel
                  control={<Checkbox checked />}
                  label={'Node 1'}
                />
                <FormControlLabel
                  control={<Switch checked value="checkedA" color="primary" />}
                  label="Enabled"
                />
                <FormControlLabel
                  control={<Switch checked value="checkedA" color="primary" />}
                  label="Visible"
                />
              </span>
            </FormGroup>
          </ExpansionPanelDetails>
        </ExpansionPanel>
        <ExpansionPanel
          expanded={expanded === 'panel2'}
          onChange={this.handleChange('panel2')}
        >
          <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
            <Typography className={classes.heading}>Scheme</Typography>
            <FormControlLabel
              control={<Switch checked value="checkedA" color="primary" />}
              label="Enabled"
            />
            <FormControlLabel
              control={<Switch checked value="checkedA" color="primary" />}
              label="Visible"
            />
          </ExpansionPanelSummary>
          <ExpansionPanelDetails>
            <FormControl className={classes.formControl}>
              <Select name="scheme">
                <MenuItem value={1}>Scheme 1</MenuItem>
                <MenuItem value={2}>Scheme 2</MenuItem>
              </Select>
              <FormHelperText>Selected scheme</FormHelperText>
            </FormControl>
          </ExpansionPanelDetails>
        </ExpansionPanel>
      </div>
    );
  }
}

export default withStyles(styles)(FiltersComponent);
