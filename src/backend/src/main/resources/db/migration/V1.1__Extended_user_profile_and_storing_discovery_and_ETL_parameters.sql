alter table if exists lpa_user drop constraint if exists lpa_user_pkey cascade, drop column if exists id, add primary key (web_id);
alter table if exists discovery drop column if exists user_id, add column if not exists user_web_id TEXT, add column if not exists data_sample_iri TEXT, add column if not exists finished timestamp, add column if not exists named_graph TEXT, add column if not exists sparql_endpoint_iri TEXT, add constraint FKtop5vf25njt7utg0jc1744dnx foreign key (user_web_id) references lpa_user;;
create table if not exists pipeline_information ( id int8 not null, etl_pipeline_iri TEXT not null, pipeline_id TEXT not null, result_graph_iri TEXT not null, primary key (id));
alter table if exists execution drop column if exists user_id, add column if not exists user_web_id TEXT, add column if not exists finished timestamp, add column if not exists started timestamp not null, add column if not exists pipeline_id int8 not null, add constraint FKoh7dx8hd2t7gyruje5yb1k9xm foreign key (user_web_id) references lpa_user, add constraint FKg5upxfry1wjgn3sxu9nmn7jd6 foreign key (pipeline_id) references pipeline_information;
alter table if exists application drop column if exists user_id, add column if not exists user_web_id TEXT, add constraint FK99oev92k62cbng2q8vc8pls4o foreign key (user_web_id) references lpa_user;
