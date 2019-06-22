// @flow
import React from 'react';
import Chart from 'react-google-charts';
import { withStyles } from '@material-ui/core/styles';
import { VisualizersService } from '@utils';
import CircularProgress from '@material-ui/core/CircularProgress';
import { VISUALIZER_TYPE } from '@constants';
import uuid from 'uuid';
import { connect } from 'react-redux';

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
  visualizerCode: string
};

type State = {
  dataLoadingStatus: string,
  chartData: Array<Array<any>>
};

const styles = theme => ({});

class TimelineVisualizer extends React.PureComponent<Props, State> {
  // Row label	Bar label (optional)	Tooltip (optional)	Start	End
  static transformData(visualizerCode, apiData) {
    switch (visualizerCode) {
      case VISUALIZER_TYPE.LABELED_TIMELINE:
      case VISUALIZER_TYPE.TIMELINE:
      case VISUALIZER_TYPE.TIMELINE_PERIODS:
      case VISUALIZER_TYPE.LABELED_TIMELINE_PERIODS:
        return [
          [
            { type: 'string', id: 'Label' },
            { type: 'string', id: 'URI' },
            { type: 'date', id: 'Start' },
            { type: 'date', id: 'End' }
          ],
          apiData.map(i => [i.uri, i.uri, new Date(i.start), new Date(i.end)])
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
    const { selectedResultGraphIri } = this.props;

    // if (!isPublished) {
    //   handleSetCurrentApplicationData({
    //     id: uuid.v4(),
    //     applicationEndpoint: 'treemap',
    //     selectedResultGraphIri,
    //     visualizerCode: 'TIMELINE'
    //   });
    // }

    const instantsRequest = await VisualizersService.getTimelineIntervals(
      selectedResultGraphIri
    );

    const instantsResponse = await instantsRequest.data;
    const chartData = TimelineVisualizer.transformData(
      VISUALIZER_TYPE.LABELED_TIMELINE_PERIODS,
      instantsResponse
    );
    this.setState({ dataLoadingStatus: 'ready', chartData });
  }

  //   componentWillReceiveProps(nextProps) {}

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
