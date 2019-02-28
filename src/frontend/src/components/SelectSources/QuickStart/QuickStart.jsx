import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import Avatar from "@material-ui/core/Avatar";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import ListItemText from "@material-ui/core/ListItemText";
import Card from "@material-ui/core/Card";
import MapIcon from "@material-ui/icons/Map";
import blue from "@material-ui/core/colors/blue";
import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";
import {
  setSelectedDatasourcesExample,
  changeTabAction
} from "../../../_actions/globals";
import connect from "react-redux/lib/connect/connect";

const samples = [
  {
    label: "Treemap Sample",
    type: "Advanced",
    sparqlEndpointIri: "https://linked.opendata.cz/sparql",
    dataSampleIri:
      "https://raw.githubusercontent.com/linkedpipes/applications/develop/data/rdf/cpv-2008/sample.ttl",
    namedGraph: "http://linked.opendata.cz/resource/dataset/cpv-2008"
  },
  {
    label: "DBPedia Earthquakes",
    type: "Simple",
    URIS: [
      "https://ldcp.opendata.cz/resource/dbpedia/datasource-templates/Earthquake",
      "https://discovery.linkedpipes.com/resource/lod/templates/http---commons.dbpedia.org-sparql"
    ]
  },
  {
    label: "Wikidata Timeline & Map",
    type: "Simple",
    URIS: [
      "https://discovery.linkedpipes.com/resource/discovery/wikidata-06/config",
      "https://discovery.linkedpipes.com/vocabulary/discovery/Input",
      "https://discovery.linkedpipes.com/vocabulary/discovery/hasTemplate",
      "https://discovery.linkedpipes.com/resource/application/map-labeled-points/template",
      "https://discovery.linkedpipes.com/resource/application/map/template",
      "https://discovery.linkedpipes.com/resource/application/timeline-periods/template",
      "https://discovery.linkedpipes.com/resource/application/timeline/template",
      "https://discovery.linkedpipes.com/resource/transformer/schema-enddate-to-dcterms-date/template",
      "https://discovery.linkedpipes.com/resource/transformer/schema-name-to-dcterms-title/template",
      "https://discovery.linkedpipes.com/resource/transformer/schema-startdate-to-dcterms-date/template"
    ]
  }
];
const styles = theme => ({
  avatar: {
    backgroundColor: blue[100],
    color: blue[600]
  },
  card: {
    flexGrow: 1
  },
  label: {
    marginTop: theme.spacing.unit + 5
  }
});

class QuickStartWidget extends React.Component {
  handleClose = () => {
    this.props.onClose("");
  };

  handleListItemClick = sample => {
    this.props.dispatch(
      changeTabAction({
        selectedTab: sample.type == "Simple" ? 0 : 1
      })
    );
    this.props.dispatch(
      setSelectedDatasourcesExample({
        sample: sample
      })
    );
  };

  render() {
    const { classes, onClose, ...other } = this.props;

    return (
      <Card className={classes.card}>
        <Typography
          className={classes.label}
          variant="h5"
          align="center"
          gutterBottom
        >
          Examples
        </Typography>
        <List>
          {samples.map((sample, index) => (
            <ListItem
              button
              onClick={() => this.handleListItemClick(sample)}
              key={index}
            >
              <ListItemAvatar>
                <Avatar className={classes.avatar}>
                  <MapIcon />
                </Avatar>
              </ListItemAvatar>
              <ListItemText primary={sample.label} />

              <Divider />
            </ListItem>
          ))}
        </List>
      </Card>
    );
  }
}

QuickStartWidget.propTypes = {
  classes: PropTypes.object.isRequired,
  onClose: PropTypes.func
};

const mapStateToProps = state => {
  return {};
};

export default connect(mapStateToProps)(withStyles(styles)(QuickStartWidget));
