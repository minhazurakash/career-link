-- Link legacy jobs to companies by matching company_name (seed data had no company_id).
update public.jobs j
set company_id = c.id
from public.companies c
where j.company_id is null
  and lower(trim(j.company_name)) = lower(trim(c.name));
