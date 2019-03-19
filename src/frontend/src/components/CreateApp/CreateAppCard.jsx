import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import connect from 'react-redux/lib/connect/connect';
import MapIcon from '@material-ui/icons/Map';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import { GoogleMapsPopup } from '../Visualizers';

const styles = theme => ({
  root: {
    justifyContent: 'center',
    flex: 1
  },
  card: {},
  input: {}
});

class CreateAppCard extends React.Component {
  render() {
    const { classes, resultGraphIri, filters } = this.props;

    return (
      <Grid container justify="center">
        <Card className={classes.card} style={{ textAlign: 'center' }}>
          <CardActionArea>
            <MapIcon style={{ fontSize: '80px' }} />
            <CardContent>
              <Typography variant="h5" gutterBottom>
                Google Maps App
              </Typography>
            </CardContent>
          </CardActionArea>
          <CardActions classes={{ root: classes.root }}>
            <GoogleMapsPopup
              filters={filters}
              resultGraphIri={resultGraphIri}
            />
          </CardActions>
        </Card>
      </Grid>
    );
  }
}

CreateAppCard.propTypes = {
  classes: PropTypes.object.isRequired
};

const mapStateToProps = state => {
  return {
    resultGraphIri: state.etl.selectedResultGraphIri,
    filters: state.filters
  };
};

export default connect(mapStateToProps)(withStyles(styles)(CreateAppCard));
