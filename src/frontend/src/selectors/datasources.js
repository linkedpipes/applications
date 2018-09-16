// Get datasources as plain array of uris

export function getDatasourcesArray(datasources) {
  return datasources.map(source => {
    return source.url;
  });
}

export function getDatasourcesForTTLGenerator(datasourcesForTTLGenerator) {
  return datasourcesForTTLGenerator.map(source => {
    return { Uri: source.url };
  });
}
