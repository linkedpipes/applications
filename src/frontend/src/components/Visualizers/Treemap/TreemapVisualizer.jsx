// @flow
import React from 'react';
import Chart from 'react-google-charts';
import { withStyles } from '@material-ui/core/styles';
import { VisualizersService } from '@utils';
import CircularProgress from '@material-ui/core/CircularProgress';
import uuid from 'uuid';
import { connect } from 'react-redux';
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
  isPublished: boolean,
  selectedScheme: string
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
    margin: theme.spacing.unit * 2,
    alignItems: 'center'
  },
  formControl: {
    margin: theme.spacing.unit,
    minWidth: 120
  },
  selectEmpty: {
    marginTop: theme.spacing.unit * 2
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
  constructor(props: Props) {
    super(props);
    this.state = {
      dataLoadingStatus: 'loading',
      chartData: []
    };
  }

  async componentDidMount() {
    const {
      handleSetCurrentApplicationData,
      isPublished,
      selectedScheme,
      selectedResultGraphIri
    } = this.props;

    if (!isPublished) {
      handleSetCurrentApplicationData({
        id: uuid.v4(),
        applicationEndpoint: 'treemap',
        conceptIri: this.props.selectedScheme, // TODO: change Confusing Naming
        selectedResultGraphIri: this.props.selectedResultGraphIri,
        visualizerCode: 'TREEMAP'
      });
    }

    this.conceptsFetched = new Set();

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
          const selectedItem = this.state.chartData[index + 1];
          const iri = selectedItem[0].v;

          // If data for this conceptIri has been fetched, then return
          if (this.conceptsFetched.has(iri)) return;

          // Get the data of this item in hierarchy
          const response = await VisualizersService.getSkosScheme(
            this.props.selectedScheme,
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
    if (selectedResultGraphIri && selectedScheme) {
      this.handleSchemeChange(selectedScheme);
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.selectedScheme !== this.props.selectedScheme) {
      this.handleSchemeChange(nextProps.selectedScheme);
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

    this.props.handleSetCurrentApplicationData({
      conceptIri: this.props.selectedScheme
    });
  };

  handleGoUpClick = () => {};

  render() {
    const { classes } = this.props;
    return (
      <div className={classes.wrapper}>
        {this.props.selectedScheme &&
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
                height="99%"
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

const mapStateToProps = (state, ownProps) => {
  return {
    selectedScheme: state.filters.selectedScheme || ownProps.selectedScheme
  };
};

export default connect(mapStateToProps)(withStyles(styles)(TreemapVisualizer));
