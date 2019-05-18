alter table if exists discovery_named_graph
    drop constraint FKy765fuyjbstexc,
    add constraint FKy765fuyjbstexc
        foreign key (discovery_id)
        references discovery
        on delete cascade;
