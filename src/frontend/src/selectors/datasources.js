// Get datasources as plain array of uris

export default datasources => {
  return datasources.map(source => {
    return source.url;
  });
};
