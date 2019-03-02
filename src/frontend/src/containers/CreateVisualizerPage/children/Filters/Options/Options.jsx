import React from 'react';
import Checkbox from '@material-ui/core/Checkbox';
import Radio from '@material-ui/core/Radio';
import ListItem from '@material-ui/core/ListItem';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import { optionModes, filterTypes } from '@constants';
import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
  nested: {
    paddingLeft: theme.spacing.unit * 4
  }
});

const Option = ({ option, type, onChange, classes }) => {
  const { count, mode, skosConcept, selected } = option;

  switch (type) {
    case filterTypes.CHECKBOX:
      return (
        <ListItem button className={classes.nested}>
          <ListItemText primary={skosConcept.label} />
          <ListItemSecondaryAction>
            <Checkbox
              disabled={mode == optionModes.ALWAYS_SELECT}
              onChange={onChange}
              checked={selected}
            />
          </ListItemSecondaryAction>
        </ListItem>
      );
    case filterTypes.RADIO:
      return (
        <ListItem button className={classes.nested}>
          <ListItemText primary={skosConcept.label} />
          <ListItemSecondaryAction>
            <Radio
              disabled={mode == optionModes.ALWAYS_SELECT}
              checked={selected}
              onChange={onChange}
            />
          </ListItemSecondaryAction>
        </ListItem>
      );
    default:
      return null;
  }
};

export default withStyles(styles)(Option);
