// @flow
import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Avatar from '@material-ui/core/Avatar';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemText from '@material-ui/core/ListItemText';
import Card from '@material-ui/core/Card';
import MapIcon from '@material-ui/icons/Map';
import blue from '@material-ui/core/colors/blue';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';

const styles = theme => ({
  avatar: {
    backgroundColor: blue[100],
    color: blue[600]
  },
  card: {
    flexGrow: 1
  },
  label: {
    marginTop: theme.spacing() + 5
  }
});

type Props = {
  classes: Object,
  onHandleListItemClick: Function,
  samples: []
};

const DiscoverExamplesComponent = ({
  classes,
  onHandleListItemClick,
  samples
}: Props) => (
  <Card className={classes.card}>
    <Typography
      className={classes.label}
      variant="h5"
      align="center"
      gutterBottom
    >
      Examples
    </Typography>
    <List>
      {samples.map(sample => (
        <ListItem
          button
          onClick={() => onHandleListItemClick(sample)}
          key={sample.id}
        >
          <ListItemAvatar>
            <Avatar className={classes.avatar}>
              <MapIcon />
            </Avatar>
          </ListItemAvatar>
          <ListItemText primary={sample.label} />

          <Divider />
        </ListItem>
      ))}
    </List>
  </Card>
);

export default withStyles(styles)(DiscoverExamplesComponent);
