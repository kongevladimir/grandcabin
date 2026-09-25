-- Run once in the project's Supabase SQL editor. No public browser access.
create table if not exists public.booking_state (
  id integer primary key check (id = 1),
  version bigint not null default 0,
  state jsonb not null
);
insert into public.booking_state (id, state)
values (1, '{"bookings":[],"blocks":[],"limits":{},"notices":[]}'::jsonb)
on conflict (id) do nothing;
alter table public.booking_state enable row level security;
revoke all on public.booking_state from anon, authenticated;
grant select, update on public.booking_state to service_role;

create or replace function public.save_booking_state(expected_version bigint, next_state jsonb)
returns boolean language plpgsql security invoker set search_path = '' as $$
begin
  update public.booking_state set state = next_state, version = version + 1
    where id = 1 and version = expected_version;
  return found;
end;
$$;
revoke all on function public.save_booking_state(bigint, jsonb) from public, anon, authenticated;
grant execute on function public.save_booking_state(bigint, jsonb) to service_role;
