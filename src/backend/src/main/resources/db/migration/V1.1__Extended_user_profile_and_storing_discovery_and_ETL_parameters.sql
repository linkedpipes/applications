alter table if exists discovery add column if not exists data_sample_iri varchar(255), add column if not exists finished timestamp, add column if not exists named_graph varchar(255), add column if not exists sparql_endpoint_iri varchar(255);
alter table if exists execution add column if not exists finished timestamp, add column if not exists started timestamp not null;
create table pipeline_information (id int8 not null, etl_pipeline_iri varchar(255) not null, pipeline_id varchar(255) not null, result_graph_iri varchar(255) not null, primary key (id));
