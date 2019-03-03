import React, { PureComponent } from 'react';
import FiltersComponent from './FiltersComponent';
import {
  TOGGLE_FILTER,
  TOGGLE_EXPAND_FILTER,
  TOGGLE_CHECKBOX
} from '@constants';
import { connect } from 'react-redux';


class FiltersComponent extends PureComponent {
  handleClick = filter => () => {
    this.props.dispatch({ type: TOGGLE_EXPAND_FILTER, payload: filter });
  };

  handleOptionChange = (filterUri, optionUri) => () => {
    this.props.dispatch({
      type: TOGGLE_CHECKBOX,
      payload: { filterUri, optionUri }
    });
  };

  render() {
    const { classes, filters } = this.props;
    const { handleClick, filters} = this
    return <FiltersComponent filters={filters} handleClick={handleClick} handleOptionChange={handleOptionChange}/>;
  }
}


export default connect(null)(FiltersComponent));
