// @flow
import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import StepContent from '@material-ui/core/StepContent';
import Button from '@material-ui/core/Button';
import { Link } from 'react-router-dom';
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

type Props = {
  activeStep: number,
  classes: any,
  etlExecutionStatus: any,
  onBackClicked: Function
};

const DiscoverComponent = ({
  classes,
  activeStep,
  onBackClicked,
  etlExecutionStatus
}: Props) => (
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
                      <Button
                        variant="contained"
                        color="primary"
                        id="create-app-button"
                        className={classes.button}
                        disabled={
                          etlExecutionStatus !== ETL_STATUS_TYPE.Finished
                        }
                        component={Link}
                        to="/create-app"
                      >
                        Create App
                      </Button>
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

export default withStyles(styles)(DiscoverComponent);
