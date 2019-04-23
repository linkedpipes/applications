// @flow
import React from 'react';
import Chart from 'react-google-charts';
import { withStyles } from '@material-ui/core/styles';
import { VisualizersService, Log } from '@utils';
import CircularProgress from '@material-ui/core/CircularProgress';
import uuid from 'uuid';
import Input from '@material-ui/core/Input';
import MenuItem from '@material-ui/core/MenuItem';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';

type Props = {
  classes: {
    progress: number,
    formControl: string,
    selectEmpty: string
  },
  selectedResultGraphIri: string,
  handleSetCurrentApplicationData: Function,
  isPublished: boolean
};

type State = {
  dataLoadingStatus: string,
  selectedScheme: string,
  schemes: Array<{ uri: string, label: { languageMap: { en: string } } }>,
  chartData: Array<Array<any>>
};

const styles = theme => ({
  filterSideBar: {
    overflowY: 'auto'
  },
  card: {},
  input: {},
  progress: {
    margin: theme.spacing.unit * 2,
    alignItems: 'center'
  },
  formControl: {
    margin: theme.spacing.unit,
    minWidth: 120
  },
  selectEmpty: {
    marginTop: theme.spacing.unit * 2
  }
});

const transformData = data => {
  return data.map(row => {
    return [
      { v: row.id, f: row.label.languageMap.en },
      row.parentId,
      row.size,
      Math.floor(Math.random() * Math.floor(100))
    ];
  });
};

class TreemapVisualizer extends React.PureComponent<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      dataLoadingStatus: 'loading',
      chartData: [],
      selectedScheme: '',
      schemes: []
    };
  }

  async componentDidMount() {
    const { handleSetCurrentApplicationData, isPublished } = this.props;

    if (!isPublished) {
      handleSetCurrentApplicationData({
        id: uuid.v4(),
        applicationEndpoint: 'treemap',
        conceptIri:
          'http://linked.opendata.cz/resource/concept-scheme/cpv-2008',
        selectedResultGraphIri: this.props.selectedResultGraphIri,
        visualizerCode: 'TREEMAP'
      });
    }

    this.conceptsFetched = new Set();

    this.chartEvents = [
      {
        eventName: 'select',
        callback: async ({ chartWrapper }) => {
          // The first row in the data is the headers row. Ignore if got chosen
          const index = chartWrapper.getChart().getSelection()[0].row;
          if (!index) return;
          const selectedItem = this.state.chartData[index + 1];
          const iri = selectedItem[0].v;

          // If data for this conceptIri has been fetched, then return
          if (this.conceptsFetched.has(iri)) return;

          // Get the data of this item in hierarchy
          const response = await VisualizersService.getSkosScheme(
            this.state.selectedScheme,
            this.props.selectedResultGraphIri,
            iri
          );
          const jsonData = await response.data;

          // Update state
          this.setState(
            prevState => {
              return {
                ...prevState,
                chartData: prevState.chartData.concat(transformData(jsonData))
              };
            },
            () => {
              // Set selection to where user was. Assuming concat keeps order
              chartWrapper.getChart().setSelection([{ row: index, col: null }]);
              // Add the id the set of fetched items
              this.conceptsFetched.add(iri);
            }
          );
        }
      }
    ];

    // Get the schemes
    const schemesResponse = await VisualizersService.getSkosSchemes(
      this.props.selectedResultGraphIri
    );
    const schemes = schemesResponse.data;
    if (schemes.length) {
      this.setState({ schemes }, () => {
        this.conceptsFetched.add(schemes[0].uri);
      });
    }

    handleSetCurrentApplicationData({
      id: uuid.v4(),
      applicationEndpoint: 'treemap',
      conceptIri: this.state.selectedScheme,
      selectedResultGraphIri: this.props.selectedResultGraphIri,
      visualizerCode: 'TREEMAP'
    });
  }

  handleSchemeChange = async event => {
    this.conceptsFetched.clear();
    const response = await VisualizersService.getSkosScheme(
      event.target.value,
      this.props.selectedResultGraphIri
    );
    const headers = [['id', 'parentId', 'size', 'color']];
    const jsonData = await response.data;
    const chartData = headers.concat(transformData(jsonData));
    this.setState(
      {
        dataLoadingStatus: 'ready',
        chartData,
        selectedScheme: event.target.value
      },
      () => {
        this.conceptsFetched.add(this.state.selectedScheme);
      }
    );
  };

  chartEvents: Array<{
    eventName: string,
    callback: ({ chartWrapper: any }) => Function
  }>;

  conceptsFetched: Set<string>;

  render() {
    const { classes } = this.props;
    return (
      <div>
        <FormControl className={classes.formControl}>
          <Select
            value={this.state.selectedScheme}
            onChange={this.handleSchemeChange}
            input={<Input name="scheme" id="scheme-selector" />}
            displayEmpty
            name="scheme"
            className={classes.selectEmpty}
          >
            {this.state.schemes.map(scheme => (
              <MenuItem value={scheme.uri}>
                {scheme.label.languageMap.en}
              </MenuItem>
            ))}
          </Select>
          <FormHelperText>Selected scheme</FormHelperText>
        </FormControl>
        {this.state.selectedScheme &&
          (this.state.dataLoadingStatus === 'ready' ? (
            <Chart
              width={'99%'}
              chartType="TreeMap"
              loader={<div>Loading Chart</div>}
              data={this.state.chartData}
              chartEvents={this.chartEvents}
              options={{
                headerHeight: 20,
                fontColor: 'black',
                showScale: true,
                maxDepth: 1,
                highlightOnMouseOver: true,
                minHighlightColor: '#8c6bb1',
                midHighlightColor: '#9ebcda',
                maxHighlightColor: '#edf8fb',
                minColor: '#009688',
                midColor: '#f7f7f7',
                maxColor: '#ee8100'
              }}
            />
          ) : (
            <CircularProgress className={classes.progress} />
          ))}
      </div>
    );
  }
}

export default withStyles(styles)(TreemapVisualizer);
