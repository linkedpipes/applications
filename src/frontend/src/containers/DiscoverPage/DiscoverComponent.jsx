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
import { ETL_STATUS_TYPE, GoogleAnalyticsWrapper } from '@utils';
import { Container, Typography, Paper } from '@material-ui/core';

const styles = theme => ({
  root: {
    width: '100%'
  },
  gridRoot: {
    flexGrow: 1
  },
  button: {
    marginTop: theme.spacing(1),
    marginRight: theme.spacing(1)
  },
  actionsContainer: {
    marginBottom: theme.spacing(2)
  },
  resetContainer: {
    padding: theme.spacing(3)
  },
  createAppButtons: {
    justifyContent: 'center'
  },

  heroContent: {
    backgroundColor: theme.palette.background.paper,
    padding: theme.spacing(8, 0, 6)
  },

  footer: {
    backgroundColor: theme.palette.background.paper,
    padding: theme.spacing(2)
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
  'Provide your LinkedData sources',
  'Choose visualizer sub-type',
  'Choose a pipeline to execute',
  'Configure, publish and share your Application'
];

type Props = {
  activeStep: number,
  classes: any,
  etlExecutionStatus: any,
  onBackClicked: Function
};

const Discover = ({
  classes,
  activeStep,
  onBackClicked,
  etlExecutionStatus
}: Props) => (
  <React.Fragment>
    <main>
      <Paper className={classes.heroContent}>
        <Container maxWidth="lg">
          <Typography
            component="h1"
            variant="h3"
            align="center"
            color="textPrimary"
            gutterBottom
          >
            Application data preparation workflow
          </Typography>
          <Typography
            variant="h6"
            align="center"
            color="textSecondary"
            paragraph
          >
            Hop up on creating your own Applications based on LinkedData! Choose
            one of our pre-defined templates for supported visualizers or start
            by providing with your own data sources.
          </Typography>
        </Container>
      </Paper>
      <Container className={classes.root} maxWidth="xl">
        <Stepper
          activeStep={activeStep}
          style={{ backgroundColor: 'transparent' }}
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
                          disabled={
                            activeStep === 0 ||
                            etlExecutionStatus === ETL_STATUS_TYPE.Finished
                          }
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
                            onClick={() => {
                              GoogleAnalyticsWrapper.trackEvent({
                                category: 'Discovery',
                                action: 'Pressed create app : step 4'
                              });
                            }}
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
      </Container>
    </main>
    {/* Footer */}
    <Paper className={classes.footer}>
      <Typography variant="h6" align="center" gutterBottom>
        Any questions?
      </Typography>
      <Typography
        variant="subtitle1"
        align="center"
        color="textSecondary"
        component="p"
      >
        Check out the About section for guides, tutorials and documentation :)
      </Typography>
    </Paper>
    {/* End footer */}
  </React.Fragment>
);

export const DiscoverComponent = withStyles(styles)(Discover);
