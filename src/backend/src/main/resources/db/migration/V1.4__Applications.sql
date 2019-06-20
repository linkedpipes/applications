create table if not exists application (id int8 not null, execution_id int8, user_id TEXT not null, solid_iri TEXT not null, primary key (id));
alter table if exists application add constraint FK_app_exec foreign key (execution_id) references execution, add constraint FK_app_user foreign key (user_id) references lpa_user;
alter table if exists execution add column removed boolean not null default FALSE;
update execution set removed = FALSE;
