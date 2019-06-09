alter table if exists execution add column repeat boolean not null default false, add column frequency_hours int8 not null default -1;
update execution set repeat = false, frequency_hours = -1;
