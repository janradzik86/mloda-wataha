-- Młoda Wataha — ETAP 1 schema.
-- Role lives here, never in the client. Better Auth owns "user".

create table if not exists user_roles (
  user_id    text not null,
  role       text not null,
  granted_by text,
  created_at timestamptz not null default now(),
  primary key (user_id, role)
);
create index if not exists user_roles_role_idx on user_roles (role);

create table if not exists role_permissions (
  role       text not null,
  permission text not null,
  primary key (role, permission)
);

create table if not exists learner_profiles (
  user_id           text primary key,
  display_name      text not null default '',
  age               integer,
  school_class      integer,
  preferred_style   text not null default 'simple',
  learning_pace     text not null default 'steady',
  strong_topics     text[] not null default '{}',
  review_topics     text[] not null default '{}',
  last_school_topics text[] not null default '{}',
  last_subject      text,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now()
);

create table if not exists subjects (
  id         text primary key,
  name_pl    text not null,
  sort_order integer not null default 0
);

create table if not exists topics (
  id           text primary key,
  subject_id   text not null references subjects(id),
  title        text not null,
  class_band   text,
  status       text not null default 'draft'
);

create table if not exists lessons (
  id         text primary key,
  topic_id   text not null references topics(id),
  title      text not null,
  body       text not null default '',
  sort_order integer not null default 0
);

create table if not exists questions (
  id         text primary key,
  topic_id   text not null references topics(id),
  prompt     text not null,
  skill      text not null default '',
  expected   text not null default '',
  explanation text not null default ''
);

create table if not exists learning_progress (
  id           text primary key,
  user_id      text not null,
  topic_id     text not null,
  status       text not null default 'seen',
  last_decision text,
  updated_at   timestamptz not null default now()
);
create index if not exists learning_progress_user_idx on learning_progress (user_id);

create table if not exists diagnostic_results (
  id          text primary key,
  user_id     text not null,
  topic_id    text,
  mastered    boolean not null default false,
  weak_skills text[] not null default '{}',
  decision    text not null,
  created_at  timestamptz not null default now()
);

create table if not exists lollipops (
  user_id    text primary key,
  balance    integer not null default 0,
  updated_at timestamptz not null default now()
);

create table if not exists lollipop_ledger (
  id          text primary key,
  user_id     text not null,
  delta       integer not null,
  reason      text not null,
  topic_id    text,
  created_at  timestamptz not null default now()
);

create table if not exists den_items (
  id          text primary key,
  slug        text not null unique,
  title       text not null,
  kind        text not null,
  cost        integer not null default 0,
  available   boolean not null default false
);

create table if not exists den_unlocks (
  user_id    text not null,
  item_id    text not null references den_items(id),
  unlocked_at timestamptz not null default now(),
  primary key (user_id, item_id)
);

create table if not exists family_links (
  id              text primary key,
  parent_user_id  text,
  child_user_id   text,
  status          text not null default 'pending_code',
  pairing_hash    text,
  pairing_hint    text,
  expires_at      timestamptz,
  created_at      timestamptz not null default now(),
  activated_at    timestamptz,
  revoked_at      timestamptz
);
create index if not exists family_links_child_idx on family_links (child_user_id);
create index if not exists family_links_parent_idx on family_links (parent_user_id);

create table if not exists parent_consents (
  id          text primary key,
  link_id     text not null references family_links(id),
  kind        text not null,
  granted     boolean not null default false,
  granted_at  timestamptz
);

create table if not exists bridge_requests (
  id              text primary key,
  child_user_id   text not null,
  parent_user_id  text,
  kind            text not null,
  payload_json    text not null default '{}',
  status          text not null,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

create table if not exists song_requests (
  id              text primary key,
  child_user_id   text not null,
  parent_user_id  text,
  title           text not null default '',
  message         text not null default '',
  status          text not null,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

create table if not exists notifications (
  id          text primary key,
  audience    text not null,
  user_id     text not null,
  title       text not null,
  body        text not null default '',
  href        text,
  read        boolean not null default false,
  created_at  timestamptz not null default now()
);

create table if not exists feature_flags (
  key        text primary key,
  enabled    boolean not null default true,
  note       text
);

insert into role_permissions (role, permission) values
  ('USER', 'user.self.read'),
  ('USER', 'user.self.write'),
  ('USER', 'user.lessons.read'),
  ('USER', 'user.wilk.ask'),
  ('USER', 'user.requests.create'),
  ('USER', 'family.link.use'),
  ('ADMIN', 'admin.content.write'),
  ('ADMIN', 'admin.knowledge.write'),
  ('ADMIN', 'admin.rewards.configure'),
  ('ADMIN', 'admin.users.read'),
  ('ADMIN', 'admin.bridge.review'),
  ('ADMIN', 'admin.system.configure')
on conflict do nothing;

insert into subjects (id, name_pl, sort_order) values
  ('math', 'Matematyka', 1),
  ('polish', 'Język polski', 2),
  ('english', 'Angielski', 3),
  ('science', 'Przyroda', 4),
  ('biology', 'Biologia', 5),
  ('geography', 'Geografia', 6),
  ('history', 'Historia', 7),
  ('physics', 'Fizyka', 8),
  ('chemistry', 'Chemia', 9),
  ('computer_science', 'Informatyka', 10)
on conflict do nothing;

insert into feature_flags (key, enabled, note) values
  ('young_wolf_engine', false, 'Czeka na integrację brancha chatgpt/mlody-wilk-v0.1'),
  ('nora_shop', false, 'ETAP 3'),
  ('song_requests', true, 'Przepływ z zgodą rodzica — ETAP 1 kontrakt'),
  ('family_bridge', true, 'Kontrakt API ETAP 1')
on conflict do nothing;
