// @flow
import React from 'react';
import Chart from 'react-google-charts';
import { withStyles } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';
import { VISUALIZER_TYPE } from '@constants';
import { VisualizersService } from '@utils';
// import {GlobalUtils} from '@utils';

type Props = {
  classes: {
    progress: number,
    formControl: string,
    selectEmpty: string,
    wrapper: any
  },
  selectedPipelineExecution: string,
  selectedResultGraphIri: string,
  handleSetCurrentApplicationData: Function,
  isPublished: boolean,
  visualizerCode: string
};

type State = {
  dataLoadingStatus: string,
  chartData: Array<Array<any>>
};

const styles = () => ({});

class TimelineVisualizer extends React.PureComponent<Props, State> {
  // Row label	Bar label (optional)	Tooltip (optional)	Start	End
  static transformData(visualizerCode, apiData) {
    switch (visualizerCode) {
      case VISUALIZER_TYPE.LABELED_TIMELINE:
      case VISUALIZER_TYPE.TIMELINE:
        return [
          [
            { type: 'string', id: 'Label' },
            { type: 'string', id: 'URI' },
            { type: 'date', id: 'Start' },
            { type: 'date', id: 'End' }
          ],
          ...apiData.map(i => [
            i.uri,
            i.uri,
            new Date(i.date),
            new Date(i.date)
          ])
        ];
      case VISUALIZER_TYPE.TIMELINE_PERIODS:
      case VISUALIZER_TYPE.LABELED_TIMELINE_PERIODS:
        return [
          [
            { type: 'string', id: 'Label' },
            { type: 'string', id: 'URI' },
            { type: 'date', id: 'Start' },
            { type: 'date', id: 'End' }
          ],
          ...apiData.map(i => [
            i.uri,
            i.uri,
            new Date(i.start),
            new Date(i.end)
          ])
        ];

      default:
        return [];
    }
  }

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
      selectedResultGraphIri,
      selectedPipelineExecution,
      visualizerCode,
      isPublished
    } = this.props;

    if (!isPublished) {
      handleSetCurrentApplicationData({
        applicationEndpoint: 'timeline',
        visualizerType: visualizerCode,
        endpoint: 'timeline',
        graphIri: selectedResultGraphIri,
        etlExecutionIri: selectedPipelineExecution
      });
    }

    let request: any;
    switch (visualizerCode) {
      // Instants
      case VISUALIZER_TYPE.LABELED_TIMELINE:
      case VISUALIZER_TYPE.TIMELINE:
        request = await VisualizersService.getTimelineInstants(
          selectedResultGraphIri
        );
        break;
      // Periods
      case VISUALIZER_TYPE.TIMELINE_PERIODS:
      case VISUALIZER_TYPE.LABELED_TIMELINE_PERIODS:
        request = await VisualizersService.getTimelineIntervals(
          selectedResultGraphIri
        );
        break;
      default:
        request = { data: {} };
    }

    const response = await request.data;
    const chartData = TimelineVisualizer.transformData(
      visualizerCode,
      response
    );
    this.setState({ dataLoadingStatus: 'ready', chartData });
  }

  render() {
    return this.state.dataLoadingStatus !== 'ready' ? (
      <CircularProgress />
    ) : (
      <div>
        <div>
          <Chart
            chartType="Timeline"
            loader={<div>Loading Chart</div>}
            data={this.state.chartData || []}
            options={{
              showRowNumber: false
            }}
          />
        </div>
      </div>
    );
  }
}

export default withStyles(styles)(TimelineVisualizer);
