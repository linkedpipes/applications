alter table if exists lpa_user add column if not exists color VARCHAR(255);

update lpa_user set color = 'BLACK';
