import React from 'react';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap'
  },
  button: {
    display: 'block',
    marginTop: theme.spacing(2)
  },
  formControl: {
    width: '100%',
    marginTop: theme.spacing()
  }
});

type Props = {
  classes: any,
  handleChange: Function,
  providerTitle: String
};

const SolidProviderComponent = ({
  classes,
  handleChange,
  providerTitle
}: Props) => {
  return (
    <FormControl className={classes.formControl} margin="normal" fullWidth>
      <InputLabel htmlFor="providerTitle">SOLID provider</InputLabel>
      <Select
        value={providerTitle}
        onChange={handleChange}
        inputProps={{
          id: 'providerTitle'
        }}
      >
        <MenuItem value={''}>
          <em>None</em>
        </MenuItem>
        <MenuItem value={'Inrupt'}>Inrupt</MenuItem>
        <MenuItem value={'Solid Community'}>Solid Community</MenuItem>
      </Select>
    </FormControl>
  );
};

export default withStyles(styles)(SolidProviderComponent);
