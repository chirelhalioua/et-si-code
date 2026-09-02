-- À exécuter une seule fois dans l’éditeur SQL de Supabase.

create table if not exists public.game_mistakes (
  user_id uuid not null references auth.users(id) on delete cascade,
  series_id text not null,
  situation_index integer not null check (situation_index >= 0),
  title text not null,
  question text not null,
  selected_answer text not null,
  correct_answer text not null,
  correction text not null default '',
  updated_at timestamptz not null default now(),
  primary key (user_id, series_id, situation_index)
);

alter table public.game_mistakes enable row level security;

drop policy if exists "Les utilisateurs consultent leurs erreurs" on public.game_mistakes;
create policy "Les utilisateurs consultent leurs erreurs"
on public.game_mistakes for select
using (auth.uid() = user_id);

drop policy if exists "Les utilisateurs ajoutent leurs erreurs" on public.game_mistakes;
create policy "Les utilisateurs ajoutent leurs erreurs"
on public.game_mistakes for insert
with check (auth.uid() = user_id);

drop policy if exists "Les utilisateurs modifient leurs erreurs" on public.game_mistakes;
create policy "Les utilisateurs modifient leurs erreurs"
on public.game_mistakes for update
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists "Les utilisateurs suppriment leurs erreurs" on public.game_mistakes;
create policy "Les utilisateurs suppriment leurs erreurs"
on public.game_mistakes for delete
using (auth.uid() = user_id);
