-- Crear tabla de troqueles
create table troqueles (
  id bigint generated always as identity primary key,
  codigo_troquel text unique not null,
  cilindro numeric(10,3),
  repeat_in numeric(10,3),
  repeat_mm numeric(10,3),
  ancho_mm numeric(10,3),
  largo_mm numeric(10,3),
  ancho_in numeric(10,3),
  largo_in numeric(10,3),
  gap_ancho numeric(10,3),
  gap_avance numeric(10,3),
  ancho_banda numeric(10,3),
  precorte_integrado boolean default false,
  cavidades_ancho numeric(10,3),
  cavidades_avance numeric(10,3),
  forma text,
  esquinas text,
  precorte_entre_cavidades boolean default false,
  familia_troquel text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default now()
);

-- Índices solicitados
create index idx_troqueles_codigo_troquel on troqueles(codigo_troquel);
create index idx_troqueles_familia_troquel on troqueles(familia_troquel);
create index idx_troqueles_ancho_mm on troqueles(ancho_mm);
create index idx_troqueles_ancho_banda on troqueles(ancho_banda);

-- Habilitar RLS
alter table troqueles enable row level security;

-- Política de lectura pública
create policy "Lectura pública permitida" on troqueles
  for select using (true);
