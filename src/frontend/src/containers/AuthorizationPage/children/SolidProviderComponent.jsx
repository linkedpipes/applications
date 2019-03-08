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
    marginTop: theme.spacing.unit * 2
  },
  formControl: {
    margin: theme.spacing.unit,
    width: '100%',
    marginTop: theme.spacing.unit
  }
});

type Props = {
  classes: any,
  handleClose: Function,
  handleOpen: Function,
  handleChange: Function,
  provider: String,
  open: Boolean
};

const SolidProviderComponent = ({
  classes,
  handleClose,
  handleOpen,
  handleChange,
  provider,
  open
}: Props) => {
  return (
    <FormControl className={classes.formControl}>
      <InputLabel htmlFor="provider-select">Provider</InputLabel>
      <Select
        open={open}
        onClose={handleClose}
        onOpen={handleOpen}
        value={provider}
        onChange={handleChange}
        inputProps={{
          name: 'provider',
          id: 'provider-select'
        }}
      >
        <MenuItem value="">
          <em>None</em>
        </MenuItem>
        <MenuItem value={'Inrupt'}>Inrupt</MenuItem>
        <MenuItem value={'Solid Community'}>Solid Community</MenuItem>
      </Select>
    </FormControl>
  );
};

export default withStyles(styles)(SolidProviderComponent);
