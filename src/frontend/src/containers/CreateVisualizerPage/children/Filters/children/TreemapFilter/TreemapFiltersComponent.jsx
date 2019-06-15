// @flow
import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import { VisualizersService, Log } from '@utils';
import Input from '@material-ui/core/Input';
import MenuItem from '@material-ui/core/MenuItem';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import { connect } from 'react-redux';
import { filtersActions } from '@ducks/filtersDuck';
import FormGroup from '@material-ui/core/FormGroup';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';

type Props = {
  selectedResultGraphIri: string,
  classes: {
    progress: number,
    formControl: string,
    option: {}
  },
  selectedScheme: {
    uri: string,
    label: string,
    visible: boolean,
    enabled: boolean
  },
  registerCallback: Function,
  onApplyFilter: Function,
  name: string
};
type State = {
  schemes: Array<{ uri: string, label: string }>,
  selectedScheme: {
    uri: string,
    label: string,
    visible: boolean,
    enabled: boolean
  }
};

const styles = theme => ({
  formControl: {
    margin: theme.spacing(),
    minWidth: 100
  },
  selectEmpty: {
    marginTop: theme.spacing(2)
  }
});

class TreemapFiltersComponent extends React.PureComponent<Props, State> {
  conceptsFetched: Set<string>;

  constructor(props: Props) {
    super(props);
    this.state = {
      schemes: [],
      selectedScheme: { uri: '', label: '', visible: true, enabled: true }
    };
  }

  async componentDidMount() {
    // Get the schemes
    const schemesResponse = await VisualizersService.getSkosSchemes(
      this.props.selectedResultGraphIri
    );
    const schemes = schemesResponse.data.map(scheme => ({
      ...scheme,
      label: scheme.label.languageMap.en
    }));
    if (schemes.length) {
      this.setState(
        {
          schemes,
          selectedScheme: this.props.selectedScheme || schemes[0]
        },
        () =>
          this.props.onApplyFilter(this.props.name, this.state.selectedScheme)
      );
    }

    // Register callback
    this.props.registerCallback(this.handleApplyFilter);
  }

  handleSchemeChange = async event => {
    await this.setState({
      selectedScheme: { ...event.target.value }
    });
  };

  handleApplyFilter = async () => {
    await this.props.onApplyFilter(this.props.name, this.state.selectedScheme);
  };

  render() {
    const { classes } = this.props;
    return (
      <ExpansionPanelDetails>
        <FormGroup>
          <FormControl className={classes.formControl}>
            <Select
              value={this.state.selectedScheme && this.state.selectedScheme.uri}
              onChange={this.handleSchemeChange}
              input={<Input name="scheme" id="scheme-selector" />}
              displayEmpty
              name="scheme"
              className={classes.option}
            >
              {this.state.schemes.map(scheme => (
                <MenuItem key={scheme.uri} value={{ ...scheme }}>
                  {scheme.label}
                </MenuItem>
              ))}
            </Select>
            <FormHelperText>Selected scheme</FormHelperText>
          </FormControl>
        </FormGroup>
      </ExpansionPanelDetails>
    );
  }
}

const mapDispatchToProps = dispatch => {
  const onApplyFilter = (filterName, scheme) => {
    Log.info('applyFiltersh', scheme);
    dispatch(
      filtersActions.setSelectedScheme({
        ...scheme,
        visible: true,
        enabled: true
      })
    );
  };
  return {
    onApplyFilter
  };
};

export default connect(
  null,
  mapDispatchToProps
)(withStyles(styles)(TreemapFiltersComponent));
