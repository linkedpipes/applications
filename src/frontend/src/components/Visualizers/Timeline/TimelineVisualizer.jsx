// @flow
import React from 'react';
import Chart from 'react-google-charts';
import { withStyles } from '@material-ui/core/styles';
import { VisualizersService } from '@utils';
import CircularProgress from '@material-ui/core/CircularProgress';
import uuid from 'uuid';
import { connect } from 'react-redux';

// type Props = {
//   classes: {
//     progress: number,
//     formControl: string,
//     selectEmpty: string,
//     wrapper: any
//   },
//   selectedResultGraphIri: string,
//   handleSetCurrentApplicationData: Function,
//   isPublished: boolean,
//   selectedScheme: string
// };

// type State = {
//   dataLoadingStatus: string,
//   chartData: Array<Array<any>>
// };

const styles = theme => ({});

class TimelineVisualizer extends React.PureComponent<Props, State> {
  //   constructor(props: Props) {
  //     super(props);
  //     this.state = {
  //       dataLoadingStatus: 'loading',
  //       chartData: []
  //     };
  //   }

  async componentDidMount() {
    const {
      handleSetCurrentApplicationData,
      isPublished,
      selectedResultGraphIri
    } = this.props;

    if (!isPublished) {
      handleSetCurrentApplicationData({
        id: uuid.v4(),
        applicationEndpoint: 'treemap',
        conceptIri: this.props.selectedScheme, // TODO: change Confusing Naming
        selectedResultGraphIri: this.props.selectedResultGraphIri,
        visualizerCode: 'TIMELINE'
      });
    }
  }

  //   componentWillReceiveProps(nextProps) {}

  render() {
    return (
      <div>
        <div>
          <Chart
            chartType="Timeline"
            loader={<div>Loading Chart</div>}
            data={[
              [
                { type: 'string', id: 'President' },
                { type: 'date', id: 'Start' },
                { type: 'date', id: 'End' }
              ],
              ['Washington', new Date(1789, 3, 30), new Date(1797, 2, 4)],
              ['Adams', new Date(1797, 2, 4), new Date(1801, 2, 4)],
              ['Jefferson', new Date(1801, 2, 4), new Date(1809, 2, 4)]
            ]}
            options={{
              showRowNumber: false
            }}
            rootProps={{ 'data-testid': '1' }}
          />
        </div>
      </div>
    );
  }
}

// const mapStateToProps = (state, ownProps) => {
//   return {
//     selectedScheme: state.filters.selectedScheme || ownProps.selectedScheme
//   };
// };

// export default connect(mapStateToProps)(withStyles(styles)(TreemapVisualizer));
export default withStyles(styles)(TimelineVisualizer);
