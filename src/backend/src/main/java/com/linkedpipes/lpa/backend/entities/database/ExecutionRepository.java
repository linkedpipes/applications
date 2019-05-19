package com.linkedpipes.lpa.backend.entities.database;

import org.springframework.data.repository.CrudRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ExecutionRepository extends CrudRepository<ExecutionDao, Long> {
    List<ExecutionDao> findByExecutionIri(String executionIri);

    @Query(value="select * from execution e where e.pipeline_id = ?1", nativeQuery=true)
    List<ExecutionDao> findExecutionsUsingPipelineNative(long pipelineId);
}
