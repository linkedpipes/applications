// @flow
import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import Button from '@material-ui/core/Button';
import { Link } from 'react-router-dom';
import DiscoverInputSources from './DiscoverInputSources';
import DiscoverVisualizerPicker from './DiscoverVisualizerPicker';
import DiscoverPipelinesPicker from './DiscoverPipelinesPicker';
import DiscoverPipelinesExecutor from './DiscoverPipelinesExecutor';
import { Container, Typography, Paper } from '@material-ui/core';
import { ETL_STATUS_TYPE, GoogleAnalyticsWrapper } from '@utils';

const styles = theme => ({
  stepperContainer: {
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(2)
  },
  stepperContentContainer: {
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(8)
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
  { label: 'Provide your LinkedData sources', isOptional: false },
  { label: 'Choose visualizer sub-type', isOptional: true },
  { label: 'Choose a pipeline to execute', isOptional: true },
  { label: 'Configure, publish and share your Application', isOptional: false }
];

type Props = {
  activeStep: number,
  classes: any,
  etlExecutionStatus: any,
  onBackClicked: Function,
  sparqlEndpointIri: string,
  dataSampleIri: string,
  namedGraph: string
};

const Discover = ({
  classes,
  activeStep,
  onBackClicked,
  etlExecutionStatus,
  sparqlEndpointIri,
  dataSampleIri,
  namedGraph
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
            variant="body1"
            align="justify"
            color="textSecondary"
            paragraph
          >
            Follow the steps below to prepare the data to be visualized by your
            application. Simply point out where LinkedPipes should search for
            LinkedData sources, sit back and relax. During the second step,
            platform will automatically attempt to extract and identify how this
            data can be visualized and propose you possible visualizers to be
            used, if no multiple choises available it will pick one for your
            automatically. After that, it will transform the LinkedData into a
            format supported by that visualizer by executing a special data
            transformatio pipeline. Finally it will take you to the application
            setup page where you will name your application and publish it to
            share with anyone across the Web!
          </Typography>
        </Container>
      </Paper>
      <Container className={classes.stepperContainer} maxWidth="lg">
        <Stepper
          activeStep={activeStep}
          style={{ backgroundColor: 'transparent' }}
        >
          {steps.map(item => {
            return (
              <Step key={item.label}>
                <StepLabel
                  optional={
                    item.isOptional ? (
                      <Typography variant="caption">
                        Automatically skipped when no multiple options available
                      </Typography>
                    ) : (
                      undefined
                    )
                  }
                >
                  {item.label}
                </StepLabel>
              </Step>
            );
          })}
        </Stepper>
      </Container>
      <Container className={classes.stepperContentContainer} maxWidth="xl">
        {getStepContent(activeStep)}
        {activeStep > 0 && (
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
                  disabled={etlExecutionStatus !== ETL_STATUS_TYPE.Finished}
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
      </Container>
    </main>
    {/* Footer */}
    {activeStep > 0 && (
      <Paper className={classes.footer}>
        <Typography variant="h6" align="center" gutterBottom>
          Here are the LinkedData sources that you provided...
        </Typography>
        <Typography variant="subtitle1" style={{ display: 'inline' }}>
          SPARQL IRI:
        </Typography>{' '}
        <Typography variant="body1">{sparqlEndpointIri || 'N/A'}</Typography>
        <br />
        <Typography variant="subtitle1" style={{ display: 'inline' }}>
          Data sample IRI:
        </Typography>{' '}
        <Typography variant="body1">{dataSampleIri || 'N/A'}</Typography>
        <br />
        <Typography variant="subtitle1" style={{ display: 'inline' }}>
          Named Graph IRIs:
        </Typography>{' '}
        <Typography variant="body1">{namedGraph || 'N/A'}</Typography>
      </Paper>
    )}
    {/* End footer */}
  </React.Fragment>
);

export const DiscoverComponent = withStyles(styles)(Discover);
