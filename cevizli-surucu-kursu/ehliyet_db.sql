-- 1. Users tablosu
create table if not exists users (
    id uuid primary key default gen_random_uuid(),
    name text not null,
    email text unique not null,
    phone text not null,
    created_at timestamp default now()
);

-- 2. Admins tablosu
create table if not exists admins (
    id uuid primary key default gen_random_uuid(),
    name text not null,
    email text unique not null,
    role text default 'admin',
    created_at timestamp default now()
);

-- 3. Appointments tablosu
create table if not exists appointments (
    id uuid primary key default gen_random_uuid(),
    user_id uuid references users(id) on delete cascade,
    admin_id uuid references admins(id) on delete set null,
    appointment_date timestamp not null,
    status text default 'pending' check (status in ('pending','approved','rejected')),
    created_at timestamp default now(),
    updated_at timestamp default now()
);

-- 4. Indexler
create index if not exists idx_appointments_user_id on appointments(user_id);
create index if not exists idx_appointments_status on appointments(status);