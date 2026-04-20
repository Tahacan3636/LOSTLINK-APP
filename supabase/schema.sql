-- =====================================================================
-- LostLink — Supabase Şema Kurulumu
-- ---------------------------------------------------------------------
-- Bu SQL'i Supabase > SQL Editor'de "New query" açıp komple yapıştır
-- ve çalıştır. Tek seferde tüm tablo / policy / storage ayarları oluşur.
-- =====================================================================

-- 1) ITEMS TABLOSU -----------------------------------------------------
-- İlanlar burada tutulur. user_id -> auth.users.id'ye bağlı.
create table if not exists public.items (
  id           uuid primary key default gen_random_uuid(),
  user_id      uuid not null references auth.users(id) on delete cascade,
  title        text not null,
  description  text not null,
  category     text not null,
  status       text not null check (status in ('lost','found')),
  image_url    text,
  latitude     double precision,
  longitude    double precision,
  location_text text,
  contact_email text,
  is_recovered boolean not null default false,
  created_at   timestamptz not null default now()
);

create index if not exists items_created_at_idx on public.items (created_at desc);
create index if not exists items_category_idx   on public.items (category);
create index if not exists items_status_idx     on public.items (status);

-- 2) ROW LEVEL SECURITY ------------------------------------------------
-- Kayıt güvenliği: herkes okuyabilir, sadece sahibi yazabilir/silebilir.
alter table public.items enable row level security;

drop policy if exists "items_select_all"   on public.items;
drop policy if exists "items_insert_own"   on public.items;
drop policy if exists "items_update_own"   on public.items;
drop policy if exists "items_delete_own"   on public.items;

create policy "items_select_all"
  on public.items for select
  using (true);

create policy "items_insert_own"
  on public.items for insert
  with check (auth.uid() = user_id);

create policy "items_update_own"
  on public.items for update
  using (auth.uid() = user_id);

create policy "items_delete_own"
  on public.items for delete
  using (auth.uid() = user_id);

-- 3) STORAGE BUCKET ----------------------------------------------------
-- İlan fotoğrafları "item-photos" bucket'ında tutulur (public).
insert into storage.buckets (id, name, public)
  values ('item-photos', 'item-photos', true)
  on conflict (id) do nothing;

drop policy if exists "photos_public_read"   on storage.objects;
drop policy if exists "photos_auth_insert"   on storage.objects;
drop policy if exists "photos_auth_delete"   on storage.objects;

create policy "photos_public_read"
  on storage.objects for select
  using (bucket_id = 'item-photos');

create policy "photos_auth_insert"
  on storage.objects for insert
  with check (bucket_id = 'item-photos' and auth.role() = 'authenticated');

create policy "photos_auth_delete"
  on storage.objects for delete
  using (bucket_id = 'item-photos' and auth.uid()::text = (storage.foldername(name))[1]);
