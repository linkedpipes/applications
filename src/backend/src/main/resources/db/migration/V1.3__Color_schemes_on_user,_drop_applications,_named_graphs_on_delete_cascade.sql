drop table if exists application;
alter table if exists lpa_user add column if not exists color VARCHAR(255);
update lpa_user set color = 'BLACK';
alter table if exists discovery_named_graph drop constraint FKy765fuyjbstexc, add constraint FKy765fuyjbstexc foreign key (discovery_id) references discovery on delete cascade;
