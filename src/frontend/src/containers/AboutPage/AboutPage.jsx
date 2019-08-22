/* eslint-disable max-len */
// @flow
import React, { PureComponent } from 'react';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';
import { globalActions } from '@ducks/globalDuck';
import { connect } from 'react-redux';
import {
  Container,
  Paper,
  Grid,
  Button,
  Card,
  CardContent,
  CardActions
} from '@material-ui/core';
import uuid from 'uuid';
import PlatformIcon from '@material-ui/icons/SchoolTwoTone';
import FrontedIcon from '@material-ui/icons/DesktopMacTwoTone';
import BackendIcon from '@material-ui/icons/SettingsApplicationsTwoTone';
import { GoogleAnalyticsWrapper } from '@utils/';
import { GlobalConstants } from '@constants/';

export const documentationCards = [
  {
    label: 'Platform Tutorials',
    description:
      'If you are just starting with the platform, this is the best place to learn more about main concepts and functionality. The website also provides a detailed set of video lessons that will guide you through all application features and help you learn how to use them.',
    icon: PlatformIcon,
    href: GlobalConstants.DOCUMENTATION_URL
  },
  {
    label: 'Frontend Documentation',
    description:
      'This documentation is intented for developers looking for references about frontend implementation of the platform as well as details on code structure, coding conventions, React component design patterns and overview of Components and Containers.',
    icon: FrontedIcon,
    href: GlobalConstants.FRONTEND_DOCUMENTATION_URL
  },
  {
    label: 'Backend Documentation',
    description:
      'This documentation is intented for developers looking for references about backend implementation of the platform as well as details on code structure, and architecture of a backend service.',
    icon: BackendIcon,
    href: GlobalConstants.BACKEND_DOCUMENTATION_URL
  }
];

const styles = theme => ({
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
});

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
                FAQ
              </Typography>
              <Typography
                variant="h6"
                align="center"
                color="textSecondary"
                paragraph
              >
                LinkedPipes Applications platform provide a detailed list of
                documentations, tutorials for both developers and users. Refer
                to details about each of the documentations below.
              </Typography>
            </Container>
          </Paper>
          <Container className={classes.cardGrid} maxWidth="md">
            {/* End hero unit */}
            <Grid container spacing={4}>
              {documentationCards.map(sample => (
                <Grid item key={uuid()} xs={12} sm={6} md={4}>
                  <Card className={classes.card}>
                    <div className={classes.cardMedia}>
                      <sample.icon style={{ fontSize: '75px' }} />
                    </div>
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
                          .toLowerCase()}-about-button`}
                        color="primary"
                        target="_blank"
                        href={sample.href}
                      >
                        Open
                      </Button>
                    </CardActions>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Container>
        </main>
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
