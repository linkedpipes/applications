alter table if exists execution
    add column repeat boolean not null default false,
    add column native boolean not null default true,
    add column frequency_hours int8 not null default -1;

update execution set repeat = false, native = true, frequency_hours = -1;
