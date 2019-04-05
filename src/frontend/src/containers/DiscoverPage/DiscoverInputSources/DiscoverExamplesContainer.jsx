import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import DiscoverExamplesComponent from './DiscoverExamplesComponent';
import uuid from 'uuid';
import axios from 'axios';
import { Log } from '@utils';

export const samples = [
  {
    id: uuid.v4(),
    type: 'sparqlEndpoint',
    label: 'Treemap Sample',
    sparqlEndpointIri: 'https://linked.opendata.cz/sparql',
    namedGraph: '',
    dataSampleIri:
      'https://gist.githubusercontent.com/ivan-lattak/63801f3e6a9e6105aada4c207d0f8abb/raw/aa2a805a4b14da6fd30711532c4f58692018665b/cpv-2008_sample.ttl'
  },
  {
    id: uuid.v4(),
    type: 'ttlFile',
    label: 'GoogleMaps Sample',
    fileUrl:
      'https://gist.githubusercontent.com/aorumbayev/a36d768c1058ae7c24863126b16f29a0/raw/a7cb691063ff16b235993ca7e85154bb540b50e7/demo_maps.ttl'
  },
  {
    id: uuid.v4(),
    type: 'sparqlEndpoint',
    label: 'Chord Sample',
    sparqlEndpointIri: 'http://lpa-virtuoso:8890/sparql',
    namedGraph: 'https://applications.linkedpipes.com/generated-data/chord',
    dataSampleIri:
      'https://gist.githubusercontent.com/ivan-lattak/a8bf22f4bd4a9ea41714a73396f14e68/raw/fd1a52de6ec24bafb294b87361c84a7dad0b80ff/chord_sample.ttl'
  }
];

class DiscoverExamplesContainer extends PureComponent {
  handleListItemClicked = item => {
    const { onInputExampleClicked } = this.props;
    const inputExample = item;
    if (item.type === 'ttlFile') {
      axios
        .get(item.fileUrl)
        .then(response => {
          inputExample.dataSourcesUris = response.data;
          onInputExampleClicked(inputExample);
        })
        .catch(error => {
          // handle error
          Log.error(error, 'DiscoverExamplesContainer');
        });
    } else {
      onInputExampleClicked(inputExample);
    }
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

DiscoverExamplesContainer.propTypes = {
  onInputExampleClicked: PropTypes.func.isRequired
};

export default DiscoverExamplesContainer;
