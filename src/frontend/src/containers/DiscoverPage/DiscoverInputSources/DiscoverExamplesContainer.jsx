// @flow
import React, { PureComponent } from 'react';
import DiscoverExamplesComponent from './DiscoverExamplesComponent';
import uuid from 'uuid';

export const samples = [
  {
    id: uuid.v4(),
    inputType: 'SPARQL_ENDPOINT',
    label: 'Treemap Sample',
    sparqlEndpointIri: 'https://linked.opendata.cz/sparql',
    namedGraph: 'http://linked.opendata.cz/resource/dataset/cpv-2008',
    dataSampleIri:
      'https://gist.githubusercontent.com/ivan-lattak/63801f3e6a9e6105aada4c207d0f8abb/raw/aa2a805a4b14da6fd30711532c4f58692018665b/cpv-2008_sample.ttl'
  },
  {
    id: uuid.v4(),
    inputType: 'SPARQL_ENDPOINT',
    label: 'Maps Sample',
    sparqlEndpointIri: 'https://lpatest.opendata.cz/sparql',
    namedGraph: 'https://lpatest.opendata.cz/graphs/ruian-test-buildings',
    dataSampleIri:
      'https://gist.githubusercontent.com/Ponsietta/1cfcc9cc018c11e39afe1553d0b3f25f/raw/266634bcc2b5bb56b5eed8dbcaf69df9f719cf08/ruian-test-buildings_map_sample.ttl'
  },
  {
    id: uuid.v4(),
    inputType: 'SPARQL_ENDPOINT',
    label: 'Chord Sample',
    sparqlEndpointIri: 'http://lpa-virtuoso:8890/sparql',
    namedGraph: 'https://applications.linkedpipes.com/generated-data/chord',
    dataSampleIri:
      'https://gist.githubusercontent.com/ivan-lattak/a8bf22f4bd4a9ea41714a73396f14e68/raw/fd1a52de6ec24bafb294b87361c84a7dad0b80ff/chord_sample.ttl'
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
