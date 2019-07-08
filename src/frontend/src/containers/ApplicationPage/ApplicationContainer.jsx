// @flow
import React, { PureComponent } from 'react';
import { withRouter } from 'react-router-dom';
import { globalActions } from '@ducks/globalDuck';
import { connect } from 'react-redux';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import FiltersComponent from '../CreateVisualizerPage/children/Filters/FiltersComponent';
import { withStyles } from '@material-ui/core/styles';
import { pathOr } from 'rambda';
import { ApplicationConfiguration } from '@storage/models';
import { filtersActions } from '@ducks/filtersDuck';
import { applicationActions } from '@ducks/applicationDuck';
import StorageToolbox from '@storage/StorageToolbox';
import { Log, VisualizersService } from '@utils';
import {
  MapsVisualizer,
  TreemapVisualizer,
  ChordVisualizer
} from '@components';
import { VISUALIZER_TYPE } from '@constants';

type Props = {
  location: Object,
  setColorTheme: Function,
  classes: {
    root: {},
    vizdiv: {},
    filterSideBar: {}
  },
  handleSetFiltersState: Function,
  handleSetSelectedApplicationMetadata: Function,
  handleSetSelectedApplicationData: Function,
  filtersState: Object,
  selectedApplication: ApplicationConfiguration
};

type State = {
  applicationType: string,
  width: number,
  height: number
};

const styles = theme => ({
  root: {
    flex: 1,
    height: '100vh'
  },
  vizdiv: {
    overflow: 'hidden'
  },
  containerView: {
    textAlign: 'center',
    paddingTop: theme.spacing(20)
  },
  filterSideBar: {
    paddingTop: '2rem',
    paddingLeft: '2rem'
  }
});

class ApplicationContainer extends PureComponent<Props, State> {
  state = {
    applicationType: 'Loading',
    width: 0,
    height: 0
  };

  constructor(props) {
    super(props);
    this.updateWindowDimensions = this.updateWindowDimensions.bind(this);
  }

  componentDidMount = async () => {
    this.updateWindowDimensions();
    window.addEventListener('resize', this.updateWindowDimensions.bind(this));

    this.props.setColorTheme(true);

    await this.loadApplicationMetadata();
  };

  componentWillUnmount() {
    window.removeEventListener('resize', this.updateWindowDimensions);
  }

  loadApplicationMetadata = async () => {
    const queryString = await import(
      /* webpackChunkName: "query-string" */ 'query-string'
    );

    const self = this;

    const parsed = queryString.parse(this.props.location.search);
    const applicationMetadataUrl = parsed.applicationIri;

    if (parsed.colorScheme) {
      this.props.setColorTheme(parsed.colorScheme !== 'dark');
    }

    const applicationMetadata = await StorageToolbox.getAppMetadata(
      applicationMetadataUrl,
      this.loadApplicationMetadata,
      true
    ).catch(err => {
      Log.error(err, 'ApplicationContainer');
      self.setState({
        applicationType: VISUALIZER_TYPE.UNDEFINED
      });
    });

    const applicationConfiguration = applicationMetadata.configuration;
    let applicationType = applicationConfiguration.visualizerType;

    await VisualizersService.getGraphExists(
      applicationConfiguration.graphIri
    ).catch(() => {
      applicationType = VISUALIZER_TYPE.UNDEFINED;
    });

    await this.props.handleSetFiltersState(
      applicationConfiguration.filterConfiguration
    );

    await this.props.handleSetSelectedApplicationData(applicationConfiguration);
    await this.props.handleSetSelectedApplicationMetadata(applicationMetadata);

    self.setState({ applicationType });
  };

  updateWindowDimensions = () => {
    this.setState({ width: window.innerWidth, height: window.innerHeight });
  };

  getApplication = (applicationType, applicationConfiguration) => {
    const { filtersState } = this.props;

    switch (applicationType) {
      case VISUALIZER_TYPE.MAP:
      case VISUALIZER_TYPE.ADVANCED_FILTERS_MAP: {
        const selectedResultGraphIri = applicationConfiguration.graphIri;
        return (
          <MapsVisualizer
            selectedResultGraphIri={selectedResultGraphIri}
            isPublished
          />
        );
      }
      case VISUALIZER_TYPE.TREEMAP: {
        const { graphIri } = applicationConfiguration;
        return (
          <TreemapVisualizer
            selectedResultGraphIri={graphIri}
            isPublished
            schemes={pathOr(
              [],
              'filterGroups.schemeFilter.options',
              filtersState
            )}
          />
        );
      }
      case VISUALIZER_TYPE.CHORD: {
        return (
          <ChordVisualizer
            selectedResultGraphIri={applicationConfiguration.graphIri}
            size={this.state.height + this.state.width}
            nodes={pathOr([], 'filterGroups.nodesFilter.options', filtersState)}
            isPublished
          />
        );
      }
      case VISUALIZER_TYPE.UNDEFINED: {
        return (
          <Typography variant="h2" gutterBottom>
            Application was deleted...
          </Typography>
        );
      }
      default:
        return (
          <Typography variant="h2" gutterBottom>
            Loading Application...
          </Typography>
        );
    }
  };

  updateWindowDimensions = () => {
    this.setState({ width: window.innerWidth, height: window.innerHeight });
  };

  render() {
    const { getApplication } = this;
    const visible =
      this.props.filtersState !== null && this.props.filtersState.visible;
    const renderFilters =
      visible && this.state.applicationType !== VISUALIZER_TYPE.MAP;

    return (
      <Grid container className={this.props.classes.root} direction="row">
        {renderFilters && this.state.applicationType !== 'Loading' && (
          <Grid
            item
            lg={4}
            md={5}
            xs={12}
            className={this.props.classes.filterSideBar}
          >
            <FiltersComponent
              editingMode={false}
              filtersState={this.props.filtersState}
              selectedResultGraphIri={this.props.selectedApplication.graphIri}
            />
          </Grid>
        )}
        <Grid
          id="viz-div"
          className={this.props.classes.vizdiv}
          item
          lg={visible ? 8 : 12}
          md={visible ? 7 : 12}
          xs={12}
          style={{
            paddingLeft: visible ? '2rem' : ''
          }}
        >
          <div
            style={{
              height: '95%',
              textAlign: visible ? 'left' : 'center'
            }}
          >
            {getApplication(
              this.state.applicationType,
              this.props.selectedApplication
            )}
          </div>
        </Grid>
      </Grid>
    );
  }
}

const mapStateToProps = state => {
  return {
    filtersState: state.filters.filtersState,
    selectedApplication: state.application.selectedApplication
  };
};

const mapDispatchToProps = dispatch => {
  const setColorTheme = isLight =>
    dispatch(globalActions.setLightColorTheme(isLight));

  const handleSetFiltersState = filters =>
    dispatch(filtersActions.setFiltersState(filters));

  const handleSetSelectedApplicationData = applicationData =>
    dispatch(applicationActions.setApplication(applicationData));

  const handleSetSelectedApplicationMetadata = applicationMetadata =>
    dispatch(applicationActions.setApplicationMetadata(applicationMetadata));

  return {
    setColorTheme,
    handleSetSelectedApplicationData,
    handleSetSelectedApplicationMetadata,
    handleSetFiltersState
  };
};

export const ApplicationPageDemo = withRouter(
  connect(mapStateToProps)(withStyles(styles)(ApplicationContainer))
);

export const ApplicationPage = withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(withStyles(styles)(ApplicationContainer))
);
