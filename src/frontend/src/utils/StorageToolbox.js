const FileClient = require("solid-file-client");
var fs = require("fs");
import stringHash from "string-hash";

import data from "@solid/query-ldflex";

export const saveAppToSolid = configuration => {
  console.log(configuration);
  const url = "https://aorumbayev1.inrupt.net/public/lpapps";
  const hash = stringHash(
    JSON.stringify(configuration.type, null, 2) +
      JSON.stringify(configuration.markers, null, 2)
  ).toString();
  const fileUrl = url + "/" + "lpapp" + hash;

  const file = JSON.stringify(configuration, null, 2);

  FileClient.readFolder(url).then(
    folder => {
      console.log(`Read ${folder.name}, it has ${folder.files.length} files.`);
    },
    err => console.log(err)
  );

  FileClient.createFile(fileUrl).then(
    success => {
      console.log(`Created file.`);
      FileClient.updateFile(fileUrl, file, "text/plain").then(
        success => {
          console.log(`Updated file!`);
        },
        err => console.log(err)
      );
    },
    err => console.log(err)
  );
};
