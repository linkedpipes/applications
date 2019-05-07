create table if not exists discovery_named_graph ( id SERIAL, discovery_id int8, named_graph TEXT, primary key (id));
alter table if exists discovery_named_graph add constraint FKy765fuyjbstexc foreign key (discovery_id) references discovery;

insert into discovery_named_graph (discovery_id, named_graph)
    select id as discovery_id, named_graph from discovery;

alter table if exists discovery drop column if exists named_graph;
