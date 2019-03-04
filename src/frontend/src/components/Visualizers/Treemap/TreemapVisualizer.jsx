import React, { PureComponent } from 'react';
import Chart from 'react-google-charts';
import { withStyles } from '@material-ui/core/styles';
import { VisualizersService } from '@utils';

const styles = () => ({
  root: {
    height: '72vh'
  },
  filterSideBar: {
    overflowY: 'auto'
  },
  card: {},
  input: {}
});

class TreemapVisualizer extends PureComponent {
  constructor() {
    super();
    this.state = { dataLoadingStatus: 'loading', chartData: [] };
  }

  async componentDidMount() {
    const response = await VisualizersService.getTreemapData();
    const headers = [['id', 'parentId', 'size', 'color']];
    const jsonData = await response.json();
    const chartData = headers.concat(
      jsonData.map(e => [e.id, e.parentId, e.size, 0])
    );
    this.setState({
      dataLoadingStatus: 'ready',
      chartData
    });
  }

  render() {
    return this.state.dataLoadingStatus === 'ready' ? (
      <Chart
        width={'100%'}
        height={'72vh'}
        chartType="TreeMap"
        loader={<div>Loading Chart</div>}
        data={this.state.chartData}
        options={{
          minColor: '#33FF4A',
          midColor: '#33FFEB',
          maxColor: '#334AFF',
          headerHeight: 20,
          fontColor: 'black',
          showScale: true
        }}
      />
    ) : (
      <div>Fetching data from API</div>
    );
  }
}

export default withStyles(styles)(TreemapVisualizer);
