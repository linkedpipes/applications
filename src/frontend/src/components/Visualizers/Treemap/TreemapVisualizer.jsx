import Chart from "react-google-charts";
import React from "react";
import Grid from "@material-ui/core/Grid";
import Filters from "../../VisualizerController/Filters/Filters";
import { withStyles } from "@material-ui/core/styles";
import { VisualizerControllerHeader } from "../../VisualizerController/Header";

const styles = theme => ({
  root: {
    height: "72vh"
  },
  filterSideBar: {
    overflowY: "auto"
  },
  card: {},
  input: {}
});

const dummyData = [
  [
    "Location",
    "Parent",
    "Market trade volume (size)",
    "Market increase/decrease (color)"
  ],
  ["Global", null, 0, 0],
  ["America", "Global", 0, 0],
  ["Europe", "Global", 0, 0],
  ["Asia", "Global", 0, 0],
  ["Australia", "Global", 0, 0],
  ["Africa", "Global", 0, 0],
  ["Brazil", "America", 11, 10],
  ["USA", "America", 52, 31],
  ["Mexico", "America", 24, 12],
  ["Canada", "America", 16, -23],
  ["France", "Europe", 42, -11],
  ["Germany", "Europe", 31, -2],
  ["Sweden", "Europe", 22, -13],
  ["Italy", "Europe", 17, 4],
  ["UK", "Europe", 21, -5],
  ["China", "Asia", 36, 4],
  ["Japan", "Asia", 20, -12],
  ["India", "Asia", 40, 63],
  ["Laos", "Asia", 4, 34],
  ["Mongolia", "Asia", 1, -5],
  ["Iran", "Asia", 18, 13],
  ["Pakistan", "Asia", 11, -52],
  ["Egypt", "Africa", 21, 0],
  ["S. Africa", "Africa", 30, 43],
  ["Sudan", "Africa", 12, 2],
  ["Congo", "Africa", 10, 12],
  ["Zaire", "Africa", 8, 10]
];

const TreemapVisualizer = ({ props, classes }) => (
  <div>
    <VisualizerControllerHeader
      headerParams={{
        title: "Treemap Example",
        subtitle: "Treemap Visualizer"
      }}
    />
    <Grid container direction="row" spacing={0}>
      <Grid item lg={2} md={4} xs={12} className={classes.filterSideBar}>
        <Filters filters={[]} />
      </Grid>
      <Grid item lg={10} md={8} xs={12}>
        <Chart
          width={"100%"}
          height={"72vh"}
          chartType="TreeMap"
          loader={<div>Loading Chart</div>}
          data={dummyData}
          options={{
            minColor: "#33FF4A",
            midColor: "#33FFEB",
            maxColor: "#334AFF",
            headerHeight: 20,
            fontColor: "black",
            showScale: true
          }}
        />
      </Grid>
    </Grid>
  </div>
);

export default withStyles(styles)(TreemapVisualizer);
