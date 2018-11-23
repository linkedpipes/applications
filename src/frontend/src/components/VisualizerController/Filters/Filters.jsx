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

const styles = theme => ({});

class Filters extends React.Component {
  state = {
    open: true
  };

  handleClick = () => {
    this.setState(state => ({ open: !state.open }));
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
                  <ListItem button onClick={this.handleClick}>
                    <ListItemText inset primary={filter.property.label} />
                    {this.state.open ? <ExpandLess /> : <ExpandMore />}
                  </ListItem>
                  <Collapse in={this.state.open} timeout="auto" unmountOnExit>
                    {filter.options.length > 0 && (
                      <List component="div" disablePadding>
                        {filter.options.map(option => {
                          return (
                            <Option
                              type={filter.type}
                              key={option.skosConcept.uri}
                              option={option}
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

export default withStyles(styles)(Filters);
