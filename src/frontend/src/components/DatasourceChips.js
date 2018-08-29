import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import Avatar from "@material-ui/core/Avatar";
import Chip from "@material-ui/core/Chip";
import Paper from "@material-ui/core/Paper";
import TagFacesIcon from "@material-ui/icons/TagFaces";
import { connect } from "react-redux";
import { removeSource } from "../actions/datasources";

const styles = theme => ({
  chip: {
    margin: theme.spacing.unit / 2
  }
});

class DatasourceChips extends React.Component {
  handleDelete = data => () => {
    this.props.dispatch(removeSource({ id: data.id }));
  };

  render() {
    const { classes, datasources } = this.props;

    return (
      <Paper className={classes.root}>
        {datasources.map(data => {
          let avatar = null;

          if (data.label === "React") {
            avatar = (
              <Avatar>
                <TagFacesIcon className={classes.svgIcon} />
              </Avatar>
            );
          }

          return (
            <Chip
              key={data.key}
              avatar={avatar}
              label={data.name}
              onDelete={this.handleDelete(data)}
              className={classes.chip}
            />
          );
        })}
      </Paper>
    );
  }
}

DatasourceChips.propTypes = {
  classes: PropTypes.object.isRequired
};

const mapStateToProps = state => {
  console.log(state);
  return {
    datasources: state.datasources
  };
};

export default connect(mapStateToProps)(withStyles(styles)(DatasourceChips));
