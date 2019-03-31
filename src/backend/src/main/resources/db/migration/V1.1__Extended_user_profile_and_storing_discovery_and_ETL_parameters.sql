alter table if exists discovery add column if not exists data_sample_iri TEXT, add column if not exists finished timestamp, add column if not exists named_graph TEXT, add column if not exists sparql_endpoint_iri TEXT;
alter table if exists execution add column if not exists finished timestamp, add column if not exists started timestamp not null;
create table pipeline_information (id int8 not null, etl_pipeline_iri TEXT not null, pipeline_id uuid not null, result_graph_iri TEXT not null, primary key (id));
