import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import Stepper from "@material-ui/core/Stepper";
import Step from "@material-ui/core/Step";
import StepLabel from "@material-ui/core/StepLabel";
import StepContent from "@material-ui/core/StepContent";
import Button from "@material-ui/core/Button";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import SelectSources from "./SelectSources";
import VisualizerCardCollectionView from "./VisualizerCardCollectionView";
import connect from "react-redux/lib/connect/connect";
import DataSourcesTable from "./DataSourcesTable";
import CreateAppCard from "./CreateAppCard";

const styles = theme => ({
  root: {
    width: "100%"
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
    justifyContent: "center"
  }
});

function getSteps() {
  return [
    "Add Data Source IRIs",
    "Pick a visualizer",
    "Pick a source for execution",
    "Preview & create app"
  ];
}

class CreateAppStepper extends React.Component {
  state = {
    activeStep: 0
  };

  getStepContent(step) {
    const { discoveryId, selectedVisualizer, classes } = this.props;

    switch (step) {
      case 0:
        return <SelectSources handleNextStep={this.handleNext} />;
      case 1:
        return (
          <VisualizerCardCollectionView handleNextStep={this.handleNext} />
        );
      case 2:
        return (
          <DataSourcesTable
            handleNextStep={this.handleNext}
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
        return "Unknown step";
    }
  }

  handleNext = () => {
    this.setState(state => ({
      activeStep: state.activeStep + 1
    }));
  };

  handleBack = () => {
    this.setState(state => ({
      activeStep: state.activeStep - 1
    }));
  };

  handleReset = () => {
    this.setState({
      activeStep: 0
    });
  };

  render() {
    const { classes } = this.props;
    const steps = getSteps();
    const { activeStep } = this.state;

    return (
      <div className={classes.root}>
        <Stepper
          activeStep={activeStep}
          style={{ backgroundColor: "transparent" }}
          orientation="vertical"
        >
          {steps.map((label, index) => {
            return (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
                <StepContent>
                  {this.getStepContent(index)}
                  {index > 0 && (
                    <div className={classes.actionsContainer}>
                      <div>
                        <Button
                          disabled={activeStep === 0}
                          onClick={this.handleBack}
                          className={classes.button}
                        >
                          Back
                        </Button>
                        {activeStep === steps.length && (
                          <Button
                            variant="contained"
                            color="primary"
                            onClick={this.handleNext}
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
            <Button onClick={this.handleReset} className={classes.button}>
              Reset
            </Button>
          </Paper>
        )}
      </div>
    );
  }
}

CreateAppStepper.propTypes = {
  classes: PropTypes.object
};

const mapStateToProps = state => {
  return {
    discoveryId: state.globals.discoveryId,
    selectedVisualizer: state.globals.selectedVisualizer
  };
};

export default connect(mapStateToProps)(withStyles(styles)(CreateAppStepper));
