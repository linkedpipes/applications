// Get datasources as plain array of uris

function getDatasourcesArray(datasources) {
  return datasources.map(source => {
    return source.url;
  });
}

function getDatasourcesForTTLGenerator(datasourcesForTTLGenerator) {
  return datasourcesForTTLGenerator.map(source => {
    return { Uri: source.url };
  });
}

export default {
  getDatasourcesArray,
  getDatasourcesForTTLGenerator
};
