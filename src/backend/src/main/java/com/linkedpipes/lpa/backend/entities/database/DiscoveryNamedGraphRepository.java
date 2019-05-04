package com.linkedpipes.lpa.backend.entities.database;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface DiscoveryNamedGraphRepository extends CrudRepository<DiscoveryNamedGraphDao, Long> {
}
