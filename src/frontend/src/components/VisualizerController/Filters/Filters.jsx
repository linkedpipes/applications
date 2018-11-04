import React from "react";
import ListSubheader from "@material-ui/core/ListSubheader";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import Checkbox from "@material-ui/core/Checkbox";
import { withStyles } from "@material-ui/core/styles";

const Filters = function(props) {
  const { filters } = props;
  const styles = theme => ({
    nested: {
      paddingLeft: theme.spacing.unit * 4
    }
  });

  return (
    <div>
      <List
        subheader={
          <ListSubheader disableSticky={true}>
            {filters.length == 0 ? "No filters available" : "Available filters"}
          </ListSubheader>
        }
      >
        {filters.length > 0 &&
          filters.map(filter => {
            return (
              <ListItem button key={filter.property.uri}>
                <ListItemText primary={filter.property.label} />
                <ListItemSecondaryAction>
                  <Checkbox />
                </ListItemSecondaryAction>
              </ListItem>
            );
          })}
      </List>
    </div>
  );
};

// If options.size > 0 then add:
// <Collapse in={this.state.open} timeout="auto" unmountOnExit>
//   <List component="div" disablePadding>
//     <ListItem button className={classes.nested}>
//       <ListItemIcon>
//         <StarBorder />
//       </ListItemIcon>
//       <ListItemText inset primary="Starred" />
//     </ListItem>
//   </List>
// </Collapse>;
// how to track state of each dropdown?

export default Filters;
