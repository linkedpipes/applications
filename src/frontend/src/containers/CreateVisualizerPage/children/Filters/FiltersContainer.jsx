import React, { PureComponent } from 'react';
import FiltersComponent from './FiltersComponent';
import PropTypes from 'prop-types';
import {
  TOGGLE_FILTER,
  TOGGLE_EXPAND_FILTER,
  TOGGLE_CHECKBOX
} from '@constants';
import { connect } from 'react-redux';

class FiltersContainer extends PureComponent {
  render() {
    const { filters, handleClick, handleOptionChange } = this.props;
    return (
      <FiltersComponent
        filters={filters}
        handleClick={handleClick}
        handleOptionChange={handleOptionChange}
      />
    );
  }
}

FiltersContainer.propTypes = {
  filters: PropTypes.array,
  handleClick: PropTypes.func,
  handleOptionChange: PropTypes.func
};

const mapDispatchToProps = dispatch => {
  const onFilterExpand = filter =>
    dispatch({ type: TOGGLE_EXPAND_FILTER, payload: filter });
  const onOptionChange = (filterUri, optionUri) =>
    dispatch({
      type: TOGGLE_CHECKBOX,
      payload: { filterUri, optionUri }
    });

  return {
    onFilterExpand,
    onOptionChange
  };
};

export default connect(
  null,
  mapDispatchToProps
)(FiltersContainer);
