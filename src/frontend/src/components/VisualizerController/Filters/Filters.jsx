import React from "react";
import ListSubheader from "@material-ui/core/ListSubheader";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import Checkbox from "@material-ui/core/Checkbox";
import Collapse from "@material-ui/core/Collapse";
import Option from "./Options/Options";
import ExpandLess from "@material-ui/icons/ExpandLess";
import ExpandMore from "@material-ui/icons/ExpandMore";
import { withStyles } from "@material-ui/core/styles";
import { connect } from "react-redux";
import {
  TOGGLE_FILTER,
  TOGGLE_EXPAND_FILTER
} from "../../../_constants/filters.constants";

const styles = theme => ({});

const mapStateToProps = state => ({});

// const mapDispatchToProps = dispatch => ({
//   toggleFilter: filter => dispatch({ type: TOGGLE_FILTER, payload: filter }),
//   toggleExpandFilter: filter =>
//     dispatch({ type: TOGGLE_EXPAND_FILTER, payload: filter })
// });

class Filters extends React.Component {
  handleClick = filter => () => {
    this.props.dispatch({ type: TOGGLE_EXPAND_FILTER, payload: filter });
  };

  handleChance = option => () => {
    this.props.dispatch({ type: TOGGLE_EXPAND_FILTER, payload: filter });
  };

  render() {
    const { classes, filters } = this.props;
    return (
      <div>
        <List
          component="nav"
          subheader={
            <ListSubheader disableSticky={true}>
              {filters.length == 0
                ? "No filters available"
                : "Available filters"}
            </ListSubheader>
          }
        >
          {filters.length > 0 &&
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
                            <Option
                              type={filter.type}
                              key={option.skosConcept.uri}
                              option={option}
                              onChange={null}
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
  }
}

export default connect(mapStateToProps)(withStyles(styles)(Filters));
