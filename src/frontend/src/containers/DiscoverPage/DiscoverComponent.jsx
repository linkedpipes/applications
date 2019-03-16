import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import StepContent from '@material-ui/core/StepContent';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Emoji from 'react-emoji-render';
import Link from 'react-router-dom/es/Link';
import DiscoverInputSources from './DiscoverInputSources';
import DiscoverVisualizerPicker from './DiscoverVisualizerPicker';
import DiscoverPipelinesPicker from './DiscoverPipelinesPicker';
import DiscoverPipelinesExecutor from './DiscoverPipelinesExecutor';
import { ETL_STATUS_TYPE } from '@utils';

const styles = theme => ({
  root: {
    width: '100%'
  },
  gridRoot: {
    flexGrow: 1
  },
  button: {
    marginTop: theme.spacing.unit,
    marginRight: theme.spacing.unit
  },
  actionsContainer: {
    marginBottom: theme.spacing.unit * 2
  },
  resetContainer: {
    padding: theme.spacing.unit * 3
  },
  createAppButtons: {
    justifyContent: 'center'
  }
});

const getStepContent = step => {
  switch (step) {
    case 0:
      return <DiscoverInputSources />;
    case 1:
      return <DiscoverVisualizerPicker />;
    case 2:
      return <DiscoverPipelinesPicker />;
    case 3:
      return <DiscoverPipelinesExecutor />;

    default:
      return 'Unknown step';
  }
};

const steps = [
  'Add Data Source IRIs',
  'Pick a visualizer',
  'Pick a source for execution',
  'Preview & create app'
];

// 'Pick a source for execution',
// 'Preview & create app'

const DiscoverComponent = ({
  classes,
  activeStep,
  onBackClicked,
  etlExecutionStatus
}) => (
  <div className={classes.root}>
    <Stepper
      activeStep={activeStep}
      style={{ backgroundColor: 'transparent' }}
      orientation="vertical"
    >
      {steps.map((label, step) => {
        return (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
            <StepContent>
              {getStepContent(step)}
              {step > 0 && (
                <div className={classes.actionsContainer}>
                  <div>
                    <Button
                      disabled={activeStep === 0}
                      onClick={onBackClicked}
                      className={classes.button}
                    >
                      Back
                    </Button>
                    {activeStep === steps.length - 1 && (
                      <Link
                        style={{ textDecoration: 'none', color: 'transparent' }}
                        to="/create-app"
                      >
                        <Button
                          variant="contained"
                          color="primary"
                          className={classes.button}
                          disabled={
                            etlExecutionStatus !== ETL_STATUS_TYPE.Finished
                          }
                        >
                          Create App
                        </Button>
                      </Link>
                    )}
                  </div>
                </div>
              )}
            </StepContent>
          </Step>
        );
      })}
    </Stepper>
  </div>
);

DiscoverComponent.propTypes = {
  activeStep: PropTypes.number,
  classes: PropTypes.object.isRequired,
  etlExecutionStatus: PropTypes.any,
  onBackClicked: PropTypes.func,
  onResetClicked: PropTypes.func
};

export default withStyles(styles)(DiscoverComponent);
