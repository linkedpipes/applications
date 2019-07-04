// @flow
import React from 'react';
import Chart from 'react-google-charts';
import { withStyles } from '@material-ui/core/styles';
import { VisualizersService, Log } from '@utils';
import CircularProgress from '@material-ui/core/CircularProgress';
import Button from '@material-ui/core/Button';

type Props = {
  classes: {
    progress: number,
    formControl: string,
    selectEmpty: string,
    wrapper: any
  },
  selectedResultGraphIri: string,
  handleSetCurrentApplicationData: Function,
  selectedPipelineExecution: Function,
  isPublished: boolean,
  schemes: Array<{
    label: string,
    uri: string,
    visible: boolean,
    enabled: boolean,
    selected: boolean
  }>,
  width: number,
  height: number
};

type State = {
  dataLoadingStatus: string,
  chartData: Array<Array<any>>
};

const styles = theme => ({
  filterSideBar: {
    overflowY: 'auto'
  },
  card: {},
  input: {},
  progress: {
    margin: theme.spacing(2),
    alignItems: 'center'
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120
  },
  selectEmpty: {
    marginTop: theme.spacing(2)
  },
  wrapper: {
    height: '100%'
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
  conceptsFetched: Set<Object>;

  chartEvents: Array<Object>;

  constructor(props: Props) {
    super(props);
    this.state = {
      dataLoadingStatus: 'loading',
      chartData: []
    };
  }

  // static getDerivedStateFromProps(props, state) {
  //   const newSelectedScheme = props.selectedScheme && props.selectedScheme.uri;
  //   if (newSelectedScheme && newSelectedScheme !== state.selectedScheme.uri) {
  //     this.handleSchemeChange(props.selectedScheme.uri);
  //   }
  // }

  async componentDidMount() {
    const {
      handleSetCurrentApplicationData,
      isPublished,
      schemes,
      selectedResultGraphIri
    } = this.props;

    if (!isPublished) {
      handleSetCurrentApplicationData({
        endpoint: 'treemap',
        graphIri: this.props.selectedResultGraphIri,
        etlExecutionIri: this.props.selectedPipelineExecution,
        visualizerType: 'TREEMAP'
      });
    }

    this.conceptsFetched = new Set();
    const selectedScheme: Object = schemes.find(s => s.selected);
    const self = this;

    this.chartEvents = [
      {
        eventName: 'ready',
        callback: ({ chartWrapper }) => {
          this.handleGoUpClick = () => {
            chartWrapper.getChart().goUpAndDraw();
          };
        }
      },
      {
        eventName: 'select',
        callback: async ({ chartWrapper }) => {
          // The first row in the data is the headers row. Ignore if got chosen
          const index = chartWrapper.getChart().getSelection()[0].row;
          if (!index) return;
          const selectedItem: {
            label: string,
            uri: string,
            visible: boolean,
            enabled: boolean,
            selected: boolean
          } = self.state.chartData[index + 1];
          const iri = selectedItem[0].v;
          const currentScheme: Object = self.props.schemes.find(
            s => s.selected
          );

          // If data for this conceptIri has been fetched, then return
          if (self.conceptsFetched.has(iri)) return;

          // Get the data of this item in hierarchy
          const response = await VisualizersService.getSkosScheme(
            currentScheme.uri,
            self.props.selectedResultGraphIri,
            iri
          );
          const jsonData = await response.data;

          // Update state
          self.setState(
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
              self.conceptsFetched.add(iri);
            }
          );
        }
      }
    ];

    if (selectedResultGraphIri && selectedScheme && selectedScheme.uri) {
      this.handleSchemeChange(selectedScheme.uri);
    }
  }

  componentWillReceiveProps(nextProps) {
    const currentSchemes = this.props.schemes;
    const currentSelectedScheme = currentSchemes.find(s => s.selected);
    const newSchemes = nextProps.schemes;
    const newSelectedScheme = newSchemes.find(s => s.selected);
    if (
      newSelectedScheme &&
      newSelectedScheme.uri !==
        (currentSelectedScheme && currentSelectedScheme.uri)
    ) {
      // this aint been callfinded. ty vole
      this.handleSchemeChange(newSelectedScheme.uri);
    }
    return null;
  }

  handleSchemeChange = async scheme => {
    if (!(scheme && this.props.selectedResultGraphIri)) {
      return;
    }
    this.conceptsFetched.clear();
    const response = await VisualizersService.getSkosScheme(
      scheme,
      this.props.selectedResultGraphIri
    );
    const headers = [['id', 'parentId', 'size', 'color']];
    const jsonData = await response.data;
    const chartData = headers.concat(transformData(jsonData));
    this.setState(
      {
        dataLoadingStatus: 'ready',
        chartData
      },
      () => {
        this.conceptsFetched.add(scheme);
      }
    );
  };

  handleGoUpClick = () => {};

  render() {
    const { classes, schemes, width, height } = this.props;

    const heightSize = `${Math.max(250, Math.min(width, height) - 250)}px`;

    Log.info(heightSize);

    const selectedScheme = schemes.find(s => s.selected);
    return (
      <div className={classes.wrapper}>
        {selectedScheme &&
          selectedScheme.uri &&
          (this.state.dataLoadingStatus === 'ready' ? (
            <div className={classes.wrapper}>
              <Button
                onClick={this.handleGoUpClick}
                variant="contained"
                size="medium"
                color="primary"
              >
                Go up one level
              </Button>
              <Chart
                height={heightSize}
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
            </div>
          ) : (
            <CircularProgress className={classes.progress} />
          ))}
      </div>
    );
  }
}

export default withStyles(styles)(TreemapVisualizer);
