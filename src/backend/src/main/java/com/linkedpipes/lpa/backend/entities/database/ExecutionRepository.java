package com.linkedpipes.lpa.backend.entities.database;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ExecutionRepository extends CrudRepository<ExecutionDao, Long> {
    List<ExecutionDao> findByExecutionIri(String executionIri);
}
