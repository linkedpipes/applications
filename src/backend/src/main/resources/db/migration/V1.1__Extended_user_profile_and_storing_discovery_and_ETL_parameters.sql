alter table if exists discovery add column if not exists data_sample_iri TEXT, add column if not exists finished timestamp, add column if not exists named_graph TEXT, add column if not exists sparql_endpoint_iri TEXT;
alter table if exists execution add column if not exists finished timestamp, add column if not exists started timestamp not null;
create table pipeline_information (id int8 not null, etl_pipeline_iri TEXT not null, pipeline_id TEXT not null, result_graph_iri TEXT not null, primary key (id));
alter table if exists lpa_user drop constraint lpa_user_pkey cascade;
alter table if exists lpa_user drop column id;
alter table if exists lpa_user add primary key (web_id);
alter table if exists application alter column user_id type TEXT, add constraint FK99oev92k62cbng2q8vc8pls4o foreign key (user_id) references lpa_user;
alter table if exists discovery alter column user_id type TEXT, add constraint FKtop5vf25njt7utg0jc1744dnx foreign key (user_id) references lpa_user;
alter table if exists execution alter column user_id type TEXT, add constraint FKoh7dx8hd2t7gyruje5yb1k9xm foreign key (user_id) references lpa_user;
