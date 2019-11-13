import { StorageAuthenticationManager } from 'linkedpipes-storage';

class StorageSparqlClient {
  patchFileWithQuery = async (url, query) => {
    try {
      await StorageAuthenticationManager.fetch(url, {
        method: 'PATCH',
        body: query,
        headers: {
          'Content-Type': 'application/sparql-update'
        }
      });
      return true;
    } catch (error) {
      if (error instanceof Response && error.status === 404) return false;
      throw error;
    }
  };
}

export default new StorageSparqlClient();
