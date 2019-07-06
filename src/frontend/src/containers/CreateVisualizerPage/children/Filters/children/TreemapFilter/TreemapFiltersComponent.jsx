// @flow
import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import MenuItem from '@material-ui/core/MenuItem';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import { connect } from 'react-redux';
import { filtersActions } from '@ducks/filtersDuck';
import FormGroup from '@material-ui/core/FormGroup';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import { VisualizersService } from '@utils';

type Props = {
  selectedResultGraphIri: string,
  classes: {
    progress: number,
    formGroup: {},
    formControl: string,
    option: {}
  },
  schemes: Array<{
    uri: string,
    label: string,
    visible: boolean,
    enabled: boolean,
    selected: boolean
  }>,
  editingMode: boolean,
  registerCallback: Function,
  onApplyFilter: Function,
  name: string
};
type State = {
  schemes: Array<{
    uri: string,
    label: string,
    visible: boolean,
    enabled: boolean,
    selected: boolean
  }>
};

const styles = theme => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: '100%',
    overflow: 'hidden'
  },
  formGroup: {
    minWidth: '100%'
  },
  selectEmpty: {
    marginTop: theme.spacing(2)
  },
  option: {
    maxWidth: '90%'
  }
});

class TreemapFiltersComponent extends React.PureComponent<Props, State> {
  conceptsFetched: Set<string>;

  constructor(props: Props) {
    super(props);
    this.state = {
      schemes: this.props.schemes || []
    };
  }

  async componentDidMount() {
    // Get the schemes
    if (this.props.editingMode && !this.state.schemes.length) {
      const schemesResponse = await VisualizersService.getSkosSchemes(
        this.props.selectedResultGraphIri
      );
      const schemes = schemesResponse.data.map(scheme => ({
        uri: scheme.uri,
        label: scheme.label.languageMap.en,
        visible: true,
        enabled: true,
        selected: false
      }));
      schemes[0] = { ...schemes[0], selected: true };
      this.setState(
        {
          schemes
        },
        () =>
          this.props.onApplyFilter(
            this.props.name,
            this.state.schemes,
            this.props.editingMode
          )
      );
    }

    // Register callback
    this.props.registerCallback(this.handleApplyFilter);
  }

  handleSchemeChange = event => {
    this.setState(prevState => ({
      schemes: prevState.schemes.map(s => {
        if (s.uri === event.target.value.uri) {
          return { ...s, selected: true };
        }
        return { ...s, selected: false };
      })
    }));
  };

  handleApplyFilter = async () => {
    await this.props.onApplyFilter(
      this.props.name,
      this.state.schemes,
      this.props.editingMode
    );
  };

  render() {
    const { classes } = this.props;
    const selectedScheme =
      this.state.schemes && this.state.schemes.find(s => s.selected);
    if (!selectedScheme) {
      return <div>loading filters</div>;
    }
    return (
      this.state.schemes &&
      !!selectedScheme && (
        <ExpansionPanelDetails>
          <FormGroup className={classes.formGroup}>
            <FormControl className={classes.formControl}>
              <Select
                value={selectedScheme}
                onChange={this.handleSchemeChange}
                name="scheme"
                className={classes.option}
              >
                {this.state.schemes.map(scheme => (
                  <MenuItem key={scheme.uri} value={scheme}>
                    {scheme.label}
                  </MenuItem>
                ))}
              </Select>
              <FormHelperText>Selected scheme</FormHelperText>
            </FormControl>
          </FormGroup>
        </ExpansionPanelDetails>
      )
    );
  }
}

const mapDispatchToProps = dispatch => {
  const onApplyFilter = (filterName, schemes, isEditing) => {
    dispatch(
      filtersActions.setSelectedSchemeWithSolid(filterName, schemes, isEditing)
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
