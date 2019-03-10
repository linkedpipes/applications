// @flow
import React from 'react';
import Chart from 'react-google-charts';
import { withStyles } from '@material-ui/core/styles';
import { VisualizersService } from '@utils';
import { CircularProgress } from '@material-ui/core';

type Props = {
  classes: {
    progress: number
  },
  selectedResultGraphIri: string
};

type State = {
  dataLoadingStatus: string,
  chartData: Array<Array<mixed>>
};

const styles = theme => ({
  root: {
    height: '72vh'
  },
  filterSideBar: {
    overflowY: 'auto'
  },
  card: {},
  input: {},
  progress: {
    margin: theme.spacing.unit * 2
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
    this.state = { dataLoadingStatus: 'loading', chartData: [] };
  }

  async componentDidMount() {
    this.conceptsFetched = new Set();
    // Add the root to the list of fetched data
    this.conceptsFetched.add(
      'http://linked.opendata.cz/resource/concept-scheme/cpv-2008'
    );
    this.chartEvents = [
      {
        eventName: 'select',
        callback: async ({ chartWrapper }) => {
          // The first row in the data is the headers row. Ignore if got chosen
          console.log(chartWrapper.getChart().getSelection());
          const index = chartWrapper.getChart().getSelection()[0].row;
          if (!index) return;
          const selectedItem = this.state.chartData[index + 1];
          console.log(selectedItem);
          const iri = selectedItem[0].v;

          // If data for this conceptIri has been fetched, then return
          if (this.conceptsFetched.has(iri)) return;

          // Get the data of this item in hierarchy
          const response = await VisualizersService.getSkosScheme(
            'http://linked.opendata.cz/resource/concept-scheme/cpv-2008',
            this.props.selectedResultGraphIri,
            iri
          );
          const jsonData = await response.json();

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
    const response = await VisualizersService.getSkosScheme(
      'http://linked.opendata.cz/resource/concept-scheme/cpv-2008',
      this.props.selectedResultGraphIri
    );
    const headers = [['id', 'parentId', 'size', 'color']];
    const jsonData = await response.json();
    const chartData = headers.concat(transformData(jsonData));
    this.setState({
      dataLoadingStatus: 'ready',
      chartData
    });
  }

  conceptsFetched: Set<string>;

  chartEvents: Array<{
    eventName: string,
    callback: ({ chartWrapper: any }) => void
  }>;

  render() {
    const { classes } = this.props;
    return this.state.dataLoadingStatus === 'ready' ? (
      <Chart
        width={'100%'}
        height={'75vh'}
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
    );
  }
}

export default withStyles(styles)(TreemapVisualizer);
