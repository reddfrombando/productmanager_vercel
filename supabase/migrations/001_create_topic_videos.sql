-- 001_create_topic_videos.sql
-- Run this in your Supabase SQL editor (or via migrations)

-- Enable the pgcrypto extension if not already enabled (required for gen_random_uuid())
create extension if not exists pgcrypto;

create table if not exists public.topic_videos (
  id uuid primary key default gen_random_uuid(),
  topic_id text not null,
  url text not null,
  added_by text,
  created_at timestamptz default now()
);

create index if not exists idx_topic_videos_topic_id on public.topic_videos(topic_id);
