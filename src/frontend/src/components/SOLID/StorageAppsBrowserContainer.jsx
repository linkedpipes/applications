import React, { PureComponent } from "react";
import StorageAppsBrowserComponent from "./StorageAppsBrowserComponent";
import { withWebId } from "@inrupt/solid-react-components";
const FileClient = require("solid-file-client");

var tileData = [];

class StorageAppsBrowserContainer extends React.PureComponent {
  componentDidMount() {
    if (this.props.webId) {
      const url = "https://aorumbayev1.inrupt.net/public/lpapps";
      const self = this;
      FileClient.readFolder(url).then(
        folder => {
          console.log(
            `Read ${folder.name}, it has ${folder.files.length} files.`
          );
          folder.files.forEach(function(element) {
            tileData.push({
              img:
                "https://www.iosicongallery.com/icons/google-maps-2014-11-12/512.png",
              title: element.label,
              author: "Altynbek"
            });
          });
          self.forceUpdate();
        },
        err => console.log(err)
      );
    }
  }

  render() {
    const { classes } = this.props;
    const self = this;
    return <StorageAppsBrowserComponent tileData={tileData} />;
  }
}

export default withWebId(StorageAppsBrowserContainer);
