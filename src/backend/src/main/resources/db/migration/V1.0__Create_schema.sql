create sequence hibernate_sequence start 1 increment 1;
create table application (id int8 not null, solid_iri TEXT not null, user_id int8, primary key (id));
create table discovery (id int8 not null, discovery_id TEXT not null, executing boolean not null, started timestamp not null, user_id int8, primary key (id));
create table execution (id int8 not null, execution_iri TEXT not null, selected_visualiser varchar(255) not null, status varchar(255), user_id int8, primary key (id));
create table lpa_user (id int8 not null, web_id TEXT not null, primary key (id));
alter table if exists application add constraint FK99oev92k62cbng2q8vc8pls4o foreign key (user_id) references lpa_user;
alter table if exists discovery add constraint FKtop5vf25njt7utg0jc1744dnx foreign key (user_id) references lpa_user;
alter table if exists execution add constraint FKoh7dx8hd2t7gyruje5yb1k9xm foreign key (user_id) references lpa_user;
