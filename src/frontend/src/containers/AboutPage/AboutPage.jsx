// @flow
import React, { PureComponent } from 'react';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';
import { globalActions } from '@ducks/globalDuck';
import { connect } from 'react-redux';
import { Container, Paper, Grid, Link, Button } from '@material-ui/core';
import { GoogleAnalyticsWrapper } from '@utils/';

const useStyles = makeStyles(theme => ({
  icon: {
    marginRight: theme.spacing(2)
  },
  heroContent: {
    backgroundColor: theme.palette.background.paper,
    padding: theme.spacing(8, 0, 6)
  },
  heroButtons: {
    marginTop: theme.spacing(4)
  },
  cardGrid: {
    paddingTop: theme.spacing(8),
    paddingBottom: theme.spacing(8)
  },
  card: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column'
  },
  cardMedia: {
    padding: theme.spacing(2),
    textAlign: 'center'
  },
  cardContent: {
    flexGrow: 1
  },
  footer: {
    backgroundColor: theme.palette.background.paper,
    padding: theme.spacing(2)
  }
}));

type Props = {
  classes: Object,
  location: Object,
  selectedNavigationItem: string,
  handleSetSelectedNavigationItem: Function
};

class AboutPageContainer extends PureComponent<Props> {
  componentDidMount() {
    const page = this.props.location.pathname;

    const {
      selectedNavigationItem,
      handleSetSelectedNavigationItem
    } = this.props;

    if (selectedNavigationItem !== 'about') {
      handleSetSelectedNavigationItem('about');
    }

    GoogleAnalyticsWrapper.trackPage(page);
  }

  render() {
    const { classes } = this.props;

    return (
      <React.Fragment>
        <main>
          {/* Hero unit */}
          <Paper className={classes.heroContent}>
            <Container maxWidth="lg">
              <Typography
                component="h1"
                variant="h3"
                align="center"
                color="textPrimary"
                gutterBottom
              >
                Quick Start
              </Typography>
              <Typography
                variant="h6"
                align="center"
                color="textSecondary"
                paragraph
              >
                Hop up on creating your own Applications based on LinkedData!
                Choose one of our pre-defined templates for supported
                visualizers or start by providing with your own data sources.
              </Typography>
              <div className={classes.heroButtons}>
                <Grid container spacing={2} justify="center">
                  <Grid item>
                    <Link
                      style={{ textDecoration: 'none', color: 'transparent' }}
                      to="/create-application"
                    >
                      <Button variant="contained" color="primary">
                        Create Application
                      </Button>
                    </Link>
                  </Grid>
                  <Grid item>
                    <Button
                      onClick={executeScroll}
                      variant="outlined"
                      color="primary"
                    >
                      Browse templates
                    </Button>
                  </Grid>
                </Grid>
              </div>
            </Container>
          </Paper>
          <Container className={classes.cardGrid} maxWidth="md">
            {/* End hero unit */}
            <Grid {...scrollHtmlAttributes} container spacing={4}>
              {quickStartSamples.map(sample => (
                <Grid item key={uuid()} xs={12} sm={6} md={4}>
                  <Card className={classes.card}>
                    <CardContent className={classes.cardContent}>
                      <Typography gutterBottom variant="h5" component="h2">
                        {sample.label}
                      </Typography>
                      <Typography>{sample.description}</Typography>
                    </CardContent>
                    <CardActions>
                      <Button
                        id={`${sample.label
                          .replace(/ /g, '-')
                          .toLowerCase()}-home-button`}
                        color="primary"
                        onClick={onHandleSampleClick(sample)}
                      >
                        Choose
                      </Button>
                    </CardActions>
                  </Card>
                </Grid>
              ))}
            </Grid>
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
            Check out the About section for guides, tutorials and documentation
            :)
          </Typography>
        </Paper>
        {/* End footer */}
      </React.Fragment>
    );
  }
}

const mapStateToProps = state => {
  return {
    selectedNavigationItem: state.globals.selectedNavigationItem
  };
};

const mapDispatchToProps = dispatch => {
  const handleSetSelectedNavigationItem = item => {
    dispatch(globalActions.setSelectedNavigationItem(item));
  };

  return {
    handleSetSelectedNavigationItem
  };
};

export const AboutPage = withStyles(styles)(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(AboutPageContainer)
);
