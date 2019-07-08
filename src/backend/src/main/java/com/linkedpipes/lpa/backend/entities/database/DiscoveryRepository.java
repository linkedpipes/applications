package com.linkedpipes.lpa.backend.entities.database;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface DiscoveryRepository extends CrudRepository<DiscoveryDao, Long> {
    List<DiscoveryDao> findByDiscoveryId(String discoveryId);
    List<DiscoveryDao> findById(long id);
}
