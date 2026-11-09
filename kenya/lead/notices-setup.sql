-- Daraja team notices — the whole set-up, in one block.
--
-- WHY THIS IS ITS OWN SUPABASE PROJECT, AND NOT THE PAY ONE.
-- The testers' page is public: anyone can read its source and take the key out of
-- it. The pay project's key reads daraja_payment, which is every tester's name and
-- what they have been paid. So that key can never go in a public page. This project
-- holds ONE table — messages a manager writes for their own team to read — so its
-- key is safe there, and a tester who takes it can only read what was written for
-- them anyway.
--
-- BEFORE YOU RUN IT: change CHANGE-THIS-WORD below to one word of your own.
-- Anything nobody would guess, no spaces. It is what lets a manager write; without
-- it the app can only read. It goes in the managers' links (as &w=yourword), the
-- same way their key already does, and it never goes into the app's code.
--
-- Tested 9 Nov 2026 on PostgreSQL 16 before it was given to Jerry: anon can read;
-- anon cannot insert, update or delete the table directly; the wrong word is
-- refused; the right word writes; a message over 900 characters is trimmed, not
-- rejected; an unknown team number is refused.

create table if not exists team_notice (
  id      bigserial primary key,
  at      timestamptz not null default now(),
  team    int  not null check (team in (1, 2)),
  manager text not null check (length(manager) between 1 and 60),
  body    text not null check (length(body) between 1 and 900)
);

create index if not exists team_notice_team_at on team_notice (team, at desc);

alter table team_notice enable row level security;

-- READ: open to everybody. That is the point — a tester's phone opens this
-- with nothing but the public key, and sees only messages meant to be read.
drop policy if exists team_notice_read on team_notice;
create policy team_notice_read on team_notice for select to anon using (true);

-- WRITE: there is deliberately NO insert policy, so nothing can write to this
-- table directly, with any key. The only way in is the function below, which
-- checks the word first.
create or replace function add_team_notice(p_word text, p_team int, p_manager text, p_body text)
returns bigint
language plpgsql
security definer
set search_path = public
as $$
declare new_id bigint;
begin
  if p_word is distinct from 'CHANGE-THIS-WORD' then
    raise exception 'not allowed';
  end if;
  insert into team_notice (team, manager, body)
       values (p_team, p_manager, left(coalesce(p_body, ''), 900))
    returning id into new_id;
  return new_id;
end;
$$;

revoke all on function add_team_notice(text, int, text, text) from public;
grant execute on function add_team_notice(text, int, text, text) to anon;
