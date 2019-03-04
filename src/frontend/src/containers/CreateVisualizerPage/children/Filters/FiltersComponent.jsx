import React from 'react';
import ListSubheader from '@material-ui/core/ListSubheader';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Collapse from '@material-ui/core/Collapse';
import OptionsComponent from './Options';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import PropTypes from 'prop-types';

const FiltersComponent = ({ filters }) => (
  <div>
    <List
      component="nav"
      subheader={
        <ListSubheader disableSticky>
          {!filters || filters.length === 0
            ? 'No filters available'
            : 'Available filters'}
        </ListSubheader>
      }
    >
      {filters &&
        filters.length > 0 &&
        filters.map(filter => {
          return (
            <div key={filter.property.uri}>
              <ListItem button onClick={this.handleClick(filter)}>
                <ListItemText inset primary={filter.property.label} />
                {filter.expanded ? <ExpandMore /> : <ExpandLess />}
              </ListItem>
              <Collapse in={filter.expanded} timeout="auto" unmountOnExit>
                {filter.options.length > 0 && (
                  <List component="div" disablePadding>
                    {filter.options.map(option => {
                      return (
                        <OptionsComponent
                          type={filter.type}
                          key={option.skosConcept.uri}
                          option={option}
                          onChange={this.handleOptionChange(
                            filter.property.uri,
                            option.skosConcept.uri
                          )}
                        />
                      );
                    })}
                  </List>
                )}
              </Collapse>
            </div>
          );
        })}
    </List>
  </div>
);

FiltersComponent.propTypes = {
  filters: PropTypes.array
};

export default FiltersComponent;
