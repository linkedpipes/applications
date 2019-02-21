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
import { CreateAppCard } from '../components/CreateApp';
import DataSourcesTable from '../components/SelectSources/DataSourcesTable';
import VisualizerCardCollectionView from '../components/SelectSources/VisualizerCardCollectionView';
import SelectSources from '../components/SelectSources/SelectSources';
import Grid from '@material-ui/core/Grid';
import { QuickStartWidget } from '../components/SelectSources/QuickStart';

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

const getChildAtStep = (
  classes,
  step,
  onNextClicked,
  onBackClicked,
  discoveryId,
  selectedVisualizer
) => {
  switch (step) {
    case 0:
      return (
        <div className={classes.root}>
          <Grid container spacing={24}>
            <Grid item xs={8} sm={8}>
              <SelectSources handleNextStep={onNextClicked} />
            </Grid>
            <Grid item xs={4} sm={4}>
              <QuickStartWidget />
            </Grid>
          </Grid>
        </div>
      );
    case 1:
      return <VisualizerCardCollectionView handleNextStep={onNextClicked} />;
    case 2:
      return (
        <DataSourcesTable
          handleNextStep={onNextClicked}
          handlePrevStep={onBackClicked}
          discoveryId={discoveryId}
          dataSourceGroups={
            selectedVisualizer !== undefined
              ? selectedVisualizer.dataSourceGroups
              : selectedVisualizer
          }
        />
      );
    case 3:
      return <CreateAppCard />;
    default:
      return 'Unknown step';
  }
};

const DiscoverComponent = ({
  classes,
  activeStep,
  discoveryId,
  selectedVisualizer,
  steps,
  onNextClicked,
  onBackClicked,
  onResetClicked
}) => (
  <div className={classes.root}>
    <Stepper
      activeStep={activeStep}
      style={{ backgroundColor: 'transparent' }}
      orientation="vertical"
    >
      {steps.map((label, index) => {
        return (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
            <StepContent>
              {getChildAtStep(
                classes,
                index,
                onNextClicked,
                onBackClicked,
                discoveryId,
                selectedVisualizer
              )}
              {index > 0 && (
                <div className={classes.actionsContainer}>
                  <div>
                    <Button
                      disabled={activeStep === 0}
                      onClick={onBackClicked}
                      className={classes.button}
                    >
                      Back
                    </Button>
                    {activeStep === steps.length && (
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={onNextClicked}
                        className={classes.button}
                      >
                        Finish
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
    {activeStep === steps.length && (
      <Paper square elevation={0} className={classes.resetContainer}>
        <Typography>All steps completed - nice job 👍</Typography>
        <Button onClick={onResetClicked} className={classes.button}>
          Reset
        </Button>
      </Paper>
    )}
  </div>
);

DiscoverComponent.propTypes = {
  classes: PropTypes.object
};

export default withStyles(styles)(DiscoverComponent);
