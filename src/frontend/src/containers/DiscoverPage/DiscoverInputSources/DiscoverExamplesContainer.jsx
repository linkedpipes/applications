/* eslint-disable max-len */
// @flow
import React, { PureComponent } from 'react';
import DiscoverExamplesComponent from './DiscoverExamplesComponent';
import uuid from 'uuid';

export const samples = [
  {
    id: uuid.v4(),
    inputType: 'SPARQL_ENDPOINT',
    label: 'Treemap Sample',
    type: 'TREEMAP',
    description:
      'This is an example of Treemap visualizer. Using this template will produce a sample Application displaying hierarchical data on a Treemap visualizer.',
    sparqlEndpointIri: 'https://linked.opendata.cz/sparql',
    backgroundColor: '#36498f',
    namedGraph: 'http://linked.opendata.cz/resource/dataset/cpv-2008',
    dataSampleIri:
      'https://gist.githubusercontent.com/ivan-lattak/63801f3e6a9e6105aada4c207d0f8abb/raw/aa2a805a4b14da6fd30711532c4f58692018665b/cpv-2008_sample.ttl'
  },
  // {
  //   id: uuid.v4(),
  //   inputType: 'SPARQL_ENDPOINT',
  //   label: 'Maps Sample',
  //   type: 'MAPS',
  //   description:
  //     'This is an example of Maps visualizer. Using this template will produce a sample Application displaying markers on a Map visualizer.',
  //   sparqlEndpointIri: 'https://lpatest.opendata.cz/sparql',
  //   backgroundColor: '#2d7c9d',
  //   namedGraph: 'https://lpatest.opendata.cz/graphs/ruian-test-buildings',
  //   dataSampleIri:
  //     'https://gist.githubusercontent.com/Ponsietta/1cfcc9cc018c11e39afe1553d0b3f25f/raw/266634bcc2b5bb56b5eed8dbcaf69df9f719cf08/ruian-test-buildings_map_sample.ttl'
  // },
  {
    id: uuid.v4(),
    inputType: 'SPARQL_ENDPOINT',
    label: 'Chord Sample',
    type: 'CHORD',
    description:
      'This is an example of Chord visualizer. Using this template will produce a sample Application displaying data organized into a Chord chart visualizer.',
    sparqlEndpointIri: 'http://lpa-virtuoso:8890/sparql',
    backgroundColor: '#400000',
    namedGraph: 'https://applications.linkedpipes.com/generated-data/chord',
    dataSampleIri:
      'https://gist.githubusercontent.com/ivan-lattak/a8bf22f4bd4a9ea41714a73396f14e68/raw/fd1a52de6ec24bafb294b87361c84a7dad0b80ff/chord_sample.ttl'
  },
  {
    id: uuid.v4(),
    inputType: 'SPARQL_ENDPOINT',
    label: 'Timeline Period Sample',
    type: 'TIMELINE_PERIODS',
    description:
      'This is an example of timeline visualizer used to show periods over time.',
    backgroundColor: '#5F7201',
    sparqlEndpointIri: 'https://linked.opendata.cz/sparql',
    namedGraph:
      'https://ruian.linked.opendata.cz/zdroj/datová-sada/rúian/metadata',
    dataSampleIri:
      'https://gist.githubusercontent.com/Ponsietta/ab395246b14f7f4b9de2d0161fe9d42c/raw/9bcf705beeb0cda348e51840662cc270c4a38596/dcterms_timelineperiod_sample.ttl'
  },
  {
    id: uuid.v4(),
    inputType: 'SPARQL_ENDPOINT',
    label: 'Timeline Instants Sample',
    type: 'TIMELINE',
    description:
      'This is an example of timeline visualizer used to show instants in time.',
    backgroundColor: '#6ed130',
    sparqlEndpointIri: 'https://linked.opendata.cz/sparql',
    namedGraph:
      'https://ruian.linked.opendata.cz/zdroj/datová-sada/rúian/metadata',
    dataSampleIri:
      'https://gist.githubusercontent.com/Ponsietta/26bc1ac0e218d42c235600635bc9b351/raw/5e532dac9c3f03118aa50b957e5ec069a74187e6/objects_with_objects_with_timeline_sample.ttl'
  }
];

type Props = {
  onInputExampleClicked: Function
};

class DiscoverExamplesContainer extends PureComponent<Props> {
  handleListItemClicked = (item: Object) => {
    const { onInputExampleClicked } = this.props;
    const inputExample = item;
    onInputExampleClicked(inputExample);
  };

  render() {
    const { handleListItemClicked } = this;
    return (
      <DiscoverExamplesComponent
        classes={undefined}
        onHandleListItemClick={handleListItemClicked}
        samples={samples}
      />
    );
  }
}

export default DiscoverExamplesContainer;
