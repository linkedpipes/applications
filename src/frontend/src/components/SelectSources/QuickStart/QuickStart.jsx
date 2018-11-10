import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import Avatar from "@material-ui/core/Avatar";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import ListItemText from "@material-ui/core/ListItemText";
import DialogTitle from "@material-ui/core/DialogTitle";
import Dialog from "@material-ui/core/Dialog";
import MapIcon from "@material-ui/icons/Map";
import blue from "@material-ui/core/colors/blue";

const samples = [
  {
    label: "Sample 1",
    URIS: [
      "https://ldcp.opendata.cz/resource/dbpedia/datasource-templates/Earthquake",
      "https://discovery.linkedpipes.com/resource/lod/templates/http---commons.dbpedia.org-sparql"
    ]
  }
];
const styles = {
  avatar: {
    backgroundColor: blue[100],
    color: blue[600]
  }
};

class QuickStartDialog extends React.Component {
  handleClose = () => {
    this.props.onClose("");
  };

  handleListItemClick = uris => {
    this.props.onClose(uris.join("\n"));
  };

  render() {
    const { classes, onClose, ...other } = this.props;

    return (
      <Dialog
        onClose={this.handleClose}
        aria-labelledby="quick-start-dialog"
        {...other}
      >
        <DialogTitle id="dialog-title">Quick start examples</DialogTitle>
        <div>
          <List>
            {samples.map((sample, index) => (
              <ListItem
                button
                onClick={() => this.handleListItemClick(sample.URIS)}
                key={index}
              >
                <ListItemAvatar>
                  <Avatar className={classes.avatar}>
                    <MapIcon />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText primary={sample.label} />
              </ListItem>
            ))}
          </List>
        </div>
      </Dialog>
    );
  }
}

QuickStartDialog.propTypes = {
  classes: PropTypes.object.isRequired,
  onClose: PropTypes.func
};

export default withStyles(styles)(QuickStartDialog);
