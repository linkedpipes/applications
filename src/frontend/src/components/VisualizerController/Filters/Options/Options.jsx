import React from 'react';
import Checkbox from '@material-ui/core/Checkbox';
import Radio from '@material-ui/core/Radio';
import ListItem from '@material-ui/core/ListItem';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import { optionModes as modes } from '../../../../constants/options.constants';
import { filterTypes as types } from '../../../../constants/filters.constants';
import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
  nested: {
    paddingLeft: theme.spacing.unit * 4
  }
});

const Option = ({ option, type, onChange, classes }) => {
  const { count, mode, skosConcept, selected } = option;

  switch (type) {
    case types.CHECKBOX:
      return (
        <ListItem button className={classes.nested}>
          <ListItemText primary={skosConcept.label} />
          <ListItemSecondaryAction>
            <Checkbox
              disabled={mode == modes.ALWAYS_SELECT}
              onChange={onChange}
              checked={selected}
            />
          </ListItemSecondaryAction>
        </ListItem>
      );
    case types.RADIO:
      return (
        <ListItem button className={classes.nested}>
          <ListItemText primary={skosConcept.label} />
          <ListItemSecondaryAction>
            <Radio
              disabled={mode == modes.ALWAYS_SELECT}
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
