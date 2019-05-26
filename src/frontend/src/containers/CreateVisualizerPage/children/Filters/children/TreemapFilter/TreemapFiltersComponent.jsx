// @flow
import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import { VisualizersService } from '@utils';
import Input from '@material-ui/core/Input';
import MenuItem from '@material-ui/core/MenuItem';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import { connect } from 'react-redux';
import { filtersActions } from '@ducks/filtersDuck';

type Props = {
  selectedResultGraphIri: string,
  classes: {
    progress: number,
    formControl: string,
    selectEmpty: string
  },
  selectedScheme: string,
  onSelectedScheme: Function
};
type State = {
  schemes: Array<{ uri: string, label: { languageMap: { en: string } } }>
};

const styles = theme => ({
  formControl: {
    margin: theme.spacing.unit,
    minWidth: 100
  },
  selectEmpty: {
    marginTop: theme.spacing.unit * 2
  }
});

class TreemapFiltersComponent extends React.PureComponent<Props, State> {
  conceptsFetched: Set<string>;

  constructor(props: Props) {
    super(props);
    this.state = {
      schemes: []
    };
  }

  async componentDidMount() {
    // Get the schemes
    const schemesResponse = await VisualizersService.getSkosSchemes(
      this.props.selectedResultGraphIri
    );
    const schemes = schemesResponse.data;
    if (schemes.length) {
      this.setState({ schemes });
      this.props.onSelectedScheme(schemes[0].uri);
    }
  }

  handleSchemeChange = async event => {
    // dispatch set selected scheme
    this.props.onSelectedScheme(event.target.value);
  };

  render() {
    const { classes } = this.props;
    return (
      <FormControl className={classes.formControl}>
        <Select
          value={this.props.selectedScheme}
          onChange={this.handleSchemeChange}
          input={<Input name="scheme" id="scheme-selector" />}
          displayEmpty
          name="scheme"
          className={classes.selectEmpty}
        >
          {this.state.schemes.map(scheme => (
            <MenuItem key={scheme.uri} value={scheme.uri}>
              {scheme.label.languageMap.en}
            </MenuItem>
          ))}
        </Select>
        <FormHelperText>Selected scheme</FormHelperText>
      </FormControl>
    );
  }
}

const mapDispatchToProps = dispatch => {
  const onSelectedScheme = scheme =>
    dispatch(filtersActions.setSelectedScheme(scheme));
  return {
    onSelectedScheme
  };
};

const mapStateToProps = state => {
  return {
    selectedScheme: state.filters.selectedScheme
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(TreemapFiltersComponent));
